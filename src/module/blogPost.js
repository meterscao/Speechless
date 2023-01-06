import axios from "axios"
import { fetchLongText } from './longText'

const GetPostsApiURL = `https://weibo.com/ajax/statuses/mymblog`

let page = 1
let since_id = ''
let total = 0
let count = 0
let loadMore = true
let forcePause = false
let uid
let speechlessListEL

// 每添加一个卡片，就要更新一次页面的状态
const updateWholePageState = function () {
    window.scrollTo(0, document.body.scrollHeight);
    count++
    // setProgress()
}

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

const doFetch = async function (parameters) {
    if (!parameters) parameters = {}
    const fetchResp = await axios.get(GetPostsApiURL, {
        params: parameters
    })

    try {
        let resp = fetchResp.data.data
        let list = resp.list
        await formatPosts(list,parameters.uid)
        return resp

    }
    catch (err) {
        console.error(err)
        return
    }
}

// 处理每一批的列表
const formatPosts = async function (posts,uid) {
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


const getMonthParameters = function(ymstr){
    let result = ymstr.split('|')
    let y = result[0]
    let m = result[1]
    return {
        displayYear: y,
        curMonth:m,
        stat_date: '' + y + (m<10?'0':'') + m 
    }

}


const getRangeMonths = function(yearMap,range){
    if(!yearMap) return []
    if(!range) return []

    let historyMonths = []    
    for(let y = range.start.year ; y <= range.end.year ; y++){
        for(let m = 1 ;  m <= 12  ; m++){
            if(y == range.start.year && m < range.start.month) continue
            if(y == range.end.year && m > range.end.month) break            
            historyMonths.push(`${y}|${m}`)            
        }
    }

    let mapMonths = []
    for (const year in yearMap) {        
        const monthsInYear = yearMap[year];
        mapMonths = mapMonths.concat([],monthsInYear.map(month => {
            return `${year}|${month}`
        }))
    }
    
    let rangeMonths = mapMonths.filter(function(m){ return historyMonths.indexOf(m) > -1 })
    console.log('rangeMonths :' ,rangeMonths)

    return rangeMonths

}

export const fetchPost = async function (parameters,rangeConfig) {

    generateHTML()

    let {uid,feature} = parameters
    let {yearMap,range} = rangeConfig

    console.log('yearMap',yearMap)
    console.log('range',range)

    let rangeMonths = getRangeMonths(yearMap,range)
    let rangeIndex = 0
    let rangeParams = {}

    // 0|全部 1|原创
    let sourceType = parameters.feature || 0    

    let requestParam = {
        uid,
        feature,
    }

    while (loadMore && page < 5) {
        if(range){
            if(rangeMonths.length == 0) break
            rangeParams = getMonthParameters(rangeMonths[rangeIndex])
        }
        let respData = await doFetch({
            ...requestParam,
            ...rangeParams,
            since_id,
            page
        })
        if (respData) {            
            //  如果是原创
            if (sourceType == 1) {
                loadMore = respData.total == -1
            }
            // 如果是全部
            else {
                since_id = respData.since_id
                total = respData.total
                loadMore = !!respData.since_id
            }
        }
        page++
    }
}