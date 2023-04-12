import axios from "axios"
import { fetchLongText } from './longText'

const GetPostsApiURL = `https://weibo.com/ajax/statuses/mymblog`

const GetPostsByRangeApiURL = `https://weibo.com/ajax/statuses/searchProfile?uid=2692903952&page=1&feature=4&starttime=1680451200&endtime=1680710400`

let page = 1
let since_id = ''
let total = 0
let count = 0
let loadMore = true
let forcePause = false
let speechlessListEL

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
    // setProgress()
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

// 切换顶部的emoji
const switchEmoji = function (state) {
    if (!state) state = 'default'
    $('.speechless-logo').text(emojiMap.get(state))
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
    const fetchResp = await axios.get(GetPostsApiURL, {
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

// 拉取主要函数
export const fetchPost = async function (parameters, rangeConfig) {

    console.log(parameters)
    return

    generateHTML()

    let { uid, feature } = parameters
    let { isByRange, yearMap, range } = rangeConfig

    console.log('yearMap', yearMap)
    console.log('range', range)

    let rangeMonths = getRangeMonths(yearMap, range)
    let rangeIndex = 0
    let rangeParams = {}

    // 0|全部 1|原创
    let sourceType = parameters.feature || 0

    let requestParam = {
        uid,
        feature,
    }

    while (loadMore) {
        if (isByRange) {
            if (!rangeMonths[rangeIndex]) break
            rangeParams = getMonthParameters(rangeMonths[rangeIndex])
        }
        let respData = await doFetch({
            ...requestParam,
            ...rangeParams,
            since_id,
            page
        })

        page++

        if (respData) {

            if (respData.total > 0) {
                since_id = respData.since_id
                total = respData.total
                loadMore = !!respData.since_id
            }

            else if (respData.total == -1) {

            }

            else if (!respData.total) {
                // 如果是按照月份，需要拉下一个月份
                if (isByRange) {
                    rangeIndex++
                    page = 1

                }
                else {
                    loadMore = false
                }
            }
        }

    }
}