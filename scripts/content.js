(async function () {
    'use strict';
    const $ = jQuery

    let uid
    let username

    let page = 1
    let since_id = ''
    let total = 0
    let count = 0
    let loadMore = true

    const body = $('body')
    let $progressCount
    let $progressBar
    let $speechlessList
    let $speechlessPanel
    let $speechlessMain

    const emojiMap = new Map()
    emojiMap.set('default', '🤐')
    emojiMap.set('fetching', '🤯')
    emojiMap.set('done', '🤖')

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            // listen for messages sent from background.js
            if (request.message === 'urlChanged') {
                console.log(request.url) // new url is now in content scripts!
                init()
            }
        });

    // 获取要导出用户的UID
    const getUID = async function () {
        let uidFromURL = getUIDFromURL()
        let uidFromScript = await getUIDFromInjectScript()
        let uidFromDom = getUIDFromDom()
        return uidFromScript || uidFromURL
    }

    // 从URL里面获取
    const getUIDFromURL = function () {
        let uid
        let url = location.href
        let regRes = url.match(/weibo.com\/(u\/)?(\d+)/)
        if (regRes && regRes.length > 1) {
            uid = regRes.pop()
        }
        console.log('uid from url is: ', uid)
        return uid
    }

    // 从Dom里面获取
    const getUIDFromDom = function () {
        let el = document.querySelector('header.woo-box-flex>a')

        console.log(el)
    }

    const getUserName = function () {

        let timer
        let name
        let count = 0
        return new Promise((resolve, reject) => {
            timer = setInterval(() => {
                count++
                let title = document.title
                let nameReg = title.match(/@(\S+) 的个人主页/)
                if (nameReg) {
                    name = nameReg.pop()
                    console.log(name)
                    clearInterval(timer)
                    resolve(name)
                }
                if (count > 5) reject()
            }, 200);
        })

    }
    // 对于老版本的微博页面，尝试从 window 取出来
    const getUIDFromInjectScript = function () {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('scripts/script.js');
        (document.head || document.documentElement).appendChild(s);
        s.onload = function () {
            s.remove();
        };
        return new Promise((resolve, reject) => {
            // Event listener
            document.addEventListener('event_get_global_data', function (e) {
                // e.detail contains the transferred data (can be anything, ranging
                // from JavaScript objects to strings).
                // Do something, for example:    
                console.log('uid from inject script: ', e.detail)
                resolve(e.detail)
            });
        })

    }

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
        let postHTML = `<div class="speechless-post">
            ${metaHTML}
            <div class="main">
            ${textHTML}
            ${retweetHTML}
            ${mediaHTML}
            </div>
            </div>`
        $speechlessList.append(postHTML)
        updateWholePageState()
    }



    // 初始化面板
    const initThePanel = function (uid) {
        
        
        if(!$speechlessPanel){
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
            <span class="speechless-tips">🗳 把<span class="speechless-username">@${username}</span>的记忆打包...</span><span class="speechless-button" id="doSpeechless">开始</span>
            </div>`)
            $speechlessMain.append(`<div class="speechless-fetching" style="display:none;">
            <div class="item-center"><span class="speechless-tips">🪩 正在努力回忆中...</span><span class="speechless-count"">0/0</span></div>
            <div class="speechless-progress"><div class="speechless-progress-bar"></div></div>
            </div>`)
            $speechlessMain.append(`<div class="speechless-done item-center" style="display:none;"><span class="speechless-tips">🗄 只能回想起这么多了...</span><span class="speechless-button" id="doSavepdf">保存为 PDF</span></div>`)

            $progressCount = $('.speechless-count')
            $progressBar = $('.speechless-progress-bar')

            $(document).on('click', "#doSpeechless", function () {
                mainFetch()
            });
            $(document).on('click', "#doSavepdf", function () {
                window.print()
            })
        }
        else {
            $speechlessMain.append(`😵‍💫 获取账号信息失败了...`)
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
    const fetchFinished = function () {
        $('.speechless-action').hide()
        $('.speechless-fetching').hide()
        $('.speechless-done').show()
        switchEmoji('done')
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

    const init = async function(){
        
        uid = await getUID()
        username = await getUserName();
        console.log(username)
        initThePanel(uid)
    }
    init()

})();