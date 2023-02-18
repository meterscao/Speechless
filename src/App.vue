<template>
    <div class="fixed z-[9999] top-[70px] right-5 w-[360px]">
        <div class="relative p-5 rounded-md bg-white text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">

            <!-- 默认的面板 -->
            <template v-if="state == 'DEFAULT'">
                <div class="flex items-center"><span class="text-[40px]">🤐</span><span
                        class="text-2xl ml-2">Speechless</span><span
                        class="ml-1 text-xs text-zinc-700 bg-zinc-100 rounded border-zinc-300 border px-1 py">V2.0</span>
                </div>
                <div class="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                    <div class="text-sm">把 <label
                            class="underline decoration-orange-400 decoration-4 font-medium">@{{username}}</label> 的记忆打包。
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
                    <SelectTimeRangeVue :years="years" @onRangeChanged="eventRangeChanged" />
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
                <div class="text-sm">{{ pendingWording }}</div>
                <div class="border-t border-gray-200 mt-4 pt-4">
                    <button type="button" v-if="state == 'PENDING'"
                        class="w-full flex items-center justify-center px-4 py-2 font-medium leading-6 text-sm shadow rounded-md text-white bg-orange-500 hover:bg-orange-400 transition ease-in-out duration-150 cursor-not-allowed"
                        disabled="">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg><span>回忆中...</span>
                    </button>
                </div>
            </template>

            <!-- 拉取完毕 -->
            <template v-if="state == 'SAVING'">
                <div>
                    <SelectNative title="图片显示方式" v-model="weiboImageScaleType" :options="OptionsWeiboImageScale" />
                </div>
                <div class="border-t border-gray-200 mt-4 pt-4">
                    <Switch title="显示转赞评数" :checked="false" />
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
                <div>导出成功</div>
                <div class="border-t border-gray-200 mt-4 pt-4">
                    <button type="button" @click="eventFetchPosts"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">重新开始</button>
                </div>
            </template>
        </div>

    </div>
</template>

<script>
import SelectNative from './component/SelectNative.vue'
import RadioList from './component/RadioList.vue'
import Switch from './component/Switch.vue'
import SelectTimeRangeVue from "./component/SelectTimeRange.vue"

import { fetchUserInfo } from './module/userInfo'
import { fetchPost } from './module/blogPost'

const OptionsWeiboTimeRange = ['全部时间', '指定时间范围']
const OptionsWeiboSourceType = ['全部微博', '原创微博']
const OptionsWeiboImageScale = ['缩略图', '大图']

export default {

    async created() {
        let user = await fetchUserInfo()

        if (user) {
            console.log(user)
            this.id = user.id || ''
            this.uid = user.uid || ''
            this.username = user.username || ''
            let yearMap = user.history || {}
            this.yearMap = yearMap
            this.years = Object.keys(yearMap)
        }
    },
    components: {
        SelectTimeRangeVue,
        SelectNative,
        RadioList,
        Switch
    },
    data() {
        return {
            OptionsWeiboTimeRange,
            OptionsWeiboSourceType,
            OptionsWeiboImageScale,

            // 
            state: 'DONE',

            //
            id: '',
            uid: '',
            username: '',

            // 0|全部 1|原创
            weiboSourceType: 1,
            weiboRangeType: 0,
            weiboImageScaleType: 0,
            weiboRange: null,
            weiboRangeisValid: true,

            //
            years: null,
            yearMap: null,

            pendingWording: ''
        }
    },
    methods: {
        eventStart() {
            this.state = 'SELECTRANGE'
        },

        async eventFetchPosts() {
            this.state = 'PENDING'
            this.pendingWording = `正在导出 ${this.username} `
            if (this.weiboRangeType == 1) {
                this.pendingWording += `${this.weiboRange.start.year}年${this.weiboRange.start.month}月 - ${this.weiboRange.end.year}年${this.weiboRange.end.month}月`
            }
            if (this.weiboSourceType == 1) {
                this.pendingWording += ` 原创微博`
            }
            else {
                this.pendingWording += ` 全部微博`
            }

            let posts = await fetchPost({
                uid: this.uid,
                feature: this.weiboSourceType,

            },{
                isByRange:!!this.weiboRangeType,
                yearMap:this.yearMap,
                range: this.weiboRange
            })
            this.state = 'SAVING'

        },
        eventRangeChanged(e) {
            this.weiboRangeisValid = e.is_valid
            if (!e.is_valid) return
            this.weiboRange = e.range
        },
        eventSavePDF() {
            setTimeout(() => {
                console.log(11)
                this.state = 'DONE'
            }, 400);
            setTimeout(()=>{
                window.print()
            },10)
            
        }
    }

}
</script>
<style>
body {
    background: #fff !important;
}
</style>