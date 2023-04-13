import axios from "axios"
import { fetchLongText } from './longText'

const GetPostsByRangeApiURL = `https://weibo.com/ajax/statuses/searchProfile`

let page = 1
let total = 0
let count = 0
let loadMore = true
let speechlessListEL
let starttime 
let endtime
let _callback

// 拉取间隔时间
let interval = 1000

// 上一次拉取时间
let lastFetchTimeStamp = 0


const delay = function (timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    })
}

// 每添加一个卡片，就要更新一次页面的状态
const updateWholePageState = function () {
    window.scrollTo(0, document.body.scrollHeight);
    count++
    _callback({
        type:'count',
        value: count
    })
}

// 把页面上的其他元素移除，并且初始化挂载节点
const generateHTML = function () {
    document.getElementById('app').remove()
    speechlessListEL = document.createElement('div')
    speechlessListEL.classList = "speechless-list"
    document.body.append(speechlessListEL)
}

// 格式化时间
const getDate = function (dateString, showSecond) {
    let date = new Date(dateString)
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let fillWithZero = function (num) {
        if (parseInt(num) < 10) {
            return '0' + num.toString()
        }
        else return num.toString()
    }
    return year + '/' + fillWithZero(month) + '/' + fillWithZero(day) + ' ' + fillWithZero(hour) + ':' + fillWithZero(minute) + (showSecond ? (':' + fillWithZero(second)) : '')

}

// 过滤多余的换行
const clearLineBreak = function (text) {
    let textClear = text.replace(/\n/g, '<br/>')
    textClear = textClear.replace(/(<br\s?\/>)+/g, '<br/>')
    return textClear
}


// 把卡片添加到页面中
const appendPostToBody = function (post) {

    let metaHTML = ''

    metaHTML += `<div class="meta">
                <div class="meta-info">
                    <span class="date">${getDate(post.created_at)}</span>`
    if (post.region_name) {
        metaHTML += `<div class="region">${post.region_name.replace('发布于 ', '')}</div>`
    }
    metaHTML += `</div></div>`

    let textHTML = `<div class="text">${clearLineBreak(post.long_text || post.text)}</div>`

    let retweetHTML = ''
    if (post.retweeted_status && post.retweeted_status.user) {
        retweetHTML += `<div class="retweet">`
        retweetHTML += `${post.retweeted_status.user.screen_name ? post.retweeted_status.user.screen_name : ''}<span style="margin:0 3px;">:</span>${clearLineBreak(post.retweeted_status.long_text || post.retweeted_status.text)}`
        retweetHTML += `</div>`
    }

    let mediaHTML = ''
    if (post.pic_infos) {
        mediaHTML += '<div class="media">'
        for (let key in post.pic_infos) {
            mediaHTML += `<img class="image" src="${post.pic_infos[key].bmiddle.url}" />`
        }
        mediaHTML += '</div>'
    }

    let postHTML = `
        ${metaHTML}
        <div class="main">
        ${textHTML}
        ${retweetHTML}
        ${mediaHTML}            
        </div>`

    let node = document.createElement('div')
    node.className = 'speechless-post'
    node.innerHTML = postHTML

    speechlessListEL.appendChild(node)
    updateWholePageState()

}

// 拉取数据，并且格式化
const doFetch = async function (parameters) {
    if (!parameters) parameters = {}
    const fetchResp = await axios.get(GetPostsByRangeApiURL, {
        params: parameters
    })

    try {
        let resp = fetchResp.data.data
        let list = resp.list
        await formatPosts(list, parameters.uid)
        return resp
    }
    catch (err) {
        console.error(err)
        return
    }
}

// 处理每一批的列表
const formatPosts = async function (posts, uid) {
    let _list = []

    for (let post of posts) {
        if (post.user.id != uid) continue;
        if (!!post.isLongText) {
            try {
                let longtextData = await fetchLongText(post.mblogid)
                post.long_text = longtextData.longTextContent || ''
            }
            catch (err) { console.error(err) }
        }
        if (post.retweeted_status && post.retweeted_status.isLongText) {
            try {
                let longtextData = await fetchLongText(post.retweeted_status.mblogid)
                post.retweeted_status.long_text = longtextData.longTextContent || ''
            }
            catch (err) { console.error(err) }
        }
        appendPostToBody(post)
        _list.push(post)
    }

    return _list
}


// 补充按照月份拉取的数据参数
const getMonthParameters = function (ymstr) {
    let result = ymstr.split('|')
    let y = result[0]
    let m = result[1]
    return {
        displayYear: y,
        curMonth: m,
        stat_date: '' + y + (m < 10 ? '0' : '') + m
    }
}

function getLastDayTimestamp(obj) {
    let {year, month} = obj
    const nextMonth = month + 1;
    const nextMonthFirstDay = new Date(year, nextMonth - 1, 1);
    nextMonthFirstDay.setHours(0, 0, 0, 0);
    const lastDayTimestamp = nextMonthFirstDay.getTime() - 1;
    return Math.floor(lastDayTimestamp/1000);
  }

function getFirstDayTimestamp(obj) {
    let {year, month} = obj
    const firstDay = new Date(year, month - 1, 1);
    firstDay.setHours(0, 0, 0, 0);
    const firstDayTimestamp = firstDay.getTime();
    return Math.floor(firstDayTimestamp/1000)
  }
  

// 拉取主要函数
export const fetchPost = async function (parameters, callback) {
    _callback = callback

    console.log(parameters)
    generateHTML()

    let { uid, sourceType, rangeType, range} = parameters

    let requestParam = {
        uid,
        page,
        feature:4,
    }
    // if(rangeType == 1){        
        requestParam = {
            ...requestParam,
            starttime: getFirstDayTimestamp(range.start),
            endtime: getLastDayTimestamp(range.end)
        }
    // }

    console.log(requestParam)
        return
    
    while (page < 10 && loadMore) {
        
        requestParam.page = page
        
        let respData = await doFetch(requestParam)
        
        console.log(respData)

        if(respData?.list?.length > 0){
            total = respData.total
            _callback({
                type:'total',
                value: total
            })
        }
        else{
            loadMore = false
        }        
        page ++

    }
}