(async function () {
    'use strict';
    const $ = jQuery

    const body = $('body')
    let page = 1
    let since_id = ''
    let total = 0
    let count = 0
    let loadMore = true

    let $progressCount 
    let $progressBar


    // 声明fetch方法
    const fetchData = function (config) {
        let url = config.url
        let param = config.parameters || {}

        return new Promise((resolve, reject) => {
            let method = config.method || 'get'
            $.ajax({
                type: method.toUpperCase(),
                url,
                data: param,
                success: function (response) {
                    console.log(response)
                    resolve(response.data)
                },
                error: function (error) {
                    console.log(error)
                    reject(error)
                }
            })
        })
    }

    // 格式化时间
    const getDate = function (dateString) {
        let date = new Date(dateString)
        let hour = date.getHours()
        let minute = date.getMinutes()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        let fillWithZero = function (num) {
            if (parseInt(num) < 10) {
                return '0' + num.toString()
            }
            else return num.toString()
        }
        return year + '/' + fillWithZero(month) + '/' + fillWithZero(day) + ' ' + fillWithZero(hour) + ':' + fillWithZero(minute)

    }

    const clearLineBreak = function (text) {
        let textClear = text.replace(/\n/g, '<br/>')
        textClear = textClear.replace(/(<br\s?\/>)+/g, '<br/>')
        return textClear
    }

    const appendPostToBody = function (post) {

        let metaHTML = ''
        metaHTML += `<div class="meta">`
        metaHTML += `<span class="date">${getDate(post.created_at)}</span>`
        if (post.region_name) {
            metaHTML += `<div class="region">${post.region_name.replace('发布于 ', '')}</div>`
        }
        metaHTML += `</div>`

        let textHTML = `<div class="text">${clearLineBreak(post.text)}</div>`

        let retweetHTML = ''
        if (post.retweeted_status && post.retweeted_status.user) {
            retweetHTML += `<div class="retweet">`
            retweetHTML += `${post.retweeted_status.user.screen_name ? post.retweeted_status.user.screen_name : ''}<span style="margin:0 3px;">:</span>${clearLineBreak(post.retweeted_status.text)}`
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
        let postHTML = `<div class="speechless-post">
            ${metaHTML}
            <div class="main">
            ${textHTML}
            ${retweetHTML}
            ${mediaHTML}
            </div>
            </div>`
        body.append(postHTML)
        count ++
        setProgress()
    }

    const getUID = function () {
        let uid
        let url = location.href
        let regRes = url.match(/weibo.com\/(u\/)?(\d+)/)

        if (regRes && regRes.length > 1) {
            uid = regRes.pop()
        }
        console.log(uid)
        return uid
    }

    const initThePanel = function () {

        let uid = getUID()

        body.append(`<div class="speechless">
        <div class="speechless-head">
        <img class="speechless-logo" src="data:image/jpeg;base64,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" />
        <div class="speechless-title">Speechless</div>
        </div>
        <div class="speechless-main">
        </div>
        </div>`)
        let $speechLess = $('.speechless-main');

        if (uid) {
            $speechLess.append(`<div class="speechless-action item-center"><span class="speechless-tips">现在把记忆打包...</span><span class="speechless-button" id="doSpeechless">开始</span></div>`)
            $speechLess.append(`<div class="speechless-fetching" style="display:none;">
            <div class="item-center"><span class="speechless-tips">正在努力回忆中...</span><span class="speechless-count"">0/0</span></div>
            <div class="speechless-progress"><div class="speechless-progress-bar"></div></div>
            </div>`)
            $speechLess.append(`<div class="speechless-done item-center" style="display:none;"><span class="speechless-tips">全部都回想起来了...</span><span class="speechless-button" id="doSavepdf">保存为 PDF</span></div>`)
            
            $progressCount = $('.speechless-count')
            $progressBar = $('.speechless-progress-bar')

            $(document).on('click', "#doSpeechless", function () {
                main()
            });
            $(document).on('click',"#doSavepdf",function(){
                window.print()
            })
        }
        else {
            $speechLess.append(`请点击顶部导航栏的头像，进入当前用户的主页`)
        }

    }

    const beginToFetch = function () {
        $('.speechless').css({ top: '25px' })
        $('.speechless-action').hide()
        $('.speechless-done').hide()
        $('.speechless-fetching').show()
        
    }

    const fetchFinished = function(){
        $('.speechless-action').hide()        
        $('.speechless-fetching').hide()
        $('.speechless-done').show()
    }

    const setProgress = function(){
        let countString = `${count}/${total}`
        $progressCount.text(countString)
        let percent = Number((count*100)/total);
        $progressBar.width(`${percent}%`)
    }

    const clearTheBody = function () {
        $(".WB_miniblog").remove("")
        $("#WB_webchat").remove()
    }

    const main = async function () {
        // initialize variables
        const uid = getUID()
        const GetPostsURL = `https://weibo.com/ajax/statuses/mymblog`
        const GetLongTextURL = `https://weibo.com/ajax/statuses/longtext`

        beginToFetch()
        clearTheBody()

        // fetch posts
        while (loadMore) {
            try {
                let data = await fetchData({
                    url: GetPostsURL,
                    parameters: {
                        uid: uid,
                        page: page,
                        feature: 0,
                        since_id: since_id
                    }
                });
                page++
                since_id = data.since_id
                if(total === 0){
                    total = data.total
                }
                loadMore = !!data.since_id

                // traverse array
                for (let post of data.list) {
                    if (post.user.id != uid) continue;
                    if (!!post.isLongText) {
                        let reqParam = {
                            url: GetLongTextURL,
                            parameters: {
                                id: post.mblogid
                            }
                        }
                        try {
                            let longtextData = await fetchData(reqParam)
                            post.text = longtextData.longTextContent || ''
                        }
                        catch (err) { console.error(err) }
                    }
                    if (post.retweeted_status && post.retweeted_status.isLongText) {
                        let reqParam = {
                            url: GetLongTextURL,
                            parameters: {
                                id: post.retweeted_status.mblogid
                            }
                        }
                        try {
                            let longtextData = await fetchData(reqParam)
                            post.retweeted_status.text = longtextData.longTextContent || ''
                        }
                        catch (err) { console.error(err) }

                    }
                    appendPostToBody(post)
                }

            } catch (err) {
                console.log(err)
            }            
        }
        fetchFinished()
    }
    // execute the main function
    initThePanel()
})();