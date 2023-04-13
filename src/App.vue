<template>
    <div class="fixed z-[9999] top-[70px] right-5 w-[360px]">
        <div class="relative p-5 rounded-md bg-white text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">

            <div v-if="isLoading" class="text-center py-5">
                正在初始化...
            </div>
            <template v-else>
                <div v-if="isReady">
                    <!-- 默认的面板 -->
                    <template v-if="state == 'DEFAULT'">
                        <div class="flex items-center"><span class="text-[40px]">🤐</span><span
                                class="text-2xl ml-2">Speechless</span><span
                                class="ml-1 text-xs text-zinc-700 bg-zinc-100 rounded border-zinc-300 border px-1 py">V2.0</span>
                        </div>
                        <div class="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                            <div class="text-sm">把 <label
                                    class="underline decoration-orange-400 decoration-4 font-medium">@{{ username }}</label>
                                的记忆打包。
                            </div>
                            <button type="button" @click="eventStart"
                                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shrink-0 ml-2">开始</button>
                        </div>

                    </template>

                    <!-- 选择范围面板 -->
                    <template v-if="state == 'SELECTRANGE'">
                        <div>
                            <SelectNative title="时间范围" v-model="weiboRangeType" :options="OptionsWeiboTimeRange" />
                        </div>
                        <div v-if="weiboRangeType == 1" class="mt-2">
                            <SelectTimeRangeVue :range="weiboRange" :years="years" @onRangeChanged="eventRangeChanged" />
                            <div v-if="!weiboRangeisValid" class="text-sm text-red-400 pt-1">结束时间须晚于开始时间</div>
                        </div>
                        <div class="border-t border-gray-200 mt-4 pt-4">
                            <SelectNative title="内容类型" v-model="weiboSourceType" :options="OptionsWeiboSourceType" />
                        </div>
                        <div class="border-t border-gray-200 mt-4 pt-4">
                            <button type="button" @click="eventFetchPosts"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">开始回忆</button>
                        </div>
                    </template>

                    <!-- 拉取数据ing -->
                    <template v-if="state == 'PENDING'">
                        <div class="text-sm font-medium"><label
                                    class="underline decoration-orange-400 decoration-4 font-medium mr-2">@{{ username }}</label>{{ pendingWording }}</div>
                        <div class="border-t border-gray-200 mt-4 pt-4">
                            <div class="flex justify-between">
                                <span class="text-sm">拼命回忆中...</span>
                                <span class="text-sm">{{ count }}/{{ total }}</span>
                            </div>
                            <div class="bg-zinc-200 h-2 rounded-sm overflow-hidden mt-2">
                                <div class="h-2 bg-orange-400 transition-all" :style="`width:${progress}%`"></div>
                            </div>
                        </div>
                    </template>

                    <!-- 拉取完毕 -->
                    <template v-if="state == 'SAVING'">
                        <div class="text-sm font-medium"><label
                                    class="underline decoration-orange-400 decoration-4 font-medium mr-2">@{{ username }}</label>{{ pendingWording }}</div>
                        <div class="border-t border-gray-200 mt-4 pt-4">
                            <SelectNative title="图片显示方式" v-model="weiboImageScaleType" :options="OptionsWeiboImageScale" />
                        </div>

                        <div class="border-t border-gray-200 mt-4 pt-4">
                            <div class="flex gap-3">
                                <button type="button"
                                    class="hidden w-full flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">重新开始</button>
                                <button type="button" @click="eventSavePDF"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">保存为
                                    PDF</button>
                            </div>
                        </div>
                    </template>

                    <!-- 拉取完毕 -->
                    <template v-if="state == 'DONE'">
                        <div class="text-sm text-center text-slate-600">帮到你了？请我喝杯奶茶吧</div>
                        <div class="pt-2"><img class="rounded-md block overflow-hidden" :src="donateImageURL" /> </div>
                        <div class="border-t border-gray-200 mt-4 pt-2 text-center">
                            <label @click="eventRefresh"
                                class="inline-flex items-center py-2 px-4 text-sm font-medium text-orange-500 hover:hover:text-orange-600 cursor-pointer">重新开始</label>
                        </div>
                    </template>
                </div>

                <div v-else class="text-center py-5">
                    获取当前用户信息失败 :-( <br />请切换到用户主页，再刷新页面重试。
                </div>
            </template>
        </div>

    </div>
</template>

<script>
import SelectNative from './component/SelectNative.vue'
import SelectTimeRangeVue from "./component/SelectTimeRange.vue"

import { fetchUserInfo } from './module/userInfo'
import { fetchPost } from './module/blogPost'

const OptionsWeiboTimeRange = ['全部时间', '指定时间范围']
const OptionsWeiboSourceType = ['全部微博', '原创微博']
const OptionsWeiboImageScale = ['缩略图', '大图']



export default {

    async created() {
        let user = await fetchUserInfo()
        this.isLoading = false
        if (user) {
            console.log(user)
            this.isReady = true
            this.id = user.id || ''
            this.uid = user.uid || ''
            this.username = user.username || ''
            let yearMap = user.history || {}
            this.yearMap = yearMap
            this.years = Object.keys(user.history)
            this.setWeiboRange()
        }
        else {
            this.isReady = false
        }
    },
    components: {
        SelectTimeRangeVue,
        SelectNative
    },

    data() {
        return {

            //
            isLoading: true,
            isReady: false,

            OptionsWeiboTimeRange,
            OptionsWeiboSourceType,
            OptionsWeiboImageScale,

            // 
            state: 'DEFAULT',

            //
            id: '',
            uid: '',
            username: '',

            total: 0,
            count: 0,
            progress: 0,

            // 0|全部 1|原创
            weiboSourceType: 1,
            weiboRangeType: 0,
            weiboRange: null,

            weiboImageScaleType: 0,
            weiboRangeisValid: true,

            start: null,
            end: null,

            //
            years: null,
            yearMap: null,

            pendingWording: '',

            donateImageURL: window.donateImageURL
        }
    },
    methods: {
        eventStart() {
            this.state = 'SELECTRANGE'
        },

        setWeiboRange() {

            console.log(this.yearMap)
            let yearsLen = this.years.length || 0
            let startY = this.years[0]
            let startM = this.yearMap[this.years[0]][0]

            let lastYear = this.years[yearsLen - 1]
            let lastYearMonths = this.yearMap[lastYear]
            let endY = lastYear
            let endM = lastYearMonths[lastYearMonths.length - 1]

            console.log(startY, startM)
            console.log(endY, endM)

            this.weiboRange = {
                start: {
                    year: startY,
                    month: startM
                },
                end: {
                    year: endY,
                    month: endM
                }
            }
        },

        async eventFetchPosts() {
            this.state = 'PENDING'

            this.pendingWording = ''
            let documentTitle = `@${this.username}`
            if (this.weiboRangeType == 1) {
                this.pendingWording += `${this.weiboRange.start.year}年${this.weiboRange.start.month}月 - ${this.weiboRange.end.year}年${this.weiboRange.end.month}月`
                documentTitle += `_${this.weiboRange.start.year}${this.weiboRange.start.month}-${this.weiboRange.end.year}${this.weiboRange.end.month}`
            }
            if (this.weiboSourceType == 1) {
                this.pendingWording += ` 的原创微博`
                documentTitle += `_原创微博`
            }
            else {
                this.pendingWording += ` 的全部微博`
                documentTitle += `_全部微博`
            }

            document.title = documentTitle

            let fetchTask = await fetchPost({
                uid: this.uid,
                sourceType: this.weiboSourceType, // 
                rangeType: this.weiboRangeType, // 
                range: this.weiboRange
            }, cb => {
                switch (cb.type) {
                    case 'total':
                        this.total = cb.value
                        break;
                    case 'count':
                        this.count = cb.value
                        break;
                }

                if (this.total > 0) {
                    this.progress = Math.floor((parseFloat(this.count) / parseFloat(this.total)) * 100)
                    console.log(this.progress)
                }
            })

            this.state = 'SAVING'

        },
        eventRangeChanged(e) {
            this.weiboRange = e.range
            console.log(this.weiboRange)
        },
        eventSavePDF() {
            setTimeout(() => {
                this.state = 'DONE'
            }, 1)
            setTimeout(() => {
                window.print()
            }, 10)

        },
        eventRefresh() {
            location.reload()
        }
    }

}
</script>
<style>
body {
    background: #fff !important;
}
</style>