(async function () {
    'use strict';
    const $ = jQuery

    let id
    let uid
    let username

    let page = 1
    let since_id = ''
    let total = 0
    let count = 0
    let loadMore = true

    // 是否手动暂停
    let forcePause = false

    // 拉取间隔时间
    let interval = 1000

    // 上一次拉取时间
    let lastFetchTimeStamp = 0

    const body = $('body')
    let $progressCount
    let $progressBar
    let $speechlessList
    let $speechlessPanel
    let $speechlessMain

    let blogCount = 0
    let longtextCount = 0


    const emojiMap = new Map()
    emojiMap.set('default', '🤐')
    emojiMap.set('fetching', '🤯')
    emojiMap.set('done', '🤖')

    // 使用 Weibo API 获取用户 UID 和用户名
    const getInfo = function () {
        id = getIDFromURL()
        if (id) {
            $.ajax({
                async: false,
                type: 'GET',
                url: `https://weibo.com/ajax/profile/info?custom=${id}`,
                success: function (data) {
                    uid = data.data.user.id
                    username = data.data.user.screen_name
                    console.log('uid', uid)
                    console.log('username', username)
                }
            })
        }
    }



    // 从 URL 中获取 ID，注意不是 UID
    const getIDFromURL = function () {
        let id
        let url = location.href
        let regRes = url.match(/weibo.com\/(u\/)*(\w+)/)
        if (regRes && regRes.length > 1) {
            id = regRes.pop()
        }
        console.log('id from url is: ', id)
        return id
    }

    const delay = function (timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    }

    // 声明fetch方法
    const fetchData = async function (config) {
        let url = config.url
        let param = config.parameters || {}
        
        let offset = parseInt(new Date().valueOf()) - lastFetchTimeStamp        
        if (offset < interval) {
            let delayMS = interval - offset
            console.log(`Delay of ${delayMS} milliseconds`)
            await delay(delayMS)            
        }

        return new Promise((resolve, reject) => {
            let method = config.method || 'get'
            lastFetchTimeStamp = parseInt(new Date().valueOf())
            $.ajax({
                type: method.toUpperCase(),
                url,
                data: param,
                success: function (response) {
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

    // 每添加一个卡片，就要更新一次页面的状态
    const updateWholePageState = function () {
        window.scrollTo(0, document.body.scrollHeight);
        count++
        setProgress()
    }

    const isNullOrUndefined = function(attribute) {
        return attribute === null && attribute === undefined
    }

    // 把卡片添加到页面中
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

        let interactionStatsHTML = ''
        // Count could be zero
        if (!isNullOrUndefined(post.reposts_count) &&
            !isNullOrUndefined(post.comments_count) &&
            !isNullOrUndefined(post.attitudes_count)) {
            interactionStatsHTML += '<div class="interactionStats">'
            interactionStatsHTML += `<div>转发: ${post.reposts_count}</div>`
            interactionStatsHTML += `<div>评论: ${post.comments_count}</div>`
            interactionStatsHTML += `<div>赞: ${post.attitudes_count}</div>`
            interactionStatsHTML += '</div>'
        } 

        let postHTML = `<div class="speechless-post">
            ${metaHTML}
            <div class="main">
            ${textHTML}
            ${retweetHTML}
            ${mediaHTML}
            ${interactionStatsHTML}
            </div>
            </div>`
        $speechlessList.append(postHTML)
        updateWholePageState()
    }



    // 初始化面板
    const initThePanel = function (uid) {


        if (!$speechlessPanel) {
            body.append(`<div class="speechless">
            <div class="speechless-head">
            <span class="speechless-logo">🤐</span>
            <div class="speechless-title">Speechless</div>
            </div>
            <div class="speechless-main">
            </div>
            </div>`)
            $speechlessPanel = $('.speechless');
            $speechlessMain = $('.speechless-main');
        }
        $speechlessMain.html('')

        if (uid) {
            $speechlessMain.append(`<div class="speechless-action item-center">
            <span class="speechless-tips">📦 把<span class="speechless-username">@${username}</span>的记忆打包...</span><span class="speechless-button" id="doSpeechless">开始</span>
            </div>`)
            $speechlessMain.append(`<div class="speechless-fetching" style="display:none;">
            <div class="item-center"><span class="speechless-tips">📡 正在努力回忆中...</span></div>
            <div class="speechless-progress"><div class="speechless-progress-bar"></div></div>
            <div class="item-center speechless-interact"><span class="speechless-count"">0/0</span><span class="speechless-button blue" id="doForcePause">暂停</span></div>
            </div>`)
            $speechlessMain.append(`<div class="speechless-done item-center" style="display:none;"><span class="speechless-tips">🖨 只能回想起这么多了...</span><span class="speechless-button" id="doSavepdf">保存为 PDF</span></div>`)

            $progressCount = $('.speechless-count')
            $progressBar = $('.speechless-progress-bar')

            $(document).on('click', "#doSpeechless", function (e) {
                mainFetch()
            });
            $(document).on('click', "#doSavepdf", function () {
                window.print()
            })

            $(document).on('click', '#doForcePause', function (e) {
                forcePause = !forcePause
                $(this).text(forcePause ? '继续' : '暂停')
                if (!forcePause) {
                    fetchPost()
                }

            })
        }
        else {
            $speechlessMain.append(`😵‍💫 请进入个人主页，刷新页面后使用`)
        }
    }

    // 开始拉取时，面板的状态
    const beginToFetch = function () {
        $('.speechless').css({ top: '25px' })
        $('.speechless-action').hide()
        $('.speechless-done').hide()
        $('.speechless-fetching').show()
        switchEmoji('fetching')
    }

    // 拉取完成时，面板的状态
    const checkIfFinished = function () {
        if (forcePause) return
        else {
            $('.speechless-action').hide()
            $('.speechless-fetching').hide()
            $('.speechless-done').show()
            switchEmoji('done')
        }

    }

    // 更新进度条
    const setProgress = function () {
        let countString = `${count}/${total}`
        $progressCount.text(countString)
        let percent = Number((count * 100) / total);
        $progressBar.width(`${percent}%`)
    }

    // 清空页面上的多余元素
    const clearTheBody = function () {
        $(".WB_miniblog").remove()
        $("#app").remove()
        $("#WB_webchat").remove()
        $('body').append(`<div class="speechless-list"></div>`)
        $speechlessList = $('.speechless-list')
    }


    // 主要的拉取逻辑
    const mainFetch = async function () {

        beginToFetch()
        clearTheBody()
        await fetchPost()

    }

    // 循环遍历的逻辑
    const fetchPost = async function () {
        const GetPostsURL = `https://weibo.com/ajax/statuses/mymblog`
        const GetLongTextURL = `https://weibo.com/ajax/statuses/longtext`
        // fetch posts
        while (loadMore && !forcePause) {
            try {
                console.log('blog', blogCount++, getDate(new Date().valueOf(), true))

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
                if (total === 0) {
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
                            console.log('longtext', longtextCount++, getDate(new Date().valueOf(), true))
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
                            console.log('longtext', longtextCount++, getDate(new Date().valueOf(), true))
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

        checkIfFinished()

    }

    const init = function () {
        getInfo()
        initThePanel(uid)


    }
    init()

})();