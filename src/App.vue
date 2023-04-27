<template>
  <div
    v-if="isMinimum"
    @click="eventResetPopup"
    class="fixed z-[9999] top-[70px] right-5 p-2 rounded-full bg-white shadow-xl shadow-black/5 ring-2 ring-slate-700/10 cursor-pointer"
  >
    <div class="font-sans italic font-bold inline-flex text-[20px] -space-x-1">
      <span class="text-red-600/50">S</span>
      <span class="text-orange-600/50">P</span>
      <span class="text-yellow-600/50">E</span>
      <span class="text-lime-600/50">E</span>
      <span class="text-green-600/50">C</span>
      <span class="text-teal-600/50">H</span>
      <span class="text-sky-600/50">L</span>
      <span class="text-indigo-600/50">E</span>
      <span class="text-purple-600/50">S</span>
      <span class="text-pink-600/50">S</span>
    </div>
  </div>
  <div v-else class="fixed z-[9999] top-[70px] right-5 w-[360px]">
    <div
      class="relative p-5 pt-7 rounded-md bg-white text-slate-700 shadow-xl shadow-black/5 ring-2 ring-slate-700/10"
    >
      <div v-if="isLoading" class="text-center py-5">正在初始化...</div>
      <template v-else>
        <div
          class="flex absolute right-0 top-0 border-l-2 border-b-2 rounded-bl-md"
        >
          <a
            href="https://speechless.fun"
            title="帮助"
            target="_blank"
            class="p-1"
          >
            <svg
              fill="none"
              class="w-4 h-4"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              ></path>
            </svg>
          </a>
          <span
            @click="eventMinimize"
            class="p-1 border-l-2 cursor-pointer"
            title="收起"
            ><svg
              fill="none"
              class="w-4 h-4"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 12H6"
              ></path>
            </svg>
          </span>
        </div>

        <div v-if="isReady">
          <!-- 默认的面板 -->
          <template v-if="state == 'DEFAULT'">
            <div class="flex items-start py-5">
              <div class="font-sans italic font-bold inline-flex text-[60px]">
                <span class="-mr-[12px] text-red-600/50">S</span>
                <span class="-mr-[12px] text-orange-600/50">P</span>
                <span class="-mr-[12px] text-yellow-600/50">E</span>
                <span class="-mr-[12px] text-lime-600/50">E</span>
                <span class="-mr-[12px] text-green-600/50">C</span>
                <span class="-mr-[12px] text-teal-600/50">H</span>
                <span class="-mr-[12px] text-sky-600/50">L</span>
                <span class="-mr-[12px] text-indigo-600/50">E</span>
                <span class="-mr-[12px] text-purple-600/50">S</span>
                <span class="text-pink-600/50">S</span>
              </div>
              <span
                class="ml-1 text-xs text-zinc-700 bg-zinc-100 rounded border-zinc-300 border px-1 py"
                >V2.0</span
              >
            </div>
            <div
              class="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between"
            >
              <div class="text-sm">
                把
                <label
                  class="underline decoration-orange-400 decoration-4 font-medium"
                  >@{{ username }}</label
                >
                的记忆打包。
              </div>
              <button
                type="button"
                @click="eventStart"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shrink-0 ml-2"
              >
                开始
              </button>
            </div>
          </template>

          <!-- 选择范围面板 -->
          <template v-if="state == 'SELECTRANGE'">
            <div>
              <SelectNative
                title="时间范围"
                v-model="weiboRangeType"
                :options="OptionsWeiboTimeRange"
              />
            </div>
            <div v-if="weiboRangeType == 1" class="mt-2">
              <SelectTimeRangeVue
                :range="weiboRange"
                :years="years"
                @onRangeChanged="eventRangeChanged"
              />
              <div v-if="!weiboRangeisValid" class="text-sm text-red-400 pt-1">
                结束时间须晚于开始时间
              </div>
            </div>
            <div class="mt-4">
              <SelectNative
                title="内容类型"
                v-model="weiboSourceType"
                :options="OptionsWeiboSourceType"
              />
            </div>
            <div class="mt-4">
              <button
                type="button"
                @click="eventFetchPosts"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                开始回忆
              </button>
            </div>
          </template>

          <!-- 拉取数据ing -->
          <template v-if="state == 'PENDING'">
            <div class="text-sm font-medium">
              <label
                class="underline decoration-orange-400 decoration-4 font-medium mr-2"
                >@{{ username }}</label
              >{{ pendingWording }}
            </div>
            <div class="border-t border-gray-200 mt-4 pt-4">
              <div class="flex justify-between">
                <span class="text-sm">拼命回忆中...</span>
                <span class="text-sm">{{ count }}/{{ total }}</span>
              </div>
              <div class="bg-zinc-200 h-2 rounded-sm overflow-hidden mt-2">
                <div
                  class="h-2 bg-orange-400 transition-all"
                  :style="`width:${progress}%`"
                ></div>
              </div>
            </div>
          </template>

          <!-- 拉取完毕 -->
          <template v-if="state == 'SAVING'">
            <div class="text-sm font-medium">
              <label
                class="underline decoration-orange-400 decoration-4 font-medium mr-2"
                >@{{ username }}</label
              >{{ pendingWording }}
            </div>
            <div class="border-t border-gray-200 mt-4 pt-4">
              <SelectNative
                title="图片尺寸"
                v-model="weiboImageScaleType"
                :options="OptionsWeiboImageScale"
              />
            </div>

            <div class="border-t border-gray-200 mt-4 pt-4">
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="eventSavePDF"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  保存为 PDF
                </button>
              </div>
            </div>
          </template>

          <!-- 拉取完毕 -->
          <template v-if="state == 'DONE'">
            <div class="pt-4 pb-2 flex items-center px-2">
              <img
                class="rounded-full block p-2 overflow-hidden ring-4 ring-orange-300 w-32 h-32 flex-none"
                :src="donateImageURL"
              />
              <div class="text-stone-600 pl-5">
                <div class="text-xl text-stone-800 font-medium mb-2">
                  有帮到你吗？
                </div>
                <div class="">请我喝杯奶茶吧 :-)</div>
                <div class="">
                  <label class="inline-flex items-center"
                    ><span class="text-stone-600 mr-1">支持我继续</span
                    ><span class="text-red-500 font-medium">
                      <span class="inline-flex items-center"
                        ><span>用</span
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="inline-block w-5 h-5"
                        >
                          <path
                            d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"
                          ></path>
                        </svg>
                        <span>发电</span></span
                      ></span
                    ></label
                  >
                </div>
              </div>
            </div>
            <div class="border-t border-gray-200 mt-4 pt-2 text-center">
              <div class="flex items-center justify-between">
                <label
                  @click="eventReSave"
                  class="inline-flex items-center py-2 text-sm font-medium text-orange-600 hover:hover:text-orange-600 cursor-pointer"
                  >再次保存</label
                >
                <button
                  type="button"
                  @click="eventRefresh"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shrink-0 ml-2"
                >
                  完成
                </button>
              </div>
            </div>
          </template>
        </div>

        <div v-else class="text-center py-5">
          请切到<span class="text-orange-600 font-medium px-1">用户主页</span
          >，再刷新下页面试试<br />
          去<a
            href="https://speechless.fun"
            class="text-orange-600 font-medium underline px-1"
            target="_blank"
            >speechless.fun</a
          >查看更多帮助
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SelectNative from "./component/SelectNative.vue"
import SelectTimeRangeVue from "./component/SelectTimeRange.vue"

import { fetchUserInfo } from "./module/userInfo"
import { fetchPost } from "./module/blogPost"

const OptionsWeiboTimeRange = ["全部时间", "指定时间"]
const OptionsWeiboSourceType = ["全部微博", "原创微博"]
const OptionsWeiboImageScale = ["小图", "中图", "大图"]

export default {
  async created() {
    let user = await fetchUserInfo()
    this.isLoading = false
    if (user) {
      console.log(user)
      this.isReady = true
      this.id = user.id || ""
      this.uid = user.uid || ""
      this.username = user.username || ""
      let yearMap = user.history || {}
      this.yearMap = yearMap
      this.years = Object.keys(user.history)
      this.setWeiboRange()
    } else {
      this.isReady = false
    }
  },
  components: {
    SelectTimeRangeVue,
    SelectNative,
  },

  data() {
    return {
      //
      isLoading: true,
      isReady: false,
      isMinimum:
        localStorage.getItem("speechlessPopupMinimize") === "true" || false,

      OptionsWeiboTimeRange,
      OptionsWeiboSourceType,
      OptionsWeiboImageScale,

      //
      state: "DEFAULT",

      //
      id: "",
      uid: "",
      username: "",

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

      pendingWording: "",
      donateImageURL: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAAD/CAYAAAA+CADKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAA/6ADAAQAAAABAAAA/wAAAABiAOPMAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAABAAElEQVR4Aey9B4BdR3X/f7ZqteqyirtXuGEwBhtw6BiHEiCQACGhBZsSSAhphPCjBTsN/oSWhISEhBogtFAMJoRibAhgjA22ARfcbdmWZEmWrbr9/b+f8/b7PHp+b/e9XWkly3t275t7586cOVPOzJkzZ+Z2VAQxB3MlMFcC97sS6Lzf5Xguw3MlMFcCWQJzzD/XEOZK4H5aAnPMfz+t+Llsz5XAHPPPtYG5EriflsAc899PK34u23Ml0D1XBAdWCZSLNx0dHTPOXIkPZHsC54yJmkOwR0pgjvn3SDHuGyQlY3Lf2dm5G3OOj4+nXxmuHeYlXn14cAKN0ts3pTCX6nRLYI75p1ty+0k8mJCrq6srhoaG4qKLLoq1a9fGQx7ykLx4506gHZKJB+Nv2LAhfvjDH+b9ox/96Fi9enWMjY1lp9IOvrmw+2EJqJLnYB+WgBizwjVdIK6YMaN/+tOfxmCrdv30pz9Nf95ztZqOw23ZsqXykpe8pIbvFa94ReXuu++u4XS4dmkn3nTjtpvWXPjmJTCn8NuHHbKqJUdUi9Y8twvGsW3btvjCF76Q0U855ZR0L7nkkho60nA6Nc8mN2LMfHP99dfHJz/5yTjxxBPj6KOPjg9/+MNx88035zuHaYJiUu92aJkU0dzLGZXAHPPPqPjajwzTwLBmWo2kyVCDg4PJnO4AHGayFBwGZhoZGYmdO3dm8E2bNqV76623xvDwcA2vcTfDaXx+bzw7duwIOhcAOoHpMjD5X79+fdxxxx05HXF52E3kcz+zUgJzzD8rxbx7IjR0mOdnP/tZvOhFL8q5+dlnnx0bN25Mf78nzFTgMIsWLcrRuQzPKF0yf/lusnvjvPPOO2vBYNYVK1bkhafD1AK0cEO+PvvZz8ZjH/vYvD73uc9lBzBVp9QC6rkg0yiBOeafRqHNJApMw4XSDJH6f/7nf+KQQw6Jd77znalYAzfvW2EI4yIsmn6UfoDjjo6OZjrp2eIPcR0fBSLgZ3dKpV8GmOLH8VFE0tndcMMNcd1118ULX/jCVE5CO2HIzxzMXgnMMf/slXWmRCOnscNIW7duTT9GbcAidT608GOmAhc4jzrqqIxlJrrwwgtDSrsWMFWDuNPBpeNgzg+AHzj11FNj4cKFec+P0695THHjzmTNmjVx5JFHZmimKwan4+c5d++WwBzzt1G+NPZ2G3yJ3o0bt6enJ573vOfl65/85CfxuMc9Ln7lV36lFtwMXPNocFOG4f6YY47JUMuWLUsXJZ07Ft6X4Rugy7zRiRCOfJpZHXbBggXR29ubj63gczy7dE5nnXVW3HjjjXHLLbfEO97xjuwEplumro/SdVpz7tQlMLfOP3UZ7RaivqFOxVBlZIu34KADeNKTnhRXXHFFMLd+wAMeEIceemgGbwcnERz+EY94RJx++unxne98J/EgVh900EEtd1jgYTrC9AEl3y9/+cvE4zzTmdBptQumb968efG6170unvGMZyRND3rQg6Kvry/TJAzlMx2gLKcbdzrpHShx5pi/zZqkkboxmylaRUH4Mg4NFgYwtNuIjQt6iHvwwQfHxz/+8bjmmmti8eLFNdyEM81Oq5Fb0kcncNddd2UwM9bKlStz5Cct8LWK12kRD0mE6QNAfNIxtIuPeNBBZ2WajGvOnboE5ph/6jKqhTADMSrSUMv5by3QFDc0UjMTQWn84MLP+KdAsdtr4yMu94cddlgcfvjhtTDtMoVpYGkP8RyAPqC/v79Go2nOFy38GIeZnfyaNtLkvdNuAV0GITyrGdQHnR04p4On1fQOtHDTk7MOtFJoIz/f+MY34gUveEG8+MUvjq9+9au5vk6DNhNPhorG2t3dnY2UhsrFqGW/6TR+cBCPi3sApjKz+f1kdPldmf6uXbtSE3/EEUekaE4YFHXGV4Z1/HoXGqAF5SH3xPWKBGGdb/yNtx5H/TN43IFcddVV8ad/+qfxnOc8J/7xH/8xJRXoct7r484915WACmoOpigBNeAMIaMZhsDdrl/84hf5Tg38gDBZdV4l8lee/vSn75bXK6+8MvMq5mspr+CiXACtZFRuv/32iiSKtnBk4Ikf8Dlt8Ep/kPQtX7483XPPPXc33M5LiWPu/p4SmBv56zrDyR5t5YZYbc36N7/5zRyJWhkJJ8O9P7xTs0gyGFmXLFmSmvkzzzwzfuu3fitNh4877rh8305eGekxEELL/2u/9mvxe7/3e3H11VfnSO/0ppN3pAlbILouvHQ6E7zToeU+G+eefmDurlkJeASRVr7yG7/xGznKyNqtIs133kv8zKiMSvd18OjqEXb79u25mcdl0E7+XB7/8R//keWkaUO6f/VXf1XR+n47qGphwWm85UYm6Toq6lQynGmfDs21hO4HN3MjfwvdtueRrJ+fccYZGWP+/PlpmcfD//3f/7WAZXaCqM3mnLd0SVmMMOVcmDiEM/DM2j7KNKB85zDNXOIyj2c0/ta3vrVbMLYJl8Y9u72c4qHUDTz3uc8NNi8hfX3ve9+L448/PmM7TDsSyhTJHpCv57T9bVbrox71qDjppJPSLp+lLwAb9Wc+85m5Tk+j31eNjrS5ALvcm55WaHNHZxfxGmYq8eRDiz9s4qF8WOIzw6NEnI69gJN0fjA4evjDH27vzLPf1TznbpqWwNzI37Rodn9hZsAO/w/+4A/yJUYrzP+//e1v1wxr9mXjc9q4zLW5Ssb1+91zds+T3zsO8a2RvydUe3deLly6dGmtE6LzBG/ZQbWHtRqa+HROXBL1p4Pifh3nfsf8M2lwjisteJ5ow5ZZ2+N/6lOfqimgHG62WxbpwriMsNdee22wFMaSnZl5Knos1rsTwARXqxm5hAaOdvIFDsL7TAFwb968OUkYGBhItx18zWiHLl/NwrTivydoaSWd/SnMAc38VCiXRwc/0xC52q1wMwWbUv7oj/4o6xHRE8Oa//3f/40f//jH6QdeM1K7lW3aGMl83yqt0EdYrPzQzGM9+A//8A+1ff5T5dcMC83M07HF5ziwP/uzP8s9+K10AGXepSyMiy++OIsAujhvgHl6aYTUbvmU4aHXjM89V7tAOVtqKMvbfu3iuy+FP6CZ3xVBo0DMpHLZrEKDAaZiBse3Cx5w4D772c9Ob0ZZz2XZq87hHOAnXLv4CQ9u4teL7LybDJ/fIY286lWvSjww2Vve8pbcPgveqQAcpIuS7gMf+EAGf/CDHxwf+9jHQkeCTRW99t60rFu3Ls4555xAOUr5A2xgQom4PzCX6STP1GHZNqCVOjyQ4YBmfjMrlctecnaR/eEf/mEeR4VJqDuBViuYxgJO3BNOOCH++q//Og/gkJFJMKflcA7bArSLGxrAbZEdcZuRst2OxGvfKNXMcKyztwJmBjowdhoi1fh0IDoVYKpOxGVEWBkF4QSKUeOmM6E+gKlwZaC9+ANNlO8FF1wQr3/96+ONb3xj/OAHP9iLKe5nqFUAByyo565ZhOmwjFxjVvGnKzE9802YVsH4NGplFKz7jA/3t3/7tysaNfOdphotWcGVaYP3Qx/6UA3n3/7t31ZYZwemwud8YIUHLTLSqUhsz3tNA5IW012mWd77vTqxjCemrWiKk/c6dCSDOp0yXnlvHLh/+Zd/mXFZg3c5aadgBic/+xKcj3qrTa3mVLQUmaQ5zL6kc2+mfb9Y6mPOL9NStb8Ijp/mkAuWoNoFj1R2Gf2ZG6PtZ9MLlnAsaanCckRxuKnSITxhb7vttnjlK1+ZtvTs0HvrW98az3rWs3JpcSocfo9lHvP0n//85+F9/VZKtkqPGDfRleFbWZojH1wAh4h4FLWfTv9N/Qjvwe1887yvwDsXWYFA7EfiYtqzatWqFPstpewr+vZmugc089O41HvnmjJMz+YPGB942MMeNq1yLRmC+yc/+cnx+Mc/PkVZi9lu2O0mYNwwK6J3CX5X+jW6J79mXu4B8HHfakNmrg6wlOkDPdrdwcj5gZwrgMjvcnnkIx+Z8/39geldnpyhwNFi//Vf/5V5fs1rXpPGWy679DxAfw5o5qeCXckcIMHcjhGfEZu5555ohDQS5sa4XE6vnfbiODTET3ziE/G7v/u7OXK+//3vj2OPPbYlOo2D0Z798p5vQwf7+9n6iuKtFTCzosfwyMjhnVMBNJgOJA+ANN0ZkReAcmpVJ0IdGYzbzzN1oYM8cn7i85///Owc3UEhLbbaWc6Ujn0V/4BmfgqVBkMlo2F+4hOfWCtnN0gaV9kJtNPACEtc8Dstu/V4awlPcgND/M7v/E5qxKEPbb07FtJqhTbEc/JqOnChpR2wmawZ+E/+5E9qy3OT0eBypKPx6gAKTCQJOraBifV9l1srHcBk6bWTp0ZhwU3dUc7l8iNlz7u9mXYjembb74Bm/rICzYxUNv40PFeuXXp7+xO+lcbpMG74rkDj9HOrLsw7MMEkxAFvOyMQ4evn50whPPLX01nSRV54DyOwPs8UCR0GUxuO26LsnN8yXnlPvjmW7Lvf/W7pnboL9BgAYZqVD+lzORyHiHLaL3NwJDamIq5Dh8nA0/iBBsrW6RlFO+XtOPdF94Bm/rJC3NjcwP2OuSkbTZibDhRMR3gaheM5fDO31XDN4pf+bozgbAcv8ZAUOGsPcFy20LJkhzKwVeA8wJNPPrnW8ZQM1wyHy4tl1csvvzytIN0RPeYxj0mlKHFNVz0e4pMOLlMPzjfka0EGjjnHupL4TsvvZuI2o2cmOO8LcQ/odf5GFUCjAahwRNMBMTyn5nKAJrvD8Efsc7hGOPa2HzRMt0E2ikuH1wq+Ms8WfWFGLqB836gMnAYac4BRGvNigFEbmAyHabd0YetANlMB559/fiogHS49536mXQL3O+YvG46XolgaAzhsglGSUYfGf18Fb8E1M6LwY/mqHSg7DJeZ8TXDw3tWFviqL8B8n68QPeEJTwiMjloFdxAo44CbbropXZSO1A3vHSZftPBjiaLdeC2gvs8GOaCY342irGj72aWm3ACs/cYqz43zn//5nwObdMRVh9tXtev0691m9Dgcn9E2cHQ3c35bHtq/kWsmN+Pz7FHY7xrFw89ps5ry+c9/PoM5LiO3bQ7AMxkQx/FOO+20kKFT7lH44z/+45ARVW0aMhU9pAFN6HFwwek4PLuNlLTgX15lGPwPNDjg5vxUWD2UDc4VT2PwEdIwBua+bNj5l3/5l2B+ytrv/gDkB/rttkKTpZY91WDL8psqfeb7dDZ0pmZi9AdW1NlvMjxOj5H/L/7iL+L3f//3U1/gztrvJ8PBO/KP8o6pB1MIOnU2O7FhiXfN8JTlxr0vwrdC/1R07S/vD4iRv6wcKpuLSvLlhkA4KpALZsKqC+MOtpqiiUZExZiFk3mx0yc+cWYKM8FheltpdIQF0NADiN1mGKwH9yY4bc/3ScvShs/Yazd96oi6RHrxakM7OCgzjJTe9773xWmSIn791389pyCsIIAX/PXgNuK2Y9dtivAzqc/69Pbl832a+V0JZhDPMTHlZQTCxcyUcK5Ej4oudHbncfwz80pGGjMLm4DoFMDtdBynVdfxzBh+bjW+46Gpb2Xkd2O2Vp+pi9f8W03T4dqh1WGRnlDKASwtsuTHLj62PAPOTz608OPw5KuV/JcoTRO7CjGTxnaBzp4NSnwkFDB+7gnPM+0EFymBVSDCc9F5kj/A8ZxGet4Hf+5TYn9Z2DQGemOAikGsw5yUwyNQbjHqMIqzZk0DxMAHk16UYeAhPvNBmOO1r31tWtZhjMKoifj/mc98JkcJRE7Ajc8Vn551P6aPMNzjkgZWcqRDxwIegPduaEbj+H7HDr2PaTvtRRddlMtunHzLkqRpIV5JD/gAmI1PgZkR8VujM/enAtI1DcblzpJ0fDXDQ/kx32eUtpUgn+N2ZwTukt5meOxP2Poy8rtGLvhdvrQNlgr5xgKKQhgYCQIwPdw7f4SnrlD4ogjGToH4Nm9mCRXFMBIE7Qlphs6V+C4r8LWTP8LvU1CB3WdAFZu72zSqJM2cLc/JsA984AORzWuXNtlUOMtdzFbz4z0n76qDSByq6JoLsq997WsZVnPVPJVX04B81sGQmZYqecpdetDHRViA3WHaJlrROXOVl770pRWf8isJpeEuvfr4//7v/540qOGl+9GPfjTxlmmkx8QP/uQLVweLVHTcWEW6i8pXvvKVihpxy/QTX51nRXPlxEx5G2+ZHvdOk3sdZForQ+8G/O///m9e1XZX5sNe+qHcKVuAtiEz6aRHBkIV16cOYdlt5yX5AiQNVN7whjdkeLcldWAVDRYVDQi1k5r97v/9v/9XKXcoNiufRL6f/tDT36fAlSutckV782uVpXXk2vZTV5BdiXwVnWxTC/vBD34wPyJBxsFHA4Y5zjrrrAwjaaEijXnea7Stbas1UzcrMPBwOZz0CYnDjCDlVabrRkrYeuCdcXhLLNtMyQvbkt3IGsV1PDdoiam1hs67RnHq04fhJW1UfvM3f7Miqady2WWXZRCnWx8enE5PeyeSzoc+9KGVgYGBvNfoOWn8enwzeXa5gsNbo9nWzCAAI1OG/vAINLueZMlYoY3wnu3HUgomw7v92JX0lu+8RZk8/uhHP0qS3Y5mQv9sx71PMb8bGSMqIxqVAlPrUM285xl/RlsY58///M8r+mpt7Z0MebJyCaclvRzZaLzuUDR9qGhjR4aXlVyFs/k1VajoLLusl1aYx8xLhH/7t39LXKTrvfVuLI2YyYzkfGqrcI12aD7vvPOSDtJww02PiR/Hx/X70o/7ZuB3WqPfLU06ADoR3jtMPQ77U04Sh2vxqQPpKzJ4WS718Xk2jsnSaRSv9HOeNU1KGiTm54iNNEf5af6fwSlfl3GZ33KAIK52+FWkL6joNKS8N9ODqwwLDsB5yIf7wM9+z/xuNK5YLSPVRnztEqsg4lMZf/d3f1eRxV6KezI0yZEcV/PQyvnnn1952cteluFgQs1/8/6Tn/xkMgm43QF49AInlz5znR+toC5NQ7N6dcN1wzIubWqpdVCIltDlsPW4Sn/EbcT3L33pSznCeLpTH8fPxC3LCzrIFxf3vG8Gfvf1r389861l0HR15l5FStOM5jDNcOCPKAyT6ZuGU8YDX0lXWb7lfbP0iM9FWJeNlLwV0y7bggpSHPV49tln7ybtgdOHlvCezh6XzguJTfsJstNDIqS+6AC1SpDvHNYu8SwhQYuvVsqrWd5mw3+/Zn5XriuYAvHXX+h5pVjKCvviF79YY976QnMF8LUdvhRDRdEBMKqXleZGSCNCL4D0QIMpxVbCTAam03RzCg8jJ+kwjWDuyb1H/6kauGmfLM3yndMFr/Pj97ybjH6npb0OFdn0J53QivgMPt7vDXqhCbzoVt72trelRIYE4byY/mYucU1fOXVjtIf5yYPsNipS+CUKd/IMItYJMIgQ7ilPeUqtvgnsMqlPm05DSr+M4w5AuzFrg0R92dfH31+e92vmdyG50Wn5LkdtaVQrjKZUGIzPewrcDcmNwf5lhTPvJp7FNub59OyAw3OPn+PRIRh3swZBHMBMQnhAWuNMj6mJlU46DTdHkgwwyU+JC9qcr2ZRyvCEIQ8oGfmMlcXvZnHxd3xGOH2BOBkSxR/pUha4k4Hjtxre+JhzUye+qKNW6IUWcLisrbSlc0dJ6g4eRSRAOIfVPo5Mz4zPnN8KWeq7vs7JWxkf3YGMlxIH0zpoBycATYTn2p9hv2b++gKH0SlklHu4nHFHo3SlEN4F70rwOyoTYFRB+0585nW4MAfQCBfxywaWASf5IawvgtGIdTRXpsPIb/1EK/NENyC7ZbL41QN+0ItLXnRyUaZLHt/1rnfVOrn6eH4mnsup9HO5NErT4ewSprzsX+8aFxKZ9TdWuj3taU+ryMYiozhcfXw/k1+AOiSfWrJLBZ+VrOh2XH8OS6coc+EM75HbZzo6r4R1ePBDh+uVMABTG9K0ngMFtDstwk5FeyLZhz/7PfNTiAAinQ6VyMJ2xWrbaL5zGLsUev1ozjtX5n/+538mHrS6VB6dClDG9zMVbX9WGNAh8EwavhwWt6xwx/Poj7Ti0V+nxe5GYxkPPAZo5h10oJDUSbz5qkzbYfFzHvXRjswbS54cxEk+relullaJx/inCus4rbrgo1xMJ/oBaGP0NJ0wEXPsqcD1wKGprMqAh87V06uXvOQlNb0D6TlNlvUI6xUdlmHBAYCzpI/OkLbnd7guE6QinQCUuFgOhH5wA04rH/bTn/3awq80mMBeHGMXQKN3SBEXWmrJZ8KpfNPYAmMONoPwSS2OxFJPnMZAhDE+n9+nDiLjY+6pCq8ZazicXYw4sBTDwOOJMhbC8AZ7cd6TLuB7x7EfLrbtGOhgcUg6GJ28+93vDimJeJ04wGNc6TnhT9pqfHncOHsR2M8u8bYWx2FxTQP3Pq4bgxaMbgAf6+107ObL4gc85VW8mtFtmR5GNRg/8YERAEtM04nVJQeiluEbJcx76PzCF74Q0gXFgNoDVoXUDSDlalptihEznHFgjATY6OepT31qGndRN4CYO9sCh5m87nWvSwtQDH9IC8AlbYzIMBkGMKzCPJw6vs+AMrFfg3tQRj3EfRV49rQYWXh0d09Mj42SToVfu3S6bubP4hwPKLWQHiz2M31w714WhvGiLJLpb+J0+vr4ZAYljMOVcbnH3yIiSkToIl2L/m9605tqhjTQXo/HebdW2gostNloteuB+I7DKE96GKlYUtJHRTIK4UhvtoF0y7SpG2hEOedRv1xdIWwz8DtWeMBBXTLPZ77Ps/NKeZBXLpeN68KSHyscAO9dX7Q3rxSAD8nESkPngzheHTEulmcB48mH/fRnvx75VWYq9yqowHOvuM1G2SVWmlUSSgWeUgH3nNYLeAR0r40f8RhlVNk8Zry8qftx+oTDNJdtqYxIfKSD7aWXXnppbRRw2DoUtdGC0f/lL3950ud96jfoeCqJlbUoJY14On8eydRpZFikIKdnlxdlfOiljDB1ZpQFnJbj2M2Xs/Bj+uwipQGYVFO2AF8bwgSb+m4G0A0ORnns9gH8kKg4mYkzBzmwFSCc00sP/dBOSqh/zzukEujDpJfThKgryt3gsnPZGoc6GQfZ791ZZX4KjErlopB8j7/f1ZeYC9UM6wbMxgs3EOOjsSOWA4hsAKf0Ag7LPcxMxcIgAPGcTnpM/OBHPA6fhHERTbHxdgf0N3/zN7n5B9rIjxtEicPvaOCyNchXfEAToGFZvHUZ5IviB39OveVLQxrN8w17ETRS5n0junmBv8Va552NStDZLE4i3Ms/LlOSGZCYDpAvDhyRNJedtsuxns6yjGBgmT8HR3uxf4M8InLDqHxbEJEcP8ofPLgG6hAwfg8C+DkcONndySGm7FSk7hDtAfC6TMu4vHPbALfzgT/As+PiOj+lXzXk7PzO+saeslDIPM9knkJ3wTvrfsczjCrxML88yzOjLj2/R0PH5cMZUqrl/BbGlzhWw0869NTM+dAFSBzOo7wZdag00wF+AzSygeOMM84IrXlnp0HDIq6Mb3LzD8zo9B3PLnnwO46FPvfcc3PzEXTzQQ7SdTk4jl3iwqzQhx6DI73pqLSXIfPRiF7iADA+J+iwQcnALjUaKziI67B+PxtumVcO+fjyl7+cnwajbrX3okYbtJRhTRvlQZnJLiA0bUrGJ190hozWfJhUon+Wm8vdce16p6MZ98Ybb8zwvHeZI32ws5MPiwLQiv6E9AHCQZ87cvQyAJ05wPvJyre+7hrlNRHtzR8lOmuggqvNNZX53eZFvMOvHuyPq2/j5XzOa/TM3QDmV8Qt8RuPKjjncri8B97+9rcnHm8I8jzN7x23HifLQaqLnEOrQ6jN3c8///yMUh8fT/zAU+YN/YKfTV+juMQnb4QpgbBlfvyuTIclJ7Td0Ot58Jvf/ObUbRDOdDnubLnOZ0kr5WF/XF/1NDkMy7VuA6VOQ0rUWltoVD6Oz9xdA0NFzJnlozMccyWF9Fwfrp+SBt7hzwoAwMqP5/qUM8ZR1sUQth6IS32aDvDwDDTLcz2OPfl8jyy0N3uYCdzuDdlr/573vCe1sR5N3Usrc7tRQhwVWo6efBkHcBg0xYz+HrV5R1gVfPbQKlC8Mrxx8AFKMUGOFGzf1Jp/7vXOgA1+nD7xtU8gP/DAagNHZXm1QJaDKXKSB9PmdIkPGA80IUkQjntccJfxMoJ+8HN8wvqyv985fPmMhIN0UgKrGtBchivfT+ceWhrR3giXw5FfANflAU32dzi7xkX5MsIi7jNNQFpAd0N9yFYgRXO3BfDV59NpIBmy1Rf86kRyFUk7HzN90iAc76CHtuT2xDv8PM9nysGURfYJSSJSJxIIcQnbCEwXK1foK5BePEVtFH6v+onQWQMVXPasHsGVsex52TyDHTzvAXpNNYras/0xyZQiJ+PYOOMsWejhD9CLumclPhe4uAAs17S/POPboIRtswBpOJ30qPsBF0Bv/6u/+quJQ+J4TSOMaaoNPJym4xgV+E2X7/0Ol3f2r49bhmt2T1yXHWH8cdI1E3sZNM2orXtPFz9pOB1cA+VePuPPc5nf+vflO+79vnSdH9OLFp92gzRTWvHpHIckxeGMw/SZHrcFrxKAx6s+WAganG7pOi5hbE1IXFYroElT0YzeKG1e2J82ZAtV4mFliDRShsmHvfxDLzWrgPGGlGdZWDRKN0wK4e///u+TuSCIxlQWtgvOO90oPC9hYS6LKDgZ0Diw8SYdW2TpYxSTimn1+EwPuMDD8lS5vOS964TjMs3Gw7MvN1LERPBBP36+6uMax2QucYjvuO9973uTTov9pXhbhpsMZ/mupJ345BHDJ9kP1NIsw3NvmggPsEkIxtPIXRN5XVamOwNO/PDOYjabZyh3Ol3pLbID4JkNWkCj+BNoau+hw7QzTSA+UwhJEHnPph72ZDQDDHu8VZupn82DpR+o5adZXJcBm59IVwrfihSUee89JFPloRnu6fjPKvOTeTLnzTkwPj0na+i2ysK0E9NXKh1wgXFPXPx9yMXAwECtAZxyyikVLPdYE4eRuG666abE5Tk+BW7G594bbMDp9EinGTh9aMJsFBx0QOzzphPgmfV1AHyNKhI/54lG4B1ozF3ZijpZ3Hw5xY/LmGAeJSknN25prhNDo/yaNtxGtBPR+JmnU4/MczUdS7v2+jjG47RkBFPRl3qznCgrLCsdxniTuIkf3jku0h2bZ4hHW7GlJAeWWPKrT7/ExT3vScc4GYH5rDo46QCw0uMec2xGdjoo2hF7SrDcQ+djU23arBkf2wS2mTsNu6bHLmkDHDTivJAe5s34AQ6bD3v5Z9aZn/zQ+5d254hN9KKlUQW9Mo0FoEB8UYCMBB/4wAdqDcHKHwqSi8aOUYY3duDHKG1Rn2dv9gBfI5E1E677gQaPQlSWGwIN0Z0XO8VsguvKLtGAw/7/+q//mvRy+AU0oaCzmWkZrow/2b3LyI1blm+Jl07WxkmlSTThDeX9ZH6UFUDHCc3SbqerY8NSAuCdceGSV9Njs2qdpZdxZB232zTE8cABlPFd39StmRRjKRgUIJ36+Pmi+DE+wroeYWzN1ZMeBgbwky9fSE31frQtDyLSHdREdtdrkeRut04fT9LVSkx20BidAVPFz0B78GdWmR+6aQgUAoWPzbvn8FSkllLy+C3uKXzmqDqbr1apxHVDYuRB3HMlIUGgwaWhY8+OaAhDotG3Vp+wp512Wm2Enaqx1Jcz4X3xjoYnBVNqjbUUWZNCaKjNGmMZ3xIMDcxTGMoEcDnlw8QPcfEHt6dF5bPTdCPysVp0qu5Y2YwCOCw4HR7xHas7rNawcKsH044rhW2WPUwgJVYFhmaUBHhv1/XF9ICypw4834XpyhHPNOESz3F9LgJlVA4StsxzPKebiU/QwbvyAidlZz/CMt/GYtRtCWZHi0+Z0Za4OMiD9gXjOxxxSu0+6YMXoBPnHAadHJw7JMupRD2dhG/kh//ehFlnfgqHCnAhIXp5bkqhUuBUsJUo+DFCSquf5eDKo7C4EPPrTXpdOaXLtIDju1xZ5fLSdArYleWNKXQ6HpEYyRspcIhDvh231B14kwkbVGAIhy1pw68sO7/Dj8vgsjX+Uj/SjGFQVnLykcsMCaZkTHCbbiQ3OmbCmm7OR8S/DEd4SwqeJ8PAPhGHejVOXJcNruMxQspaM9NiauR2gUk2YRyvTDeJ0A/vyvIyft7jT3yngy6KspFhT60MXBb17hlnnJFhvfkIHE7H9YD+p4xnZWKZX+59mebZdGfVyEcZU3lEbQlGlZEGOTpUMS3xdIBGGu+ogtOUEnNNllXYpPP9738/N1mwKYdlFOKybIKVHMs1fNpac+hgOUuVkksyWHJhIIOFHMsxWGgRRxWUeLmfKfCJL5b6zjrrrMwDxkN8pFKKoYaoSZNywMUajWPDMUyRlJIGS2xQwZoM82Q1jHvhIO/QL8ZOU1bypI4tLQ9dvo5E/gFJWbkcyr0YGme3OmB5TLsAc/kVAyJoY1MUX8nBLNlgutVhh/b756YZ4gIYwWAYA5Tlyns2FHkDD+XDM/mVfifDUpfky2UDDp7FVKEOO5fCNChkvaozyM1NWFyCmzIiHi5xSnB54M9ympTFaSzGxiHahMuX8sSIjLokH+RbUl0e/847QANSLi1SPpJ2aicAm3ana1o4+RfgAzDSYSU+8JvGsowcd9ZdFdCsgQo7e3cVWK2XV+HmPUQgNp5dbMxhhECra5FYhVNRJ5D0gsP4cA3gY1RnWkGPTDgD77gI77h+V7p+b7d8V96DC2CU1267Wk/PyOBRswzPPfQQz3RZpEXi8XSHMmDTEumX4DgW5ykPLkYZ3nGVNCO6W5vsMmRfv+kmvO+97ZiRlWkIeH04helw+lrfzveE80hsicJhnVfc0jjKeWS5l/oxvaYfevAHvJxGGihULTH4RGXTbhxl2sT3sw/ucHkh1Vi34jIgTadLXIA25LbEfQmm1/HtmiYrW51m/chf4tpX97Mu9pNRV5YzXT5zeiyNi7V/Cg6mQNzzXEsbP3IphjgUeInPlW28dgnX7J3D4LoC6/1oFFRqPY6SBjoAmarm1UjkN07jsEsjtCUeSkl0FeS7PBPO6TgO80jC+LgtOh5Pi0jH4ZjiWN9h5meu7ryU+f3Upz6VOAnndW8ZRCXZxodLWfg4NJgRXQe0eKnKZe04aOJhNsKQP/Q6Zf4cznSbAb0cRlimU7QD7vU5tWRK5yEJnPgBF+n7wtuMj3aeqRlTIPQTTCcAp1+6zkMGKH4I43CFd+2Wd2Z+6oMypazoCNzZ1ALvBzf7hPmb5bustBtvvDHP0aPCuQYmtLDMyaw8IfyeBFeeNnNU9PGJPMuPSsOfRtkovZLmkhb8J2sohDU+bzGlYVoZxvKkG7hxGZ+ZnxGRjpHyQfcBEMbhYLznPe95+d4jtPYh7FZ+psHKU8pZU62MAwPW42RJC3sB0vR8n+Uyz/dNq/EiqRGWjsKjPoet1o+kTgeXMneHUa6knHnmmTWJyp0E4UvA3+Xmk3booOh0LNGwPOg2VMad6T3lTtrOO/jKfLpeZprOnoq/3zE/heeKRaHCaOqz0mhE2hiTeXcj21MF4Yrx3nnS4vrQxAGW9ZVKuq5sv6t3y0bQiE6nyZFVHB5JeixPaj6YTM1pPIDzCn7AoxmjoZmaM/cAcBovDY+GDl6P/JxijKEKYHq5Z0Qtw8EsTr/EScdoOp32P/3TP9XSJazzTfrSaWR4Vl4Y+YlricL5IX3AcX3kOczKUiLlQbzyuLWSpmrse+qDZxsEeeXHkgPWmVh6AqYzH1r4IU1DeV/6OQ8uW9LwfaM4jrsv3N01JCrhfQkoQ7hQ8qnQcocUO704RQdbaGzxURKpoPLaG7Si6AFQ1AA6Ojt3AEIX6dYDihsu3hGG+2Zh6+PyTD7VQEPGL/kaxZNGydyHL31ATSmlhpO4CYTCCWA3m2lCwQQu0jdw711mxAckDdT2s5tW4mmqku+Nj09SQVc9oBgEwKtOOu/ZrQgux01P/XBSEcpMMX2WCSfdoLxFQQtQTgbigoPdmnwiTVJC7riEBt6xgxKlrfPo/Di+XXAAKH8B7PjBQf7E+KlA1BSyhicDtfhj3AQv7xtF5/1UYRrFm02/e0p/NlOdJC0XGh2AG5NE4fycNpVv7TLv90bhssIAoKEFaDxsHnHjTM+JH9KnAXOZnpL+snGX8cp75+G0007L7+vRSE0D6RqHwxEXZjrzzDOT+RyWAz9cXsZPWcFEgObx6aLxlhIr7/khDoxkPzM86aLhNpC+RrCQ8i690Oxr7T4ZcmBgIP1cRqaVjhOgDCVJ5D0bcLzX3uEcj1UaWU5mONJiRYDy0Mc/aodzQBeXyzsDFz/uFJwPNt6wAgTjs5KiPSGZ52bxC1S1sjFOWfmFTNBzdYfVlvrydn5MI8++x/X7Mo19eq8M7Pegwq+JlXubWOabH/7wh/NASJQ1FhGZimjU2ePJkzfj/chHPpLirRpEWp3Z0MbvcT0l8hydsCizyjk/RIIXsGaecFwooZwXp437nx+vHmrqcGjoGwHHlzkMLuv3iPfQxmWcxMUISktntfAczOm5tvNEON9jegxOxP3Dpc/gnviYaQOIz5MBaTsMOgimbNhN6NCVyo3SIQGEaRWcF1zaBdZ8zjvTkengbDXt2QjXQSLK0B6DEt1+19NNkUvTrsrOQyA59ILRT40zY7onnwJNW69JS5OY6Orsyu3JTG9IB3sGRkxo4rmkraurU2G3xE8v/WkM7hrM0Zd1a4ctCRBjpijNFAEpALyMeqTb2cn6eHW6wlZfxPRNmzfFUUcelZ+zblR/jMiX/OSS2HjHxtzWLIOmLKMqvuqorK5abFsV68W4OV0jTdJGanFY02uXEdpTGudBS5B5KMmo6qCzA/z3TGscpnTBRX2RHvdIRNSjbQIYgVsF4yKuaeOAGCQytoYjHWKPYfpbxdtuOPADjeqjXVxl+D3O/CXyvV0oZVrN7qHBhTdVxTus6aawaUgu9OaiW33/OXkDNa1J10RUOgDScVqEGRtVg59oxGJ/aj8qYlbi4a/HGpjO+jw6Lw5IfJgz0w6JpeBMfLuLpTBoPT2E0/9uDDg+0TFqPE2Gg8wE0ZZ465iNzsOMafxEISujyu8XvviF+MhHPxrzZKD0chk7PfOZz6zivVf5FJmvppi/0F3NW5VZSINn/Em3LN8iWu22msdqXeDJM3EkseSn3LU/IcNKgZqf8pYisRamhmQP3biT3EPo7oVmRszvQnbDo3CxwKKgpAnOud29UtyLHqaHJKiwRoWHH0DYZsxsPG4oPPs+I0/8VBstv5IMxnVle5TFm0aoe941bqSJgkB1QFpOr1GaDm4a/dxq2MbhYJB7WxM2Dlstu1bSJUw1P9THRAy56uIcfaLMFE4++NMJckALaS+fONQzyyOQJqBRIVW+Oi1PboHnHoy73bmcmuXF7cHv7YLEcQlD25aYnzoPpKnTdbAL1qV7GkiLdN02kcjQe+BPh4PUUdJc0tsuLTNmfhMCsSiD9GnnNCfVJ5fylBLMa7PyWqiodolvFB56oMVpcnovIhtKJkRjCo/OyoXbCEerfjRFLlhdXU1G0/iXLs1S403+Vlt4A07PkPy4ETuMn2sBmtyU4bmvprp7YONyWN7azyEbxW2Gq8RjXKWfcdf7OQ2nWaVCDXDCo8r4ibGjWobSBihQtXR5m6VNeL2XXJLxqiEnULTpmLnNbEglnP6LIpOTmlgVMHM5DC5tjM7Aba3NZJsGBx/pcWEGzcGhsjfJbzwQiXMcMT2mLdOGW5FkmibGC2Vm2iBiU8GCy9oxWzRB6XPNbIbJewP3vuy3p10VTKJkJ5k3oEAXCjXekb7dmaQtTBXZ/VVIjQt1VPVZedSdVGCVEWW96aXwGI3eXy+MePOijLjPstKOT9XPsAqU8qVEq+Xs8nVZU+68nz7QBjDfBTCI8hkNtBWucts3bQZlIhfxrDSdfuqNY2Lbgqm19rskDdCB1adtJDgIBdgT6Ut2mj64l8IVPbVlOEQVAP96aORXH2amz9ACsPbNBhTO6UNBI810nhDrZaCZ0tLJyMTVSTF6DCJtRnzyrhGioyoR6OFe4Nq914v7iUdntZqquS3v4T1GQPzkahuXfChPKfHwUrlq24/KXuJ/xz3LkVVErf3SRpD+2PyEopMvKGklJDjZd2BgINvOeeedF7JmrCkL3c4dl/h7EsTQ8f73vz/Y4AawxK1OJ0d4FM/YSZRttryfDh0zYn4nqJ4wP7xw5pln5lHMN9xwQ+5W49hsgMJygWn5KrhgQAoZTSrvDDPNELiMA4MZgDkToCWxWgdlmpw2cRyPsMZT+uG/G0B2RR3fuERTtU1EU8RYmaQpvvBJM93RYC5dw5Fxak/3vxvlP7l5IufVx2pbqN6rXNV3ck898GZcDx0q2y4YH+Bli+A6JziMi26Ko8NlSpwY0FPBYDAcgCETorVhTzO78bqtwRcwvpY6s/0xDSHf+ANnaecoqyEO7/jTdoVo2mDxGTHIohA781jfZV0UwB9RCcC/PHWnPDKbcOCbKYDDeJiKsIuNDTAcD+YdgRbdHM5pIkpx4d8SPYiCEk+HRfaQ3PFxZFWd/zYq89mxXUIrgX58UO7c1V4ZIIpTZnIpxyxPlen4iMpZH2FVeTNFqK8/RZgUqFMuANPl17zmNdl9I1JzcdqRTZZpM7RXwO0hH/bCj/PBZiMx8r0uPlDLFIQpAWFNj/MyXZJmrPCj11Hi2fnQS5UjpYis9th6T6/Jnm6kA/aIYyFFL3f22WfX9qLvjZ4VyzW0xyj6GPlNr+lEKsDkFRHL0wEVatJdn5+MXPyoGaHnV22NR09lJEa3rI3BO27QmtVgjHfqwxh6g3haLZ0i4sRtDlrNXt47+AHnkyO68+8R3M+UamePRvqu6B7TNLKrJ3pXHBXzDhqI0Y4+1Y/W/FUiLFW2ArRR6pN1f20/Dm14ymgDAwN57DqWktoFmX6cz3CGPtLCCOw27DTcbvy8J13anXYAhjY+pdRx+umnpwIdWwqbabttku5U7XMq2mYk9pO4C4fCLe9JGGa2P/fOgA+UYH6F2A847p4sXNJmTmcTV9IA8IcevvryxCc+Mf34+i2feeIrNxiFlIWcARr8dDKfHx9VIxyMwQ3XxZ1X/l/07lgX3ZXhGEk9gNbO1QU0lU3V0Ftrug0SPwC8Mu81Zq/PEMyvc/LVCXRU9B0GLe1tv3VlLDn+sbHgsBPUKagDUIeQS371URs8066oU0x8+ZYfAwEDApp92gdafqaJfPFXpzrXDJfcHt1mGqDeY15MMTiURuchJj/QIdEWAWivB9NW79/q84xG/kaJUEj1RMF0MBvzKYnhqYTTnuq0keZkFOIA9fEa4W/Xz7gdz/ShXOEUHR0llUs6N0hPAdDrc0pMK8YbEsBEsxrp5mvizp98KTpHd0V312h0K78VOoYKCqr7M3u71KfnUnKVDnWuah/jMS84U2e00htLT9Znzg45Ue2mp6WR33WOteGaNWuyblFKo0RjIEIa4FuInCjF/hHAbTYf9uGP2695w3nZEyTtceafiigKGjGctUpv9pgqzp56T8G58FCmUNkcE4V4h+ivQyPSSImOSYdwhj7wMWnSmg2KtStx9zU/iJGrz40e9dLa+S9llBh/gvknRTD3cuoS6NAUTGPDePRKgVqJkSGV+ZonxLKHnK6S18YnjehTgeucDp6NPQAjvyVQnYSUu0Vpk4QFzGz5MMs/s0XDnl2rmKKQyBSiFltWYXxncopou70mTnnt9rLFB+LT63veh8gH42P/PjAwENokE2xpvVEWXUAzOlOk11JfZWxYnQAjvRqqmqRh6mbpkHNuoxJAq88yCuWYl+qN1ZTxMS3zjY/sVtaN4tvPjIw0pyPj05vOXwq/XOajHdhwhpeEdxszjkZuGaZZG2kUbyo/0jfNU4WdyftZZX4IRZzyNR3CXTB228HhAqWioAGFCvN+5liYJWONyHSAzRuAVi6mRl+b96PcA6qCPl3APd1Avpj7mW4JqCAnFvqiW+XdIT0L062qPqV1pOh/Xv3qVwdbczk3gO25KNOYT3MxNXUbAWt5X58Kbahsg5OFrY+7vzzPSOHXbiYooHLdtJ34LmxG5wt0yAUiGwduYF/NOy4qbyoow9AB8PFPjH+4dHR1Rve6Kiaek4NaZc77FYpBKsV9mB62Z6yag5mUAAN/gl3VMdDJPADjKvun79Q/tBEUaBb9iYFfozbZjJkJT7shDqcQ6zsHOWWkLTJdvC/BrDL/TAqGymBU1hn/2WODa2BgINjyyYYHKqVdACfiH1tnmf9zbPP5558fOlYr54DsBQCaNYSJl4SojvLCB/DbPjUZde6nKIHkcRcmrsq31rHm5p5qeRdRJr11Pbqt8Gy/SSNOvCQeFwMIbZGDR1AQG1Ao2kCnHbyOP9vufYL5KXAKU4ZDocMus4DZF46tAPNymB9wONzyebKK4B0VSYXSe2ODQHwvsSSipj80Pqz7dE0I/VXWJ4J0AHOwR0uAWh2XOKBxV3dIee0xv4mZrD04DK7bkf2I5zamw0LSXmBgYCBPXvJ3FGD++wpMLSfvRznBTgCTYRR0FDbAqF0PVBIXDO0Kq69I4vAOcDikAMQ5H+DRKE5GKH+EozrLLz1pltNrmLtjuX8/VcV+lWPWk1x5TPTrKhg13Yn625OlRJ0j1gNuR3Z55zaBglhWgMFoP1lb3JO07Wlc0xr5XQBmnj1NVD0+0iFNjDDe9KY35ZwNKQDDHOZvriziwcBshWQbL0YS6ARKyz3ClHSb8fHnvsxbGY739YANfzK55p/jHZIetK4/XjRIGi+i6xxMswQm5H4WVAFpjLTcN6xOYMLgRToWJK6p6qlZ6q5r3vve7QHLUNoRimDOK2RzGCtUZVt83etel5ahtMWnPvWpNV3CdOlpRudk/qbbYdpJe1rr/CTIRULtJGYCp+s6TcR0GB7R3LTgMmrr67F5tJLTeO5znxv6KEZWnqcHxCW8K9ph23VleK78V2LLFd+OsRu+HvM758eo1qLZrVaRP412t51r7SZwPw9PGSbb5yYerCWloxnZoS+5PDaWn/x0lY4OVpX573TbIG3AbYG2Ax7sPWB6zqZg/7wBXRN6IR8H5rbPYMNKgdvidGlxOu260G9a2o3btthPgZEYjLMvgIKmAihsVxx0uNA5Aw9gCYf5l74BH3QArNuzt4Ce3B0F4bifOVRHppqYOnOEcxh2KwHXkd3dXk7rgXp3O6A9cXgGJxtztDhtBcbH7JdjxjFDZz8AHQPgtmbG8zRxWoRMI5Jpx/UABi3tQltiP4mRcRiQHs9KMfu3m3i74Umbi4yWnY/9wIchB4BCBho5shoDDvQEZ2pTEds2Edf4aCIVW+LJiNP6mWiUONV+YFpY5iLt/RIww7otcdITH4FlkGA/PzAwMBCY/9LOuThSfM2aNTntLCkEh4F2tLf4ALyA07OLH3TybF7Er1VoWex3xrB+o5DoBfV99TSQKTNeEmaiIcbxS8LKsKX/dO6NH6bX12fyrHfw0CuzXo9ZMdaFXsPnHb07UwKmA+5Q2qGpXuzvk9g/JoEIW/T7kthPnsu6omz2B7hH7IfJJJbrd3RkZ8tiP3lyvZrp3dljwMUysY5pT5f8MtIzYHgKwNeIASwAdfx3nHDCCQ3bcQbaAz+uA9NNvUCLAX+YHfsCPp4CL1511VX5msGMw04xZGoVWmJ+EoUQDGvYdaTPRdXwMz/CIo4ekoItmceZIbAL37gczm4N4QxuXNEcsIjCT19GDc4SNDDqU3j0ktBL5erbf2nyiYTg+A4/lXugMH9VXNlzIvVU5dbq+5kyP/VJPcNAtE10RSwNn3feeTk4YM8BMD1kcED854APFHgA1oAvfelL81PqKP3abR+JpI0feIM0uEwzbZmdh3RWfPqdE6n0LYY0Ra9HzaoDiknzWP37+ue2xH6+Oc9XWBCXWeqAEDbpACWjl4nYv74HI8yeZHzjo+AY7emlWQngc19YBOr7b6Hzz5I0OgHCsIMLy763ve1ttS/aEKAsPNO/p2lNQvaHHzU4/g6k/LnOYHguRnM+34Vo/9a3vrVW6rQDmJ4OgtGUtgPwhSBGUX3ePOf7+Fki4H5PgGlsVO7QTCdEJ4Uegk+VWQpx2tAOQDOSLW3bnZnDTOW2xPwmEMMafQElt+WCGNNYf2SBMCXTOGH8KVy+s4fIjYiN5Vyz8I1wGFerLjjcCZAWNLIsqNNQ4tOf/nRuKTYu/P3JK+fTLjioiP0DqgqF/J2QxKoNSD4q4+roXVAqTblYWh6in/B6SsCLKOnIn1GR9XOtTehwnHzBu2ocguYTPoljAks+ped++OP6Y9S8+OKLk3n0afKkFAmP6R8SIPUL0wNIgzD9s5/97GCbOYMD5QvTg884M/AMf+rbePlMOqTJVnOf5UdybIbjHbxEm+QeXQQM76msebFV8lpifiOj0F7/+tenNpTC4wONzJMgvhmTQCRfNvGhGeBiOY6DESl8gAwRDukA1/7cc7UKZXgXqF0UgS984QtDX8PN9Dm0EbsB5krYARAOOhD96GXpbSlUpAOdSlwL0w49rdLdLBwHV47JenCsozt6xnWaTZq06mQbbWyJ0LJi9wIxp3a4dQxHl5a/x7TsNabi6mH9u0MjmhrJOHvexdjzxsTcejeir/10jXToaIyxGO7uj827WD4biwV9vZovsji5K3qEs1dpSGhWXLYpay99txS8Kh9E8WHh7R6j6aDbaF/L3Cy/M/WnDgGmp0ilHN6qLwinH3VM+0X0h7HNMEiIHIfNAR5r1qypzbHd8dMe9hRAHxe8AtOiN8NIDeM18wDvmHYwZWWwRcKG16CDzqxeAnjGM56RB9DQRjlqHGi1jbaVMwqEjyfSOxrITLPE8CdTiN0Anza68MIL0yLq1FNPzXiOT6bJJBXH7jp6YnrA6Ra+abLrdBjlKSi+9ss78POOCxqgl9NeOCzRoO+8pxGHcdh/77vVEVulqBoVc+d6twyJunpj0/DCuOZ2dQ7ivcNW9MeR8zRP1GEi4z1VU2NMYHvHd0bX+JCOvZISCBNkfRKsU/nr0f1Qx6K45JbB+K8Lro51W8fiMcevipc88ahY2YME0CV7hXni7aHoHEca6A4drZ2dCkZMo+pkUEOJEijbb8B1yGYbdFMAnT516gGFA2W4GLg4uQnplSPcqHvAdezn9NxDP6aPgQebAVYZWFpkKgINtHfSpZNClEdShdYSWIZkFypL2QMDAylJI80Qz7SX4Se7b4v5YRYXopFOVkiEZTSHmQFvkeUgBXCRWQAG5N073/nO7LHpJDhlp36TRH3meAbM4PnQ5IcwhIcm7qGLZxqGCw4/1nuZogBs9EFKqc9zkyT2uLe6o9y/rvFcY6wap46pHh/viu0dS+Lrl66Ns76ko6e65sVvnNwTr3vG0XFY3w4dKCbGFWN36sQbzVRTchjtkDEUJ+IIyzztg+9W/m8bWRCf+O618YnLhHfJyrjxwvXxjIccHCsPXhpbx3t15Hhv9HVvi+6Ru0WDOmGVFfGxrc999jpkg4mFiNrj+Z4uQrcDf3EY81tGSurYTMTZfHxYBuZHlAaoXy7agXG0SkPZJsv7RvHBT5v/zGc+k4yPqTriPV8Q9tkS0MrS9Jvf/ObsuFiKhE6+c8g8H9EeKaZc2oN24kF7O/S3xfxkyMidUVz72y899ON3z3nOc4JTVNBWnqm1djLrOLiEO+ecc/L0HJR0fNOdFYRXvvKVtfTqw9dn1GmV4bgvwfSZ2evzQiHS6zIlQTcA42MgRC8LOHyJc2/eV7/+o85KloTjGq2Zk3fqUMv18u6hfAAAQABJREFUW8fjf36yIeb1r9bI3Bk/W7c9to1qpGZaoOoY71KnKyZHiB/V9ADJvEM/lS5NE9QpjPf0xVVrh+KzV47EcctXxzZ1Dj3DPXHz9mVxxWV3xiXX/DIOW7YoHvWQVXHi6gXRP7pDU4jFOpeQQzM1JahobVkZlx5d7v4j9lN/dOCM5tQZe/YNtDtWdmB6nyBFeNoE7QFw+3CcVtyyTZT3zeKSBkpGwMtyiPOA48PIdFzoHpimEI52aQAHtAOm33EdphW3LeYvEyjvnVC9n0dXRK93vOMdqcFkDkOvZaJxAbSbACIMy3QUEO98gQvlDOesY7BDOPZPMydnbuSCBAdxKBzoKWkqn+v9HQ+X5R3wA3RU6DWoEDeSfDELP9V9AhKxlR8+XYEI3tG7IG7btCsu1hL0kvn6gKTKaddYb2wfmS+2XCpmHxY7qmF0ijU55DJ0SKqKeLtG819u4M3i6Orujf+74tYYHlmouJr9S58w2rMo/v27t8cPbtkSOzQNiE03xIueclf85fNPjGWd43H+ZZtiw87xOGJpb5y6ZmEs6qNzEbNxhsF+AtQP9T4gcZh2os+Y59wapoeRGFEBt7lyELCf25uzZH/aS1n/+OPHKgJp0T6YDrNCUI7CZTsjDvoG7GPQRSD+M2dHwjTQzgHygU6KCzBdxlfSkgGm8dMW808DfxYQhNNzufdywTlDZOS0005L9CwlAoy+ZJRC4D0u5rkoHEuA+dlUwXl7VDCMilhkXQHxDFMVGOlBE9MUGowLGhx+Zz/j3LuuxtfsG6FLc2ydVrtpZ2d859JbYoNG/wU6L7BbfPrjtVtjgzS/O1apgxhlvNd69djKuPqWrbFp+9ZYueLQuP6OO+P937gqKj2Lo1/MvkOKviMWLlG5SpGnKcGOjv74zs3DsbTSH6uXqXNe3BtXbRiLzaNL4pfr7ooXvlvGJEeujti2Lj7+kqPj6aceonF/597N/jSxU18D6gCw5KQ+Mc8FXI+uQ7c/J+Nnv69vL8THj3CEwaCMk4DRCQFf+cpXsiNAiecOwLjt4s/WcQY4lH7QyeDFCG/GJ6zTdlqkZ7qMa6buXmd+E0gmDPWZ4B3MjtUSWlgkBQrFBUh4JAGUhQDzHpSDAD0vF585AihYRmv25aMcoSMwHhdkBmzwYxqpZIOVMHuj8J1GM7dTo2ouwtEHsBzXqU9LXb8u3nveujhiyeoYHNHEQBr7uGtn3Hb3zhjpWRF9OuO+0r0wLrl2MF7zLz+P2yTSH7lykzTFUhtWVsSQlH79mir0ahowLs19fnJMMsOYlHwrJZEpYIwNo13ujFs2j8b1G8dj7XrV3eJD48ErVsYVg0OxfogpwHwpFKvSWjP696U/dY4WnTp1HUJPfdvDz+3CDIcfcZAwOTkKpkSTbmmQ9wDzcRjf00L2laBj8DbzRmlVY0asWbOmpp03fY3CN/Izjpm6e5X5XahlBvCzf+nCcDC11yodjgxSkUwVsF7iXHXOYEMbiqiPMoSwjPSse7KsyAVwHDMmvCgY3QHki0l+wGUw3rIz8Lu97cL0ylgq2RD6gWEt2127fpvu9PERMfjw8F1S5GnoX7owfnr11jhu2VLN0VeIqcfj0htvFePPj+M1quzaNRLLhGlMYQeFqqNngToOMbx0BF3daO7V2emdvj+UUwLUsOoCYklfZ9x2V0dcc9vOWLxA0teuu0TTuN5pyUy0aChVvKqYqhcTQopGKIjNjitzwdOsAO3M9Qcju95KpvZ7wvqCOMJisAbD//znP0/TWfQ+Xlp70YtelKdI0e7AQVxGbPQLaOUBOgEkT4PD+RnXtPDO9OEPvtmGvcr8jTJU+rkgyDT3rhhcnh3WhfiKV7wi50ysgV4wsXzoAqO3ZX7kToH5HTb+zN+9rOiwdp2eK8Hp+b1d/B22WRiHbc0VY6uuq0zNtl/dweuwerYBRvxR3WNoMi96x7SEp5F47Y7uuPgGKdsWduv8ejHeuLT/Osl25YKu+MrlO+PTF14c73n+UfGERzwgtu9QpyBkg5oGDGukZ8/BPK3xd4hZt6ozJT+9OnW4k4+LdGlPAst6MSQ9AV/JkVKwY0f0atnve5fdGrdvGo2l/Z2xQyYFB2tP+yXX3BzPPGl+HLRkQYyNKk4ntGrlRFIFH9dACdij8w3Um6g41EnMEjSrI/ypt7K9QRKDBbs8kTixC8DWv75doWFHT4UlKCsFTDHdBpAqOfodc3faEDYkFvnr0yI9x6u/53lfwF5l/nYz5MKx6/h+xsaAtVk249x00021FQRMIG266zh2rQikATSqEDcYRDvfOz1wIDEA+JX+6Tntn+R8MQnsr3kkIj1PSgNDHTqADq3pkx7r8mjqx7q6NQrvjEtvujsOm7cshsS4GN/oK9UxIhF1QU9vDPd1x5cuui0OXnNc3DWoeS4jvaYGMmtRGsOxRJq/XvHiru3aHFPpFrMrTa0eoLXP5XyN/B1aKajoEIIOvd8m/8vXb5XCsBcdv3QDMu6R5n9IOJEuOMBEi/+Kq+mHaJ0ntzI+nJ0YHUh1gZIOYPaAOnQ9lgMIFLCMixjPyhN7UtAvwdQlINqjI3C9g8NTTCvfHJ50MBLC3D3rakLacLqmw+H3N3e/Yv6pCofelUKmd+VCS8pSHIYS6Aow5fzBD36QYhtrvSgHqRgqYTLGBS/6BHp/7jn9h+kHYl2pLJqKvnbfw/LM60WcosL+fJ2GZSdddAgTh4WMMYJLhF+/dTCu31qJgYM6Y+eILPDUYWnZX6Os2Ew4FszvjR2ai99092hsHBLOXom+Ym7W7Dfu2BpPO351DGgke/85F+h0mlUxqsj67qOS13gt6aBbac/r5USi0RjRKsB4J9rx4RjUSkxXzxLRNKplvtG4W7i3DGqUX6owMgC6SzqAHYNS6orxV/VLoy0FYmoryIrCzxZQx2ZC0qQumZcjurMDjkGCb+F5aY0wTAlZ+mPeDcOjjefe3+0jDMD381h+qwfCeuAgvhmftLnfn+E+xfxULIxMwZqh0QUMDAzkRWeAaIaVICsLWPPZgq8R84ODCoLpmbuVQIUyZcCaik0eiHik2whPGa+1e5hdjVMi8rg+4z0mkTkZX2NlpzT4nbLDrRrgwpiY6kiv3rE4br5zhyJJRNd7vlSDqN2pJT1o6pBIj3Vfp+bwOweHY6tEWrVj0TwW8+cJycbtcfKxD44VS+bF1pHBWDRBaOfYkJiV1KQzkVnp4095cGzYuC4u++XdMb9DI+CQdrtJtB/pHkpJYok6mAs3bI+LrrgjHrzy8Ng1PBqf/O5N8ePrt0Xv6Lb4/WceH6ces0ASyxblYaIjm0hrbzuuT7To6H1YSmOK6ANenD77SwhrxsW1ua/DoDi2vQCjO6tKjPzEK6Fk8KwH6kVhuLdbht+f7idlfhNvd18T7sKtpwP6uGBYlulsUehwxJsMmEIA9OzYEoAL8fCjH/1oXowYNkzKgNP+qaNDIzrGO2JfMbJs9jUC8+FPcbZEac33EcgZ/XsWxlox3Dd/dGMsnDc/xW4MetATdGren6K7JvUj6giWqdPrl8g+pjX5fhR6EtiHtQJw+CqJqAPLYodEfvUwWhHQvH5UnYVGZiY2lVF9ZVj6gZ07B2NoWD6aZoyJKTQORqckCOz5K/IbVhqS7+OOO3cqXn+svWNT/NX/3h5HLDsqblk/HE96+EicfEyfTItEnGhX9zTt0mo3otspc3dbzIEDKZHpHyO+mZIpAJ2EgTbDJi8YnrV6jM0YPJAEDMbv5/r26HZm1+Fm262ns1n6kzJ/mQkQAqVfM6Sz7Q9Npst0tkMrdtUAFmGIgOzdRnFI5TN62Fw0A83gBxqhL4tSjNmjeXjXMKOqtOdiU776mwY9eoew3CFmixGknN64/qZ18YNLt2gZdFnsHJVFmEZ69XUa+Zl/S8kmQ5ztsu2fJwVeX5fMlyVB8KHQeWq8ayW2/9aJS+OwVf1x9d2yFdfKyLgsALtlGlzRUuDOYTG+rr75ffHNn9wQPUq2t2epOpNqZru1lwBFYKemCd2a48fYjli6uF90d8dNd27VPL9DBke9sWpxTxyydLGmBqoPWRxiaah+bdYByQ845ZRTUuRH+mN0Z198CTA7G84wnWX3J9M8FMVuS4R1eyrbWInD92Uc+822a1pbTXdS5geJETpzPPu+1URmM1y7tJEfbALY6/2hD30oD0rwWW233nprShPoDaYFDM3ZZ8IBuzO+nsS52lSknXmjms/nQZQVafJHtmlEF2OK8UaRDDTioqEfQV0vJuS+S53EKIo5MXZFI7fG4xzhh0Z3Rkf/4bH44CNj8fJfxN1btsbyeTILHR2MI5bPi4VdkgIGtVSoUR4V3vptHGwinYAYY1QSxyZ1NCsXLBZOdT5aRRiXMdCoymdJd0csky5gaFD4NaYf2q8ORSP/uuH+uFH6BRGpUXVHHLdkRB3MAtGv1QmmMuqUJFxPq+hmEgkTXqBeCYz4zu497D9gdjT5jPhIjAYr+nj2/N3v9rXbCu+5/bcSdkrmNzJGP0Sgco7jwqhPqP7Z4XB5BxhvPuyjH/LCiIDegP0Hp512Ws79mAaw1ovVFZtAUP5ZmdM+qdWhD60+InCHRnWAr87eProwfrlxOLZsYy4fMbByURy1rD8W9QxpNN0pxhtWKLGPGJzYiPqdXWDRdEBTg2GNuF1jPRplpfnXkdYLuufFlbfujEUXXR1371InIbPfETSCMvBZddBqbc5TB7B0VRx58DIZ+ozGcx5+ZNy1bWf84uZNsWLRvFi18qC4c/OITK21ulDZFkPqJMZEwWhsjdMefljccKPWwDfSYcyPy24dih/LInDtFnUe8/rjruHxOHb1vOhfqKXCTs33u7WMqG5JvdpEkdnlsdoGJl7UnPRFimOASV98yni1oA1vaFPoZRDbmefz9V06cuxD2CuyZs2aZPZSa097pA0Ql4s24fa7t9qo8TfMxCSezegxPt6zMsEUp8xHM5RTMj+Wddguc3ophcdmG3pMMwMJkxCFjn0+IhaWVRQo/oCJ495+Vp41y5Dj2QWH0yrx8R4c9psMH2HrAXoB4ltfQONhnz+4PCrYrY/f9Fntli/5SJBP8b5T++sHtduuS6I48+ibB/vjg+ffFuf8bGMq6Lq0Ef+BBy2IRx93UDzhYYfEsYcvjkWdOqa6sj1G5y2KsV6J+sM3ShfAEpvGX438fZ19sU3WeOMdmn9LR9AjO/7tGs2/c/HPYmS4TyP9AjHlSCxRfZx36Qbp/HZFb9/yeNihA6JgKE595LFxy80b4+rbB7Vmv0ij9urYftdarSRonV6jPScBaFIRtw9uj0eccFSsEA3f+vnP4uBVR8Qt2yvxuW9cFiM7R+OQhf1x66h0LhoceqUS6B3VV5CU9zzPUAXEsuU9nQAe6sp0wda5X0HumPI0JkmI8tK+xNx9yN6BcU03WgXqy/WPbQfiPO2Q9lgCde32gr/bgMMYh5/t1sfD33jsNovrsG73dvEv45T34CQcbY98YJfAQIUy27Q4PjoMDOA4chwJ5+Uvf3luEzZdhKuHpszvSKyFYt1kgBj2H9O7EAZm5ngvROZzzz03E+TcPDbdlB0EmSIuFlTEwRKqFYYCB3EbheUdYFpN43Rc0gCPwQ1iZriNT41NYnCu40up1j+vS/PPdfEPn70wDjn8MGnG1R1oXv+dm0fjO5I6zr30pnjKQw+JE49aHcsW9cuyb1f84jpJB4ukGxgaj12SEjZukXnz/B1xcK/YWHOEjp75wqPy3SV/lHIatQ/RPFw3mi6MxOVrR+LbN22XHuGOOGHpgujTwR2fPuf8GFTafVrX3rrj7rjyytvTNLhLZwPskrKuX8zfK5E+hnrj59ffoamINjv1LhJq2SKMd8eVa7dFj/YbyLwgFYdSHMjoSEo+On11cimsaOS3mTIelEj1UntQB0G/wEgPoNyku2S2hPVhTWjIt+39UG+0US7AdUs9+2oPYzV0fTsx3lZx1bdjt2Hig7sEcBMey0O+C4jimSko/MXqA+/hKdoqqxusThnAywdunH/7l25T5ncgLKAAltHY4oqBBFMAeiCP7ijK2ETByMm39FCYvetd76otjZApRGg25rzlLW9J0QTrO07WMZM5vXqXzBMXOuj5MMIgDuvvFt8ogHpwpZSVVV+4juOwPDuM/fzssC27E/WIiA5g+Qbzd0tRN6qltiNXL4u3v/ihcfvGbfGQNYdJLF8ed+wciR9efXt8/NLb4vJvbYjoH4xDNJT2q8PYNdIdq5cuEdNFHK219NNOP0Yj2sL45g+vivXaqceBG8cu3h7PO+2BmhIMx/cvXxv/9d2b1UFoJJ0nY10xcOgcgN7FHXGn9ArzRzSijkoR1i1mmzeUhjodXf1xt9b9t3YMxRJNC8bFmR1jlVjatzD+6ZtXxur58+KwBQt1EIg6FE07KugslB9WKFaxZDkm+wD9jeqebAu10qTTUxDlHWE+lyfVaGFyDIswatJkJjuIHuHpUAY5gWhY9glMc7qV/nSgrHfi+3nG9TpBjCVY09aoDfqdXWjAFoVDPGi/6B/YMzBV3AsuuCAPl2HAxJR4YGAgOwCm4W6fNkP2gTkcVArfeJB2ONOCOyXz27ABxgdY90YjCsFGaAUZc2Myx5opyyo+nghmZR79qle9KvUGEEUvxbIKGaFCjCsTmfjBD9wceEAvBpA5Ms1BCChtnvCEJ6R4R2UYj13Cl/c810Oz96aH94Cf6+NP9kxzR3BW7Gzk2fj1NKYGvlwmuS88/UR1oIOxcL72LnSjYOuJxx23Jh5//JK44MqNcf2mwbhF23dvH+yVbX2/mE4nKA+NxOMO7Y2Xnr4mhsQs37tkWyweWhhX3XFXPP/UkXjGQyXu98+PRxzeGyev7I4hqe6PP3pVDG0f0QgiEV470W6+c2Ns2CKa1CF0dI3JhkCGOZISVouxly2ZH5t3dMZFV9+dp/mMSWogC0s1vO+SYVEfRwd1D0p6G4vl/X2iX1OJ8T7N83WsmKY241qu7KBzUJ75o7caUScxSv3oEebulkKzV/YHiPcoMHXEiMJTfyxNsseAXoMJB1Atv7xt8adZndXXYbO6nywZ4tDWGIxgSto57Zi22Ayf/TmwhumIAeO0d7/73cknjToA0+tDcpluw+QsQxMeOhiAAXQagDe/wac2UDOeDFD8NGV+R2CbLFpTds4xsiMBkCiJW4QhYeZXMD7AEUrYQ5cdhMUbTHSZJnBOmf0Kemq3LjDShvHZwIPE4cx973vfq4XFegurPPBxQRedBroKNgEhKnF0F/QbL66BsOgroJn5FPmzROJycF787LhTukqmOuLp4Its1HrWyNgxviuWSHk3LvF7VCPtkJR73RoKD1vYF885ZVk88fjF2o4rZaDW66/d2B0fPO8m6QlUXd2aicvgZn7n3dHTOaTlteG45erb4llHLIynP+aYWNS9NToGd8QxyxbEUU85OoYkfffr/L1OlH8S8XeOLY9tQ0fFTtnsjI8y6ip9nf/TpzJbrHz3qwP40Y1b4ssXrY2DVyzSdEJhRkQfjUyjOYrHMZkW71CH/tpnnxZ33HZdfPDr18TqVUs05kvRJAbvRGpQXpAMVOAS50k/VZbJy52yQ8D8lxUNliRH1CswBcBQaUTxkBagC/G/XaCeAOrQ4HZBnVPX1CFGW7STsh0QfrL6JSx4aSuc+Pyxj30sk0ChSFtjNyphShw828+jMx0ADI3EDB/U6yQSqX4cD54DvN0dozOkXvIKPYRjUxH8xz4FeMxxMmKTn6bMT3iQgpzR3xIA/hQmGSRxwgxo9Cbz11xzTTIYCjPiuSIchg8fcEIq8L73vS8Vh9yXhcVzCT71hDV31m8t6oOTtXis85iKwPz4GdA/nHnmmX6Mz33uc/H85z8/nwlHmihJMPeEdgoNHHQQSBbMqZBQcDHwmWzuVEukvIHplUaOdmIYOgA28PDtvly+Y4lOGvWKxNpUrElsx15+TCayWNUfolH14AXSBYjZ1xyxMn581Ya48mf6XFTXwliuNfYuMcuyeZ3xxuc9QsYqg7FSqwRHrlbHNc7KgZR/bMzp3JwGP5UhMYL+O1QnPTqbb5kM/LsXV0fYVKhppO7Quj+HdnZLyXj8yo4489EL4/y1+mrNiGz6++Zrj4CWA8XZGAD1quF1aeTetO42pdEpVQRmxnC9OjjpCNirQC/AhIfRv0vLhqwZdGhL8nDXothRWajzBvq0x2BXLJLB0AJ1gF06OJS8d4BDpdVF20ruV+/VIrheGY3PP//8/KAFjIUkyho/bZIj2gjHaM1J1BwVRzulPUzWDksSGHlhfAY9BgvaIJIAzN8IjBdjI8BMjJ0BdiVutw5X4mBkR8qFt5CeYWwUeuYt4jjfLFlzGezv53p3UuZ3YJi9BBNZIqcQuQD8/Q4XQmFa9AIsnTGqDqjDaIWh6EgoJFYb6oF1eKDcRglt0EuHAGCmiTKEsK5kXHp9Kg2tqMFfP/GzXaY8nDcAXks7fjeZyzxXq3Ea3eiUGM3UaeoPTTh+YgV5y0+n7IhFNNdlvqupuPzYUosY3CnrvG5p89leO19z8l0aGZdqmjBfx/UuqGzVHnt1Kiuw8hvU0t9WMV63cAuJmC3X2jUQdkq0RnOuhIRTTA9jSYnI0KsUc52fhbmdYjxO/Vklm4A3vOCkeO7m3vjYV66My3Sox4JebSHWCgOGO1oM0Ny/N86XQVCvpg3LpFfYOHh39C2RIbJG9NxwJJuFijb+5GlEUhJu10rHnTu74ubbd8VlN9wWN2hr8ro774qjDuqLFz/5wXH0crT81fAaz1JfoNLLzlNF1xLQ1mBw5tS0mWZA547kSEfPWZElAzWLg7/DITXwPQiOnjOUbdB+uOYV7uEPRmcsENlTwC5Aj+C8N89wbyA/ANMKLoB2SB3yjjiOR0fh9Hjn+4zU4GdK5jfDNIibieNPIhBkIpwozxABDi56YZgZ4J0zkB51P+DgPfOcj3zkI3n+HwzMvIm4iPP0mnQmSCVlWnQuTEMAGB9gBIcW6DSUlmD+aAPpggsmp3Fg4cfmEMD5cvwpXY2AQpWgalKThgG5E7OKETkMc4zRUBZ+mPOi8JonW/suMU0HOgAxMmvlg9pHv3HTllixcFWs3aVdcxL30eBXdGT3qDqDLq3la6NdjImZOdabZUMMc8dkPKTsaKlRDK4pB3sG2EeAReCI7PY3advviMz4Dtd8v79Lwr+kEaz850t6WNxzl6ZaB8Wux62KH33l5liiE37oqLp6lZ6W9aB/R2d/3LxtOJZJs7dUdgkju3ZoiVF5VLc2rs4F68MxTJN3zI9Lbtge3/vZ+vjONXfFrUPdsUgFs0Rbib907q1xqPYMrdEUpVdGRVgcsucBSQkJQInqggFwlZm85DQA1x0jJIAojJhPO6JOAVzazRVXXJGHesIwVorxbqo6Jgztgo0+rGixro6NSPnJt0yo7se4GZlpr2ZOaGsGzg/vy3ZrnnI804x/CU6z9CvvJ2V+kLY60hGuWWLGwXuHAbeJLgkq750Z7+LjHaI4YKMjVh1KMM7TTz891zw5LgnGR1EIgBMaAPQZQL0lWHrqh2VJwOJaPrT6kyN+tamKFzV/FdOpETPCa/CUCyOKFjEjuoBezflhUrGWdADSzEtU7lbnwNFdo9LMbx3pS8s+fZox+nr6FR4dOef6a1QXk7HRh60BrKmzZs5fdccg6YIXxlHjUNYz/4p30WU3xn9+7bJ42+89LR46sDDmjfKZKjoA0SARpHf07njUcavitx+xSysHm2OVNNS7BsVI2uffKbF+fLw/+iUtVNQZ3Kop1GHzNU0QA2OBONar1Qsx+U+vWh9f+OGV8fnrIlZr1WClziAc0Pl/16sTu0s6jSc/9eB46LGHSuUnCUcpV9iroM6Jg0I5cTi0BFplfjptpgDKA9MBrpRw5DUB5Iv6tQSKoVYj5rLESJug/cBYbjfG1cgt2ywiP/N+0kSSmAqMn/AlP7iNN4pfpsd74hqPcdT7N8LTzG9S5m8WqZm/CZvs/VRhGsUl0wBxXdB2ywIhDIVJZaLp5Gx+Kt8F7LCmATHqyiuvTOmA0Z2pAuEZLW7S6IE08Pa3vz17avwdj3RaAhpoDeiVqz1zSgDiwtQJJBPTkGFkRmX03ZLI1QFIuBNjy5JPSrFBKdn6ZDWnIyi0XKjvxokRRBHsooKZ4IdaWtyIEVRuVfuC6ovMf96Sl6540NFHxLOfpIM6lqKpF3VdNAc6CeFFatHGnyUy633aQw6KC37487hsS3c8cNH8eOojj9cmnl3xo5u1DCmJYXHnrnjB6QPxqycuj8MP6tdpwDpRWDYA53z/uvjSj7dGz4KV8ZBlS3Ta2GBs3bQxHnd0b7zowctkURjxiAevimOXq1McvjM7vRHpDsaS6dla7FERmgDKk3uXq/15pzdqH+SR+TyfZzv77LNTL4RuiP0b1CHzckR0pAKmcm4TVQyt/xLPSuF2cJRtqLxvJeVm4Zv5T4VzjzL/VIlN932jzLnAG71zB0B6vLfI5E7AdIDD2zUJg1RBA+EemwLC+9w2/HlulJ7x3dudaKRipKqVW7XpMvfW0K4mrJFMxjCiMBVdzI+RArolfjPfx+SFGIj2w1K4ZbcglPN0cIeO8RXzS1WoTmMCa5H8PcyRZ+zDLOIT9SO6Q/6QTlAKvoFVfXHUkx+kkVrGOePaYKS1dWLCdOzbH9XGn9HYHg9b1RXvedFD4hadJfCAww+OxTrB52Pfvjq+fG0ljtEJP32aZj39MQ+Okw7pjrW3r4vvaLvvxy7QgRk7FsQDOUZMqzTrtt8Sz37QwvjVhx4bJ8l6ceV8HSrepe8CdGlJUasOfCRkTMuHmCkz10dxWB3pi2xNceu6ZmA488wz41nPelYyN2I9c2vqm3dcjJzUKX5Ae/W6e/h2406RjVl7fZ9g/kal0ajA8aNCAe653Ek0woGfOwYag6UJ/JkXArxvlFa+nOyHNqWRvDo20ZAR+WFC6NOld9DGjjjO09+pXXA7NXHv0/x5UY/m/HxthzjSBUixrqU2jtfSFEdi8PxenbOvjoiTekXcJFQkERCSYZRaMj+PMBjLbGjtkS7YcwAf6C47ByhH+dihjmFRZWc85uiD4hQd7tEljfxIx11xiFYLyEuXaL9JdgjXrN8R6zdsi89/+5L48tr+OHbZkXGMliGv3nxHPOsBEc9/7BHxSE0hli+Q9FbZIv2DxHwMeDQ1GNeKhvhfedPUh9WO3LOg9YHcsThJ9upeua5pA4zK3q1ZBiMM75nr05lzOV4Z7v5wf59l/maVQ2UaqNTy2f6la8YmLIzuxkAY/Epw2NJv8nvi68rRHboYpWFAcEupxejeuzQuv3ln/M+FV8WdO6Q4k17tt558YjxwlZbjdm2R+Wwf03/NiDXa94j5Nb3s0bp9lzT9jNiYBYtPJ7qW3eklIdg+u6CJKUh2QEgadBooHMX0QHW0F33yQynJtIJjwbNz0BRhRMd0V8Sw41qv79IZ/4drL8Cy4dtiZFCKRSkD3/+1q+LWuzbHfG0FPn7FUn0jYFOcNP/ueOezTognnXhQHHeQGHtss6QrMZ4kDPAzsnfqfqxTGVReMP7pkYKEFQtorn4HkBy0Bq4fOnLXJ35crks/U8/2t0sq3N9f4IBj/rLiWqlINwri1TcCni1JEK4VfGX6sF3izd9keSWicV8KrTEZ3ET3ovjFutF471evia9d1xOHa/nn1g2bY8PwdfHHv3GC5tdSeIntUMFt0yrAQonE+n6WNO7oB7QYCEMzpVA61S4lE6r+pNShdwSBDoVDx8AT4XHRL3DB+EwfesR83EunL9zzFE5isUIOSSvPdgFRrfDqsCSic9zXqObvHatkRahzgW7TBqKDtD34Ru1Q3CB7jD87dVH8+qNOjuMHlsfCuFunAW1RXOVHCkIs+/KQEphSUgfP4k6N+EyD5mn6IT2HVjOYDnXLOKlVoI6oL+qpvCzdgcfv7bpOp1e/rVK2f4Y7oJl/qiKnAXgEqA/rBuNRhMbRVgPJAYSfKqvBSHBQGvJoZMNY5+bNXfHP51wWP9rQE8et0Ic3t2yPYw9eFF+/dmcs/Ma18UdPP0ZfyJGyT2vmIxLxu7B+E5/Mm786RvpkHKIdPr1ivexRdstAlbmrXlUaaq95JZoAtArZCYj9GIVH1VPIEDf9EOlHpXxDD8FqhVb4JJLTMcikVPGxC9gmiWaFRtA+dRpDQ9ujf2RT/MmjBuLRJ6+JU47Qxz96d8iKcD3djA4gZXOy8i08LDt2pYTBtwSluWB+T5lIihnNzgVVpmhj+WIaYMYv63AaaA74KPst88NojcA9daN37frB2FgQouXnSCcvAbH+zz2WYlj98XklFEbtp11lsupvtvscSdmEs0PLd+d+/4o491adfjNvQTxg2VC8+qnHxHd/cn38YmNP/PtPt6tDWBsvePKxYnwZ9WgxrFPGQIer07j2lp1i+rE4TlODo5epc9HaPt/zY2DPUd4JukDK52qgfIOYzSrDiHByrJeSES7xnH6wz+/Qzj26CMxzx2WANMIR3eqAOPorv96rjUWjslHYpA1Jz3nI6njZ039NnZXm9F068LNba/4avbulWKyWW5UIOkFklTFt1U3rQk190iow/ZS+GJ6pBlKAXmX3RK52B2cIf99XQ9CZY37LmftYxWGBx9If9ceFtp9OH1NuDG0AXN7RHoBWOnm3T4dtv21kUvv0Z8bMXxYC9xQ+YP9GheICw7X4RRzClhd+9UBv7vjNRu36OH42TbjEheFZynvve9/rIA1dNizxObCS1oYBS0+1y1zKU8NlBt0xPk9naqi4tfmlU0qyH+kjG//80zvimAWHxaZtI3HGaUfHY09aEQMH98Rf//fP4hgx+9cv3hhPOOkIacU1Zs6T1Z8Yr1dM+h/nXx0brtocbz3jsHjpM0+Ig3qkERi5S3liPo2ZMIpCcbGgaiJbJYwpQAljUqjxLb+dw8ti/S59K36JNhBhgKRwPXyNRx0D5wQx3iOxcBYBawWdYtCl+nbAGn0erKevX4eICMuyvrhB8/wfXLQubl6/OQ49pEe0HxknH3moDIQ2K//aOSjFHhaGdFyY74pg4VMbkEREnaQwkIxelTiwjhQR+icvtCs86KHkcik2EouB+oGBMex69atfbe+mLjvqUAxy8g9msz7WC8UvuAC3Z+6TRujU5Y7C7RsFov0ICxDO7dnPpev2ZBy4Ttd+hDeUuOw3E3dGzO/CgADuAYgvM+1nCgZ/CtNhyYzXSolrMQ3XZ6UTn00QhOWMNe8ULCuFuK0AOEjb6WPcA+Nj7IOdvwvXNGPJxaYhvsnWNmTDpcEyz8VyDbt1ltL64/Y7db7+BbfosI5D9UGM7fH7Tzk0fuW4vjho6Lp4nJjllY87LN7z1evjCu26u21QG6QU79qh4Thukdb9YZc+Kf5W9MWPLrk2nvfEI2PFMjG7MFMDsDOMUc/o96JfgTk7cMPOxfHf37o5vnbpFfH6Fz8innT0clnabU/rw+q3A6o6glwDEDdiWkQS83q7dM6fkKhDOkSd2vk/vT0+edENINUhIqJSuwI/e+HG+N3HHxwvePzRsWahjH9kNER0OpAxVhhEFJIAkLycd9UfGJ+Uq5Mm/ChLoNrOqve7/1J/gCU4LPCoO/xpL7Qr6pZnlnJtAo6EALDfBLNf7AQcLl/U/dCWsQW55JJLsi0hHWJLQJwS3NbZyFYuMZrORm3YfEIbhV7COHyJe0/ct8T8ZphGRDTKQCPCXDDgcqEQjn3HWGJRQFjjkQbWe+wiJA7h2cnHGjxfS3njG9+YZpXG14imRumXfo7jzoZnLmjgshWhzzJotmGjxNnwXu00P8ihNjkuW3w+pz00viguvmZj/O/1O+LQBSviUYd3xzMfvTKW9m6JLp2Rt6xjfTx2zeL4or65cbcqf6lG4zt07LbsZDVisnFmLH7nScdF//CGeODyg7WrT41DX/RBcaZtceKNKpNoUNczs+0qQ9TTR1fRqXX8G9dtibd94brolc7hKz+4Nk4+7NRYKQs+tuBCe9UgSbFZsTCHaiTOelenNDik48Yk9nfNx3y7J45ZqJ2B0ghcdpu091rJ+P++tV4GQdvjNU9/YDxIO/+6teEIrQKwt77wi6QG0HEDrl86c4y/aFOI/d5UwzMbxxgMMB8H3E7zofjBn/bJV3ax8ANe9rKX5fkV2ITQpkiP8qENc5QY7RszdbbCk6YtEGlXWBgy7cAWgQ7C23D9DP6ynfIMQAdAWoCfcZ3ffDHJz5TM3wyZmQ9moTDoSZlrwTiM1MSDmckctszsTPIoT2bo4WBqNt60AlQO8zgqkD3QzOWc4VbiE8Z5cTysvPga76c+9andUDD/O/3009Pvta99be1UIhf0boEneeBjGB0awiraxcYmmx7NoSuat197+4boXDAWV2+7M1719KPjyKVMf0Zih8x2UbgdtHBBHKPz9PQFzhjQctkWbZphs06XcK3buiNOOrg7nqxjtXpHN1YlCk3Wq+MzjI8UsPsI1JhESV06VOQBi7vi9U87KN793Su1WecBOj6Lsb1HUxSW3zTyMJrRoYj5GXTpNGhvw6rnzTslwmvU7+wdik3D6+OPnvSgeObD1sgOYTS+q23G/ySl5QPFEF+9Zjhuuv3C+KuXPjpOOlJbaTUN6NU0ILsWTVH2FFA/tEva1Oc///k8PIa2xqYw6pxpXnlcd5mumd4dR6O6Bgftll2C73znO/NsR5iVI95f85rX1AzCYHy26rKDFTqmAjoGDsCx9SFtm23oXGzNdadiPG7HPPve9Np12MncSZmfgiQjiDhspMHcFcZmfsMzCjFGbr5uwiiJSWwz4Es6VAo4IRCivekGsYnCckZwuSwCER6GJH3EONJvJ5OmyXFy1JInZp583ZedXTQKf6GH9+zcoiemUgDTlg+t/OTIqzEOTtFhF6zpV8TgPT1jMXDkqui+fJes3ObrKzsLxQja1Sdt/qhG3PxOnvCP7Nwcxw30xEIdxjEi29uxMSnd9H6zGHJUJ/D2yq6+c4wz+DUiZ+fP3Lc6ClR/9chIXXvYnWjKYlzr9ofr3MBXPVun2j720FizXGv3WsIblwJRaDXyT4wuoh00HSlJ0LFoO/TgiDYGVWJgYW/cpI7/Nx+0Kl70mOPiWHVWY9rUc9ipR+qU33nxrnOuiYMXHhY/XDcWX/zhjXHU6pP0NWB1IIgmacW3O10zeXL9Um8oaTHvpo16MKIdc9EGYWCmltwj/lPftE9vEgNXszqnLTJVZFeowe3Ez6TDYR8wMO3VbdbtmnQZNHEtYbLZqB7oQDj9CkkAIDztE54DPztRMWZiUIQuBsmBgYH0c3nU4/RzU+aHSBJhH/Qb3vCG+MQnPuE4TV16KBjWhxNAKERdfvnlOT+iFwMvAG6IBWDqjRs3ZgGlxyQ/7OKjtwU3MFUGJ0GVtEBfuQe6WfhppUMDkqLs/2/vTeAsL6q779P7NvswCzMDdAMDCAMIqChBGQeNkfj6JMa48MZkAmjUT4yviZE3xk/QxCyfqHlco8bog1vkjY/6iCuLiigSNLggsgkzLMMya89Md0+vt+/7+9btX0/N5Xb37XUG6NP9v/+t6lT9q+qcOnXq1CnG+5BPsU6bYdbsi1PWLYtTWnbEYzKQ+e/bd8t67qQ4pq1ZPfFuhdGSXCkFzzllKE44fpnu8dIrSuRzRZQlgpa4rR63Qco9zGVwFJqep/5f0gZdtNIeH+S1Vmmx5+5KEenKJaq7wW5ZDWpdvZJD214asjDdVsKVtArKDzPwXTgSVONtXiIGtPNAnHGMXJG1yp/g0B6tLtR6Aa1FeNFpK+SIpCeuuGYgjl+9LK6+9YG46OmrYsXTGrQKEQlCMxgyX5pJyOsJ0R6wiXaldGhHMAikUg7uTfRuq44HboiYTgJdEatNkXjZOxLlYR6eNHFqg++9cqBnRyKGYYCzXcQKeMhAHnhPWl/5yleS01xWDfIeumGG6p3vfGd84hOfSPEq/bCsGSW1v6VSmDGJ34ERzSF8luLyoQYyAoCcDOUfzlCAjMP9zNXwxEM4Ey1x0a6yjfbVV1+dwuMx1wo9CoQCBA/iEBXJWImNGACnm26m8ePKdv6pjPx7uJ4SiF6KmObqr7ZGyi71nnR0NfLGe+LShXHh0xbEFd94KJru6oqVR9XHxResiXWaTB+W482mht54+YVnJA15sSAdhDz01isfzI23iehbRIAifzUcrXxTGoj60GfJWQjMAMGffJcY7Vj5Z95dvEmivWz7pVAsyrwWZpW87mqvvloNU1LnLNwJUs8vRZR0D/vkFkwGCJJmZGfQNhRrj2rSeF6KQpkmD0gR2IgL6dqueMbJK+Ok794liaYlHu6WEdAueQ3W1mPsG5AYlnGPlclpPM/bGmjyOs7RQmi8o625vrnPGUkeHry4j0NK4DrXHRCHZ7RjOk06FqRkpAuIlmt0AEgd0MdEgNcedAUG8DMVjWtydhUin2YKXNOhIg0wlIVWuB/rWyYkfidKxiF+r2338/HOKDIQ6VlggU8xAx9Ahjo6OuKf//mfk5MPuC8iC9yXd3BHXyPGuSIoWH+Mz8Y72bNxOj++Jw2uq2kI46UJYabekvX5oiJ89NWJwBbLW85Fz10T9/bujG/e1hUfuOnB6O7rjT/4jWPjuJXquYt7ok0ecutk8I4bLsphCEcfmvLrk9cczazJDFYpM/UmZkA5IEVD/NCSTiOddbobySLXOUgHIeudBgIXezTvDh7NyNAbi9HUSIIrymuPXuofRqJGDaeQlDGI7mE3XoUWybxYayBaD8Qyif8tGtagI4D5iIWJ/RRjxYK6WK/NPH7eraa25Ki487F+uRGri6O1GnBYeBBqZhrcLvgO6hLws7yueeZ3XCO1OrzbQgpQ9kNYwtEhcW2m4Tg8gyAZy7N3JOI97ZtnEDwzSzxjOIKOjNkJziwhZ1jLEBhmgZ7s9a9//eg+kc4GEgOdcfkOwzAJpiwBt2GunS+uc5iQ+BEdcHdkEYME+GicZcBVGG/QM5MhemYKECKGYOF+MABEa4/fTVDOBGEQmSYCChRwfO7H+qixcBHH8YjrinZB8YyDvAJUqvNNPKc9Fv7y58kWDtpRPw1BiJxUE7Kk00KZE5cMx9tfcmqcdfTO+NIt++N/3rQztuzYFy8/f1U8e/1SecihNxLTkLOPIQ0HmOtW84zlYgKiU9G9nIAMLtZyXzFJ+b5rHu4S4XWppyZVrQvARl6GOiyOgXA5YA1pSJAyqgasvOCJFz8CNWz3Hc0aBNTFrr1D0aVFRqu11HdBjXb4EZGSKIwMHwO9A/VyAkqPL/mDVUfyKdjMXL3yWhCDax6SJIH5sfC1yi5hwWJJEfulSFR72dsrs+CCTIf1DbXyXYjjjpkC1y/1RN1BUB5aOg3qmnCA24/veUZcP+c+B567Q+La6dFG8ji+Nl4kCw4AehgLYBDON50tEoXzT77AR/4Z9l5xxRXJjRgzFCxLh6mgB0DpzlJ1mI6V4s5PebpjljwRSIjxDdp1tN5kCMLmY2EAFAQHyggyZ6IpT4R7cBGmEriQ8nflGZ7oPo870TXpwYXBSZ6dLwoezkshoshES4z/PrYBJ8x431A5TU+0udct9ULQImPrY+T+6g/OOzqedsyq+Mx198YXbt8e/33vDs2Lr4+zT1oXe3c9Ik5+VHRqZ1719Upfc+tq0JBhj4j1pjsfjpt++VhsOOX4eL4s7FZqrX8iKBXzkKSEOukIkj6ABNMBIwL4Vd4g+nRNQ5aln+wHfv7wcHzkqtvj9l2FeMNvrZVH4KPFADQuT0MMZgCa5VS0qA06+2KlCLtGxkVrJYoUNO3XL4quE0Op1zm5KmeAIBFFPjzkTlweipTWIg1tGmX5NySmo0JNuZnJH+qJXhWxlx16GUoy38+wk7YLQRhMTPm924KfVTq7LXL29XjheFepjTuOcUBHVuxB+OXgcLRDFIn474fYkRQA2i402tHRkb51ovY6JvGDjMQgEnp1CnAsIBETlONxT3xn2OdKOMZ7Vyn8VJ/l6cC0ADgmSk3ELPyrQfB2U877f/u3f0sOF7ECoyxmDFQ2A+rNGSefd+yi6HjZhnj+yXu0Fv6xeN+Xfyl/+z+PuO+R+Lu3/6622F6sThbb+Lp4RB3uoHqIAWnlrpORzyduFhHJ0cb7X1WM1zxnrVxry99/IjOIW5YBCpdcaTN1p/QQ20t29OgK1JdD1Iz9ddevcf6PfrUtvvyzpjhu9YL42g2PxMZT1mrfPyz7ehW1X8q8hfHArp60LmF5U2M8pO2+zpAd/8plmsMflmdcEbzs7HROE3mpuPA7UK90m9UmmqTTwHy3ICYCK0TlOFPgNscs0qWXXprQsgcjgDcm/O4xVodwEMnRKbkdULfjEWhCMo2fvO2NhQY6cjh/i++Jk+ePsHRcSNUcgO0HuK6mrY5L/CAhcRJyxpyZPHM883PHyTPqZ5wPJ/gbEK/wzcf0I9MlX/va1w7JFo0C0Qqmd/vttyc/6QTIv/GQCFO8KY2zpcDTJpcntjXFqmevjHO0m+5Lzl+ibbglIrY8M047/hh57t2p5TsiGlX2cH1LHBBRN6pnP+uENbHivv0y9lscn7pmaxwvMf3ck9dIv9ATLVIssuEnDjqQsSFFpuoSiBA1iFFj0thcc3roEhrqVsTDu5vi5rv3aRi2NAb298rcuCMWL5S1kSz+CgrHApyimMmju3tir4i3rXmRtgcbirPX1sba5h4xnt3Rr3CDtW1p7N8oYmcJ7/4+tSEp/LqkE2giLZSR2A2o3bCGf6bA9QMjBxgzo3yGEJDmPv7xj6eDd9h4IBUwvcfQljovb7OEM7i9+342zkgd4+XBafo7ac98G/cc3AN+77PjlZ/HJX4i0+DIEOeJkOXIJxM2jzfZaxcWZw7SddomdnA6HNfMXqDHMDCEYZ4XsZ/CRF/BeBHCBzDdnA1oLGrqDy+3mnLrk8a9Voth2pfXxbHLJfJpLUAThFG7Vz71JSZrv7zBA1KyyZpuh7TsjOdfcPb6uPW+e+KbWwblcHNh/MP/vjXe+Ptnx3POOFpjc23yKU287NFE+KpD/HRp2CD1lMbmMjWW191aKeXqtEtwl4YQj+6qi6//4K64SaLFCu29t2TpgXjeM0+No5pkXaiyCBGvBnbaLqw2tm7bKxNjecTRHgNaaxzP2HBSNC9cqmk+WRqmxULMCGhaTHqLPeJi92kb74YWTbv19MWylRouaijA3oWlmYqZK1nXf3t7e0LKWBgFGONtbDp4j1gN82f6mQNgqu5973tfClupzdCeaBeTpYGEfJI/brs+59HzZ3wL+cmh/D5/V+l6XOJ3hDxRPzsSzhSAKysfq0G45BmRzpyRsNwzW/Gv//qvafoEombMBLHzHkMfryng++gd2DCEIQ/pEGZmQYopKfD6tUafBTislKuXhr9WBJSm3USog7VLohftWI+IeJHG3oPaZ76zS3P/coYpK8H/+wUnxz1X/UwONBtiV/3qeI98A/yRFHIbjm6NFdqVt62hRjb4UsgzSyAvQUpCuOU5R/N5B8Rbtu7cFzffsTV+csf+eGDvoPQQknbu74zXv0ArDY+SMnBolzz30AGoZ5HTjj09dbFVHntaGhbL8rAnLljbFo/21MR//Gib5vIb45naTWhRUcxBhL+3uDR+tmV73LtXm5Bq9aEsmWLFkgWSMpAg6LGqan5VFzl1Tj3Rm3/yk59Mvbx95BsJTAAGwBliQWT+3Oc+l+bSrSknLHXtnpg2RNuZ+fp3riZ/ngmanNnSn/w3TDsGFUiFQ7iYaGJPbY7OFGP5ziUQOiI9RM9RDq94xSvS/u2M8dvVg6AkcqOaLGctx11+j9g/BGEh0qunxn1VfZpYl8JOTEETZ+r567VZ58I4cfUi9ZjSGEtZvLdzr/zirdJqugNx2trF8YbfbI9LPnlbrFq2RvEXxQevukuONzWdpnUBS+Qrb5mW2R6zhlkaaedlmTckT8CYbGyRE86bHuyO3b2FOLZtcewe2C+F0d54xRmL4uXnnhRLxJQKYhKsG0BCGa5fHtu6huO+ThnxaPuuh8WQnn3s4vjF3dviqmvvjVjXGte84ax49vHHasHQYHz95vvjI7LtX98mqapbswa7t2vl4ImaXZA1o4YueOlNC5/KC2Ya97QFiHvz5s3JjgRxn3lv7FWuvfbaNM+eo/ciINoFYAKH8GlP2OazSQc2KegLyomO8I7Du/L3eVpH2vURTfwuVM5jFSxKOnbcoXLZpSWHf/qnf0qVnRtDwOmZJnn3u9+djCVQktisEyUQU5cMAyxJ0JgACN/5ydOYznVDYVBKMDzyYAyksbVgSGvmk2ZdvSTbd9UPdclMdmG0L5JzTPXui7WrRlcnTi/Vc9KjD++O55+6JD62+bT47A+3xXe29Urk1+hATOCXu6VpVw03SAfY9fO9KPgFUlqi+NMUYG1NY6xs1tRdQ5csBnvjZeeujvNP0xbe6s3Xtkg7X9D24DWtIn5NeWrzEOka48HOA3F/b602C5WVn5R3p8tWv1VDlB+teSy6GpfG13+6L/YMtMWNd2yLT/2sU4S/NLpE+Ctl2fiPLz8lTtRS3xjemdJn6nA2gd6dg+20mLF561vfmsx6GQ7QXjjTAbD8F+mO+qXeaWtIjx/4wAdGl3tjj+Jt4dwefX4iEXxe3nNO/CYgCqz82oXJmcMV4bAQIs98ZuFQvvEhYjzzoohpjOGRAOD8ED9AXPAyfYf1E0ZLSAFMq5T36oQDSNuV63N6MQM/JUs80SJUydRXAqU7YksvGV/PlW8xiYZhzYlLXN6vTTaa1ZMW5TKrKN93RW2S0VLbGS86c1GcetzJmiDoiq0ypHlgx0DsUC/9sJRzW3dhvtoSnUxWqGwg/GZt8NEqC7wN2szzeacdHc84fkWsX7NUOwNJISf//fUifJx9sOb/gHQCteql+7Vc96Fte6Jb93LVr+mBA3HMcm2Ism55XP3DzrilszW+fevu+NBNGgKIyR6ncf7tMmR56ZrBeMNvnxNnarVis3wPDvJ9kmzwUpw+MH339H+oH+rR9eR2xD32JB0dHek4//zz0w7RzPQgziPdWawnDuFpG+ylR2dAp4BFHdaqGK0BDodCESZCm8QTNPP4tD/aGuC8pJsj7GdOiT+vDK4NvqagHIZKRJTHHJKemNVWiHPuiYlr02FMKFkfwDvmOqlU3sEM8ukPp8cZ5sBhMF7y4MPvZuusZqZeX9SdoCRhlK71DB7A2BypQPPpTVou26UpNhR2BfW0QwMLZf2nNepNTOlp1xkxj/Ur6uKk1cdErzz99g3UxH65xtreo4UtnfulI2BvQsyE5Zl4QYtmC2SCKn3AUW21sWrBsPzsdWkR30PauVeMV7MBQ1IIKgP6l4TBlmFa+9+5rz9+fNcO7RG4Wpt+1sTKhgHt1Dscxy0txFtffZ7ceT8SP7xrb6yR6LFv/844TeP8175oXTxvw5o4YbmIffhR+BoUkSwe00eWPnjGfnNiy+vRbcwJ0aY4DK5/7glLp8AsANIkHQhgYzTeQ9zoh1jdx+49wJvf/OZgP0rwgi/PSwpwhP3MKfH72114+T3XriAIn7l3VtuxkSbAcl7G4xQ6nBVApANwqpAD+57D3dlGCa5NRZgTE87pcHYFlZ8dhvB+x/VcAnxBo2N58ZG0o/E/23chpv/yob3x6f/zcznxaIrFR7VKJ9CmeXRs5WAge7WqTgSrKbcBTacdkGSAYq1OXnSatXVWnVYFtsgj8CJNLTap9utldNMrfwAhrX+DdtNhNpApQaYJ8dUHg6rX+zrheHB7Z1wjh6Pty+tjn3q8s5YUpFeol+++znjOcY1xzCs3xOfzY2oAAEAASURBVE/u2yMvvt1x1MLGOFP7cJ0gm/+2Bnn+lQPPopgCeo5a5Usdv4ApwNkpUdet69F16PucOB3WOeEeHQBbaLPbE2a4DA25zgF9AYSPRR1tlmEC9gVIB+U483hHyvWsE78Lm8L3wccz3YKNM9MwiOouLItMLG+E8BHPMWH89Kc/nZZoMmZ3RVLorF7C+wrPELvgzohqiPKIcuboeT5gBL4nL8bHtfORP+P54QGW0PRIFG+OE1e1xNV39svN15LYrtHA+28VwfbLsotdeTVV2KRtvfrhicz+QMGo9UVcDPH1gRpB6EK1LT2g9taT6e4CmV831mob7pZYvVyeg1fLUGdRS5IGlmqFYZtwgquppSEWiim0aE7/wX33x7AkigYNBRZLGXjheedEbdPS6FFai4b3xEmtPbH2rGXalFPTa1p41KJhy2BBzju0HXmtliYPi6g05igxGLEV7lIe03nmflyHCTvfLsjrO3/ua+qbMA5Hu6EdMQ3oziN/Tzyb3rLDs4HhBWA8fj7RmfDOA2Hnov1Nm/hzDkqmfU/mffAcomZ8RI/OWBwruvvvvz+ZW6JwwXVSDhAuANcFKGi4K+CC4R7RjD3XKDy/T4H0wzMTuuP4XZ43PyO8KxoNMZZiGzduTEMO8k+cXIJwvNk7a0GTXHYva9gfv3v+utjZ/Uh89hfaNLSpLlYtWiyibIxmbOhlSFOj3pR9/Yoo85AA1LWipZd0rmelKbD0zXrLvn49+p7ugWI88qCOe+VsU+61pUXU22K0S9JYqOJv1hLyNu0IfLS8/KxYtjQelZb/xFUr5LevKZ515tmx40BXvOdz39Vee6vjpWcvj+PbOqNNvvwb5eq7RopMPPEWuVb3XqNZA2pUWSGJlC9dzSi4/mgHbMX97W9/OynyaB95BzNWom4jPoMPoM7dLrj3e5gDFoQoj0mTXagZZpoGCDseGD9ntyvjdidIfJ45rPFxz3OH9/PJnLV/5MgXTibWSFg+0h9K5sszgs0x0yQoRJhv5bj++usfl1J7e3v84Ac/SAuE+GgKkmWLuEpizTTiPWMrplrKwYXA8/xTyvNSHq/SvXF985vfDJZSAoh7zAN3dHQkBpYzmDQeVi/b+avro7DlW1rcImWjxrTeI08kiW5tiiBGpEU7GNbWRaeWycqnf/fSuGNrV/zk9ge0KUZ/bDlQE7/qxt6XHp0Vg7LCQ/znkOjfqDpp1FRhvQb6fXIW0q3OH9OeXnGEAQ0HGIAv0nTAYq0xaG1uSf4BVIjamKOkixiWopHWQbztEitWy1ZgoTjCsBiMvOvHrx6V1l7z+XLpE//zsrVxsRYltcrKr0bGRPjoS7MEGj7gvixtG6784VxUWwCm93CBkvhfuYjSJqa8ShwDk2Hxp0ENIdb9Riw768W6k5MUTZW6rk2gTPd6E1ai424LO/h8aSzPZwJor3RQ5AFlX84oeOa8VUqL9uY8I+neIGtT8sjW3TAWt0dwOCxn0vB5PPyV0syfTannJ2GATHAYULQ9+uijaToFTSkieb6HOeEoIMxmmUpBgcdCCyqLIYCBAiUc66Hxj8bQAAMM0i3/2Pw+vzauSmfn3+8cjzNKHLteYq6f3p9eBOJ3OMeb3TPEI/NNidQarcvRR0+s02zgmg0L5fzjFM3Ni+nIeg4lnuha2nf0AuolENc5i1Iw6W0QI2XVX0GMenBA43gRcr86+K7uvujUsa1TswE7uuV+uzd2y1R3l+b8JaPLvEAGUiK6GukZWqQ/OLFFGn8JXgX5FqhTnXf1yTZAVn1tsu+/U9tu7dy9X9OLa8RAtJWYGA9ETg7SXgM6D6UM0W5gicpcImjIecrcUXEPBdeP12YwZIQw//Zv/zZp92EIldrQoViqv3PHx+I38PogH87LeNiIT2fCUl7PIhCeRXR0dh5CGEfe8fDM6fl9NWk6LOdJEb8LzokwbqdnR/FB737NNdeMEo4T4QOYSsF0lo+FkCF8mIThLW95S1p1xb1xExbGgMIOcEGnmyn+lOffaPycMwBTAphBADwE8fv0cA5+auT1lwFyoSCJAhlAC2JqNLZeqoE7vXVR8/R1yT8gtKTeVj1yjXrcNI8vooL4ITbch9XTEycGITwiaKz1CswAiHN0HhgWMddGj9QIu2U92DNQiJ1dPRoa4ExVz/bs05ShjIG0Dn+XsrRNEoeW8InjyERwn7bhah2Mc9dviAXy4AMnYrUgkgduvwfkH2BIaePDUPKE8suhIZryypOZBNcjbQzAVRftE3CdppsZ+qGt0i7prAC3Xc7Oy3hJuT2RT4Bpa5gVdISjWmjH7R6ceLu6X0NllJF0hjAdGycRv5o0CWeYFPETCcLF1TFKOLTsX//619OKOCNEbGGRBJmGOVDoFA6ExL0BUf73fu/30ngdMYepFTKfSxKEdQHx8S5c46h0JrwLwdeccymFAmQKkUaCcQeSCMwJ/Dy75JJL0lQhRh3MOOC7ABxzDYjLpFqQhh4ihmDII+vmVKjKk1bZJQKCiPSNyuPBMqIcaJA6UuyDjQMBmkPmNmm+f+liXS3RIU38MMxEvfKQvAwPiUkM6sBZZ7es+Q7IxqBLXoS3S0K458EdsWtPb7SvklFQe2ucfVxDtAxqVZ8kFZE2OYRvpZS1lqeUN57BkHSfXvF6FoCZnssvvzxZ9CFBQkgs6aVN5u0rr1PeAZQfzw+W48EM8ix/znWl3jgPczD246+cF68dsSnya17zmtQmiUG+6HyYusbrlReh4cwDH4W0TRTfp512WhoyjJX3x6dO/eQlUClE9oygV111VVx88cXZ00gFSyGwjpozB/Pt5eazeMrduHFjMrpBKw/3ssYUBkFhVFtwh2Rg5Ib8cYCDQuMwZ4S4vUafMSBDFAAHiTQU54P4zj8KSq/wI74lgJHklBZKwNka8zuVmTyXmMRBjGro3FBm6WHpl5uS1KBXUlqgZlXN6KGkC7GMAa3o69NCoX7VWaOUg62yDqwb0rBNkkKNpBEciGCAxP5/MLCpwmTH/NQd7Yj6Y107bZA2RQ/ptpW3L8Kb6Mkj8XKgoyMeh9tVHj8PO5VrcDoPWKqiD6Md4qcSuxbyxnvyhRUrU9cQPRKAJRqnC2N417veNbo6sZp8VkX8/nAWxaA5Zckka6Ihbt5BYFxbM+8M4WcfxRlLKxHfWVNNL+uM+eN8z9nXxjGZswuSOK5IxvBIKthoY4BhgPmQPlIAUzUUtsW3PH7eOMrz98Qjfn99pTOEP0L8I68ZnbNXX2kjT/Wa6tWRRWAZMIciVomabVATkPUhKsAmhUee0ApFuSqrRcsvz8VThckSv+vK7RWiBfz88fVXIj6HYZk3bRuplDE4UgPgdmEGkh7OwA/5dF7JG8yGM50MaXLNe9oyfiYuuuii1E4Jx3O+C8maA70UBkkb1bka50RZnJTYT2IuSAjdY2InwpiFxJl+w6SWQiw3nXWmnUFXiO+Na6pn8FFJcH6GJvg5YxUfgI0A4yiGHxQoFQ1jYsgBEBcgLxQ+38ozwvLsyQ1836HfWMs4XTMHuPtilqAgx6GUA1OFNQxBpItA51Aj2/9hWRnWyJUXzKFWuom09l/DBwkDcwbUVcqf6h8w0bpeK2WEMHRe2IrkfiZ///d/Py37pk3bq47b/nj4KqUx3jO3MXBC9Nz7Wd7msGLFghBDohwYpnrYMNl8VUX8Rkoi//iP/5g0pxA+IsimTZvSHD09p4k9d5VERv0R4PGRfwDXTqP8+WTvSYuKxAMPrpwAxD4KFtEdQkZs4iDPMAbe+53z4Ubke58nm58ncniWFmM6jJNQJhw5api7F+HrR3P4mrYTudfDEPRWfCLJBHgQKsr1GJtuskhproA6yuvJTDt/Vp4XOgoYAG0GYOzMFDUzPhz4/7/00ktTh2ZzYDOV6UoC5It2SVtzHivh5D1tFGtC8kKnhZTC4iSUg6w+ZNFSPmNQ/p2V7qsS+/OIiBxo9ykgbOPJVCVi9wf5o3Ics3Ht9JhetMEQSh6ImjzA3b0W4CUveUn84R/+YRrCEAaA21Yq+PHy+jixXwYt9HQzM88/Xsoz+Y6u+dAev4SdZyKm1JeL0NO1wo4QOhp75utZetyg4YBcBUD+uhcxiUEgLVAOaPenCpMV+yebDm0GQoYAr7zyyjSt3NHRkcRvhou0ay/5xdIPnRVLxBkOEBeYq/Zd/m1Ir+it6MTIC/kunxosj1N+X1XP70gkQkGRUA4QjgsDbkuBzFahOB2n73R8tsYUqQRDIcJbOYIWlQrESQf6BwBm5jwb51TPSbsNLT3hIM+0GUFpvM80XZpFEGkz9tdTMYIS4cMQ2EsAox6u2cYbwx7U/GnIoOfJX+Aclwd1zlFNOyQMYekQ0AmhAAYYItKuUfhCVBh6caB0u+yyy5LBmYeLc/V55NNDAjozOl4Ogzsw3090nlTP78SNlHt6S0M1he2wkz2TFmAiL4/Pe96xwwlrt3P4i7/4i7TJJ+M3K3FyhmWck83/k6PnR8NN2ZrofdaTxBMgax3MbCiUWICel3p2mF1iDApIL13UmD+F0H29TB1RFk5nzJ96/pQd2piYjP6GBuX+a915JQs/zTowF+H6U6DHwUTthnZgokFKxNIOC893vOMdCRfSLRIAPS3EjkEOwPp+xuCzYT+QEhjjx9/j9k7egclKrcSZFPETIQdnIH82k9fg98fROwP2zMK0ImMcr9ojLGEQhZiORNnX3t6e1u4zl++hCeE4cqY15Twj0qrRd95xfQzf+y25y8IYRxUhMVhUYeqZMvq5iQhJJwobJzkYQAl85TOMoRKkz9eLEgOpFGLiZzCTWnkUVmFqNkFTeJIkBgbll/DYc2P5mTLvlaNQ3hmoVxgBkh5rSJhKRg8FQNg5gTisGYfvHRYmgHUqjl8AJAGm4ZB8kRZhBGjX2bMij5sCP0F+JiX2l3+TC678+UzdU6gmesZe2P+zhzpzogBLdxmr2YCD8GhmEcswF4bgEY8AmAj59ZEezvBPIgP9QCjwYxPMDCczw+gqE++hiTyexB//5NAYM7NUt5Q3evxS2TLg4Np5PljCJkAMsxifsyUW22m9/e1vT1NkiO4e4pFTwgNuw5x5RjuhzTE0xBwYV3AY1sAEsBswsM7EtiF+9kQ7T4v4Z/NjqQg4NbYFX/rSl9IiH+YygY6OjmTNhFEEmk8r7Vx5xMPS0PfEcSVzPfNwsBEminfbnPmEnmIYD5brwavKReD6vUGLYyB8CJf1JUzZYaX5pje9KS33pk2g5HP4cmxmAoSj44CBMAOAz3+YABp2iB6c6AOAsXCV4z7S7o8I4qeg8wL0PRrXf/iHf0hzm3BulkviXgnuTAUDHsNzbRyOnz8jzoyI+iA9BKB0HfMEf0ipzPRNKt6cA5SVt+vcdv20BabmIND3v//9aektHn03btyYRHcPAyrlM29HMAqYAJIANiHMcjHOB7fTrITjifDs4IBpjnILEZYfFCKFzHOuOQP0+jj0wHaZxUG8w77AShfm8bE0dHziQOAcVKDPXHv4QFin4TSJ5zxxPSkYaZUHRdGyVjkpZPOBqykBhgFjMdwLLrggESb+GGgzLCBjeSxz4awh+chHPpLcw3l+3W2ONpG3GfJB+6Hd8JxwMAGYiQm/mrweyWHmlPhNeD7nhEohc887A4UMt8X8lsrjwFvPv//7vyez3Fe96lWJC1MxJm7HrXSmEnP8xCEu1oDOS6V4Yz4jq6k3ouFQlIxI52E2SmCkmFW+I2N+6jITt1y3uNpC3EcTz1oORHQ09bQllHOI66973euSQxniOB55ztsGz3OgfQBuu46bh3miXU9L2z/Zj3XBuSDRyrJeHvt6NLOsBWDekh6ZMBQwyj3s8iFSxl6bNm2KY489NiVNOCCviPJKSwFGfly5nMGP919EQXoHegxWGdJIDIQbD592nlDQ4dhzx3eiKG1/Q1OLzFzVY+iHBTE101F1OxNP4TM2A7VaRaiVGjItxpW5Fo8Nai3BMc+Mo5K2X3WVESlthDZBD82irKuvvjop/yhCZoVob2j/LTkyhmftidtF3o6eCsU+p8TvAkV0//73v5/GYljkGdgNGI5Nj2zCo0LQ0lKxHs9Rwbx3z51X2rjEqoTAQxjOrO5Dp2BAgYhbb6ft52OdMXPVzHPsv+f7MXD3N6OpUfPO4Ncf69eZ56J/moeplIBKbmSqDyvDglYJ1mt5cZ/aQm3HubF0w2+Ky8KoD/bQtAvXL2I9wLJzzGJZFYdiGKaAMpgpY8buOJJpb28fjTdR+0lInyQ/s6bwMwFRGQA9LeIX6//ZTMPTdSjxqAREe5R4KPmoHFcieODkANdALuLn1+ll9kN4x+GxmQRn0rG5LysV0eLiKhwoj5MeVvhJ03kyaG9ZtkobVqySYcu+aMLYRe0RO3h9tJCVvr9C9PlHE5SATIVkNSirUklYbPop28HorVsYK446RowB5yV6p7o00BY4XO+cWRDDBp2Y5bKuH0C6RFfEak8UeEc6uD3ONGOaNeIno860z4j4iNYAojuae7SuGOwATM8wN094i/3pxcjPZD8ePBzEg5mAE+AZRhobN25Mm3ZC+AD6BYDw1aSlXMrpRVM0LTkhlpyyMXbddVM0DO6W3zx9z3Cf3kpZBBOY7/xTuU76R4wVf0DsFTiojUL66xbFspOfHU0rnqZ9CFrHrKO87pAGGFLiLQqN/Z/92Z+ljoa8YOrtfR3yOJPO5yxFoJ0C5C1vyzOV3IwSvwktzxwZd8HiPQegEjCY4DBR4rOMxTbWwhKuEj6eVwPENbHTAOgRyAfp8Q5gxRaiIFaB9AQQ/2TSFDb1PGIwdY3Rtu7UqGldHAd2PhQ1/Xs1PtXGmkpmmC2y52EKJaB2o1WFeC8alF/A+sZFsUg9ftsKWdRpAdWIryDhLTH0sRKgzql/pEe25GYVHCviGEqee+65ySiMNgG4nY6Fa66fkx+31dnI24yP+SloDts8k3kKF+LDQq/cAy/rk1G6wIFzwp9OZZihcGap5ne+853E/VmUgcaX5xRmeYE6XvUMQMtVReQ0QOzda9RDyfWtuJYE1OGRpax4vZyHqZUAQyYOGKiWFbNpKesp9COJSufEWJvGxE19loM7BD93W/B9eZvw88N5RjqGpqzzmqm8TKvnN2GTGYgbCzym4VhmCEFDbHBcFzic9rvf/W5aPMF8Kd5xcfpBgYOreqKr/PnOD3lh/M6afsw7DWh5WbnF9I8bRp6m81l1A5Ar6qK2pmDUmUaeMDo1UMkDskXH7TZC/8ExqfMxf66uBKTWFYkzuIK96pAkVaMtzNRgSm0F5co4xev6zOuY6xwcJn92JFw7z7feemtyX890NJIqfvvcPjn7ekp5ViJTBnGjosQnbbVeKGrcXtT2RpTs6KHFNQm3CK3i2Qnz3mH8bCpn8gFIkVPU1l4pH5IoihxiNkWN8YuaaUhhZiK9QWHq05FSHdZvQXfa7K4wPFAcLA7pOW/49vljKmVA+aVyVHkWh/tL5ZvKtVTulP/sQ6ntHpr/2U3VbVPKyKLWFozSE7RF2wYkDUw7E9Pq+c154J4spKHnZwkkHnJYV48EkINyOypy6wPTq5nivOAGFz7b0d4D7e3taQ6fIQW9Pkt6UfQ5H4SfDudU/6OORxILv/RAEk0Z5wurzuqr9Iyam4eplQB2EshWKk0hUDmn4b2GWOmZn/NuZuEQ4SChL6vF0Rmcafa8E2SbaUlWFyId4/sS4yUkWixeacMc02m/IJgywKHobTlz/Mu//Msol5I2v7h169aEm3eAw3HO46WX0/gxfikQi5s2bUp5IH3Z/Rel0Ev30vYWNbebUiFtSwnTSFYfpL5HPX1RvT59vPqndEgWUl8/pO/lKPX+nH19aC8yLxWMXR6U46D+hkfLltJUQY6U++T6/lIrBAGgO+pmpF60qUlxSEcpDL/0rKrbYk92dI9cI+9R2yOhiVe61DMe5zfpAQ9H/rivDjQ1XtSwdZSmZJ5c1FLlFBmJ2+2+OmyPDzVthZ9QJv4FB0JrjtEOnnzxJ16+q+kEjG7Kr8kD6bP5AauwGPPTw2PBB+CnD3fjLPd12CkndkhEfXv6/lIvz+46JfwKpN6hbmT3nDyKy4tnahD6LfUeB5+DoxSjXDIhvN+lnnDku0u4JHGUSTLgFJNLyHhXSoOyOijxHEw3YZFkVirLclylNEoWdCVT5oQ2lbsaYTpTB+6JOJNf4yMMUCe/f3wz6daywUjq1XlTCUoFoRwd8rLUGQuf0hg3PuaWSWKQP4ARDMzQqNErfa3so/oKum9EAAaX9j0c2Bd9ex+Nvn2PxlCfrvfvk/ShtygamXpUOTYtXKmdk5dHy5JV0bZEK/saFikEjkXAZ6+7Ci4FcCoP+TJUSUh/wbfLjJ1f5YG8yeupzo8Hyoe4rG9hihwbGSTX9vb2FNjvHx+z+ifTJv7xkqLCaUSzDS4I7AXwsILlHkBhYcGH6S4Mgfxwnk0QO5aJb2kIwlQmVoOYL8OU8C1oOwbyUCKQEsPgvrys/F28A7jnGzjbgs1hIHLw5Th4x5E/A4/DEv4gUR5aLmYaeXk5bI4P/DwHF0cJfC414JGH6WQcDutzHmbGrpl1EdEV5U5cORQB84t1KE9LMzQNcj8+3Ls99u24J3p3bIm9D/4yunbeIf9uO1WPvQpNuYhZQqtyU14jS0Pt/6NjmbY0XxGLVj8tFh17erSsXB+LV0l5XYeBmmYl5NAgmXir/deNODcoUt5iIDAghobgFVIdlYE6yMu/cqipP51R4qdi3Ri5ppHkDWXq2aw+Ji7FMemEU2JPgE03UyU0stksSHJoQiAd0scfHMzIwEwH7qFzYnGZEQefg9ddd10yesL9eUdHx2h5luNn7Pc9eZJhXIiUxQGUExNaYoyYtm7dGu3t7WnjURiQ8+D6Qmdz443flwec7WlMiUWcLSudNrj5LqZP0aGAD/0Ky63B4/Tza/RAt9xyS5qm2rjxAvlOPPoQ5lOe34Rkhn7UGhOhiQxTJ4tiBtdguBmv09RBQUS//YGfxo67b47eB74fLUMy+a1dpBlE7eCkfQjwHjSsXrvAzklqy4opctUBQxXKGkkNg9q7sB8Jp3ldLD/2WbFq/TNj2XFnij+siT52ThZt16f9C/RRycchMgj5KjGV8T7VbSMvo5mkpxklflc6H+RGlWd8vA+d6J3xjReuUhgXIPHmkvjZuhlrRlYhUmEoblhEdMkllyTC4xn5JX/O2ze+8Y3kSJJ7NpkEB8pKf5fD8x0sWsHBhAEFK1OneVjK3vlwOIZAl156aSJsmKLLhKWuWL8ZcFtN/sFhnOT105/+dPoGh+ObMM4inA/C830sqyVPWHICf/VXf5U84mADYpzEmS1gwANLqpexEMMwtiGrqVPPO7Q7dt3/y3jktmuj68Fr5X6trbShqbJCvvA9OKjrBjGJBvW+mGonv4UifclSwljKc+q/69mBWMZI2kp9aKBTVohHxcITfzuOPv3CWLL2TIWWUxnqWFFgQul7xRR0MeFnkxeXE4Hza/Dk9xMiqxBgRmVyVz5nKj99aIVEx3vkD+ZMY/Phj+UecYgzYXJwmByH8+JGnod3OHDZkMK4K+HP43JNfMIbj8U0Ni2FcHA0Qg9J7wy0t7enc14uzh/pMacLYI+OD0JWM5IvgPcA5cozr41gOAH853/+Z5IYXAZOgwUsAFIQz7CkRGpwurwDN8ulAfwdAhC1850e6IdhlfeKg6kBH/3oR9OsTnn5UiY4woTwwcm3s+cDEghp+3sSkln6qUF/oR2E2Zi0oKmC2rqBGNp/T9zzg/+IX33rn6Lv0f+KhS0S3+tF3KKEfhH3gMbpUgOKoGWhqXzJNjCd68U8mtTcmoRLlitpTUGdTI9rhvqEv6B9S4WgtbRxZuevvx53fe1v4rFb/kPbId+roUJvaA9UhVE6tFmF51TSxoz98a4jzuXXxOLZdGBGiX86GSFuKhidaRgc3NPYAZSJLMaZ6INdUOXnhKTsB/xOhzE0DdiN2Hkpi/K4W9IxHnCQTxo5QA8HA4CwWEeOkVM5OD7f6W/1duUMA8gfYQDS4ZqhzbXXXpue4agSIF0zivRAP4RH7AfQP3CPnbshT9MWmaQJYAhF+Bx49uIXy3GmAKUuzjIYYuU7LvPO+WStBgCzYbgAIN1gWutvTQ9n6acW8V69MsRcoyXBe7fdGrd97f2x5xefiSVNskJtgKF2iZQPSIw/EI2y1mwsqLfX43qN21HQ9cqmqE+7Iveqh+8e6tJmpfqWwn5tTXYgGmr6o0X40QcM1Wr/QukCWIjUKgViq94/+F/vjTu+9+Ho33NftIg5sEuyhA9RrcpCw4npke70C+2IIn4+h4bjxgMhorF/z3veE3/0R3+UxFJ6VZ6XN8ypFgXEREOEQBGd6SlNkBPhNFESjmsIle3B8O/uhUvggym88Y1vHLUxcDyfnQ6255gf841cb968OTEQ8AL+ZlYjklf2HvC4fOPGjaP4jQ9m4BkPP4Mg7bPAZc33e0sqp8E6DBiKwc+9Kwy4GesD9q3INeH8XegD8NHALAxSA3llZxkUoKRpnMSbCAjrY6Kw6T3h09bg8sBTty86t/4gfvktbXXV+atY1Mw2YyJ4mWLXykcACjk2HqkTs2APIrYfY7chyQFiCOrVB7QbchPi/Iti+WmviIXtF8RQ4zIxg6G0BbliaoigLeXFOGAerEcgduOCVdH54Pfitm99NAa2/1QMoDtlrZD2M5QUpzweTpiWkc9sZJyGDrHQ+7E54etf//pD9gRkCo8lwdg55w1tqnmhEeaGQYyxWXbMph95rzsWfho64j55xkcBRA4BQ/QQJ2IvewlgmOFhgXG58ZMH0mKcD1HTUxKXntWETzoOz8IUgN4aogIwBDGY+Bzezzn7Hdd+T/q4ugK4Bi/Lqy2BpBcjPyyEwiEGvT15BFizgf6BunF++VYMvvCag5QCo0DRCCNAAUh55HkZQT/mKQ9Lvg/em4Dcj3LP6JqJu/qor+uPzntvjPuu/3AsKnRreYCEdW0hljYb0WieXYeQ+ZMhNqK7xuPMCsiDgMKofIfqY9UJ58e6Z/x21C9Zr81IJBEN92gq8MF46LZvx557ronm2kYxEe3/qPUcEBR9eg1m3oPDsahxcfR13hp3Xr8/Ttn0umg++tnKV4uWKEuiE7OJxAjKv0FI5gCOqJ6fSoWIGCez9hpbZhx/0ODQ2gPMe9LruPKJw0FjG+ugQRLGZ1+Dgzho2AHG2qSNrQJhnEZ6WeHHeMgzvdmf//mfp1CMlSEm3I2/+93vTr04aZfj4944iMg9hAXjgfABiJGDd5zBQ5kAiOFYUTKliaRhACdAz42iESAeAH5LC06f537Ptd9TNgbCAqzJeOlLX+rH6fztb397dFck55O8AswaMOZHWmHYBuBQk3vCkq7LwPlOgfTDPXngzPAGCYOyJR5tABuCNHIWIfHJeiLClEg9pJ5X940i8u5tv4jbbvygiHJ31GuRFVHUYhQXQpdFZvojryPMQzI8U3JFWWv2CU/d0hPjuOe8LJpWPivqGlfKiLMpappWROvKM+PE51wci9Y9N2plD6Baiv4GzfULDSsO2bq9DUlAW5fXNzVH7967487v/Xv0d96r90paEkVaAKawpdG/ziP1xkkmQeRS72YPjijip8HQ67HX+Ic+9KFkJkwDp6LdEBlz5j2MGwhxPWYvP/OOcBxubBQp17yz+GoxF6mCBkb48cDvGc9+6lOfSko6en2YAcMItoBCs849YcGZA8848vz5GedKQFi2FwfwQsM3wCRhFsTJ06DM7KyCMgEY83NNvBzci/OcHhvwNmcOxzvKyiszkRCIB+OjR8+BfBAexo2+AyAu5YNi8zvf+U56Nl458z3k9aabbkou3FAy/umf/mlSGlKmEEgCyioVl5iFem8Iv16i+9C+e+KuGz8XDTLcaVYPW9T2QYjoeFliDp4ojNeplVLN8AScPJTLMOkDFrefGvUL2xW3KQ5svyce+NlVsf+R/xK99kdd27FxzGkXiNq1UEzsBb8D4GbbsgJThDqGSEv5bNWMwqDsB35985ejduAR1Tl5wV7gYOojH5EYR9ruTG9nE44Ysd8Nd8uWLUkpREXTy9NT8Qy48sor00pBNyw3DhoC4i+9CT0ECiUYBo0TUROpgUbqRk88Exy42JgBURrbacR2NgOpBpw+42pWC7KLMYowMxOMjUgXIiSdcuAZeSK/7m3Lw5TfQ1DYCjBlBxEhJWC9mIhB78BnQNl3++23p1vyCsDY+HaDn9OjAzBWw1h5suUmTM9h6JXPP//8Q77TuDdu3JjSpW6wUQe+8IUvpJWfeNUhHGVRXkbkkzQIi5ITfcVnPvOZhAOlasnjE+N0SUbQq/BCgPX1uhrYEfff+rUo7vpxLG5WmQxKWpS4jaKN8TxEirBfGUaeqyzrF0hBKu9BNQO9se226+LB266IJev+R2y48K3RfNRpsWDlCVG37NTo23NP1EkpCOsQ29PPsKb9VM76Lnw6MnuwUBLA3nu/Go+uOS7Wnvm7YgyLNXMAyVNnkgSSARD1RPrU0Vj506sZgMNG/G4YfENe6SYc5ogBJIFXvvKVaRiAIQvxTEw0dMRAxpD4aGOuuhIgdrJ5w0UXXZS2+KLBQkSkCy4ceUBM9PxsywQB8Dwnkkp4nW9wAWjU6VkR91nazDACJpQDcdzYGVOzIQnTehAUeYQI/T6PxzXPSYtenrE0YjTMzUzN+XV88kN4el+eAQwPCOcyTA9HnjN8QOcAEMYSRnqQ/YAP/QT5tsRA74w3ZZSJTp9v5fvb29vjXe96V6pD8suQCD0AadmBpssyS+ZxlzAAdBsf/vCH08zJH/zBxWo8Ijim8SAcfSLj7eaaPinaZLzzy6/G4qZ6OQHV/n4hox35BCyiaU8kCsGNR1wga4x6THeFeDg6o3ZoexzVcqIsAe+Ofdt/LeKX2/imxdG0VAY9e+6SAk95SH8lwoWo0R/ghgyTYlkPxEKV68M/+XIsWbMh2laepbJSPlI2JJ3qfYn0hUVDkgTjZbEUYsq/c0r8NAo3QjdUck5DBGjEHR0diXDw14/4CcHSQCAKwrlhER+lFDMBn/3sZ1N8el7CuSFxpldlCycOW9xt3rx51EswYcBLo8214OA3noS8wg/vyQ9KQsaxiLcQPibFEDLv3RM7LMRIHJ5j8YeBjIFe+Y//+I/TLeHyMuIhOHhGfjm7lwYf95yN3zg585y4gPPjONyDD4bCnD3GQxAsZW4loOP6TBkjHUH8ec8PI3YZkpbzy5khEHocpBEkMoC98DZKKsiHcU6D9+SRsKQFcyYcwwtmJthx+fTTN8h+4eka4lMeIhsNuJtE4AP92+LBX35XTEDPJAlo8g49nnp7Eb70ALUKV6epPN2kMTpplQNpE6ZBY39Iv6amNwYLfcqTpAG96+verii9UdfQGA0LtWX3sNy/y9dAsucX/lrpFPBBiDciphyHpAAcVNxmKRxrux+LR++8IdYvW6N8rRbOEQpnOpDZhjno9fneOSV+EnRDRBtOz0QDYy6cBshBzw8B4AiEBs07ACJ2w6DB5hp6NMc0WAxIysepKbJ+6N3pKd/2trelHueDH/xgGlKQJnh95trpOO54Z4gNvQSzEkzPATADCLkSAfPe+D0Nd9555426MPcQgHKqBH7u/FIWxucz6QIMmwAI1Mo2l6fDuj6IQ2/uqTziOK2EZOSHdHnHOgVMl8HHcAupifrKwWkQh2EcojpWfhgcMQQgHmI9RE1YhzcOp49HZfmKSMyJ9kJeSe/TGgb+3d//fbSpzQxL0848uuaJ4tEtP4l9D/0wljQsiCERHsq7omz4EccZaTO9x3JhTH3HBvIjDb6+VSUo4tYQREOHQY3nGe8XB6W8VI+uQFHbyFBJDEWMhsVdkH2Npg+ZyquTRKKASkvvpHcYUFk0Ny+InbdfHatPPCsWrl0sriRmiE6iFDPhIg44ZxMOra3ZTGkEN42VqSFER8arf/Inf5K4OWNWgIZCpdPr07CoaJ4RDyAc4iJzyACEj+dfCB+HjIwJ8dOGWIlBCT0yGmc8tTLtBhPAcg4X4fQixkvDrdQAUyJlP26UPpNHeihEdw5EW39HHrUcv63zfqRVWwBEAWGBj7DGzzuueUZ+OSgH7iuBn3uqjvBW/OXz+Tl+4pBn8HKMlX+nR/l7Q0yewfw8Q+H0eU4aHJQvuhXgF7/4RTqz4Ipxu8Pk+SGA84SegG3WOzo60hQjZb1CksqXNNTbrrUIAGRdK21+sWdnbL/rB9FUR3kxCCgt7oHo8bFQJ8VdjZyBFiQhDEspOC6BqVcP7cUA8dcMiHn0y0xZTKS2pkd0r7iaDdCcghSMzdo6XCsCRa+DmvZD6ViT7Pg1/5AYjHp7BUUGGa7vT0ft0K7YsVX6mKJmLzRY0XpfXUOOtHPqtXLd6sWMwZz2/FQmnB57c4DGjg05RIsW2I2EdxAA4IbEOxolyj9EagCnIRA+BMfuvSyGsUIpBdAPeOTVJ4mY9B6IpjAM0mX8yFAAacME53jjnZ0n93QQCkAejcfMpBIex4eAWJyDUQ95oTc1gMvhfI0yESUfZ3rofHrP8Tg7HmUNEJ8DcJ7TjX54zjOn4XDgqBSW50hZiP7ve9/70o7ISDnkh/opB+OnXOj9UarCvNGtbNq0aZTZlcfzPYyL8qV80OkwDLQp8vMl8i9Om6ygwJOQLXrZt/2h6JHZbmsDkpd67uJAEqLT92ncH/K2XFRvPCxTX3puFtiqpJUcB2VO+SlNlLAL16Xlu+rH1dnv1ZRep9gA6xI09Bo8oOBqo2IkrYtWa9y/XhGxQpXFoIYhzfWNwqN8qXwbhhuUD6GvlSmwVgUqdX13a+x44PZYc/qmaBFzg0dQRWm59cjHE4VczRY8vrZmK6UKeG2g4kZW3uDyhuhG94lPfCJVPj04vTkNiPEgDACgkQGOyzUzBijIIBbGsoicMA6Mheh9ENdT46DmM+CZ8ZA+1+QV/QG2ADANRFJmE0iXd4TjGAuMjzO9/EaNeTkMToN7rn1AAEx/2ichQwUYGGIwYfI0fY1YDZA3xH7GzmjXAfLqcs/TTC/H+PG3EY84KDdzc2Ge5UB4iBdwHvMViPnz8ri883c4n1gLYoCF0VRzc1NcetmfxHJJABD5sDz8Mgbv3nFn1A1qLC6PyqkW0hidOXOp07Sop9BQYgY1xZZE9rUiRsTxghRssAEs/AtiGP39A3H8s34rmhaskzg6GJ277o3u/ke0ar9V5TYYPbvvioG+HZL4VsSK48+N5WuOiUJPd3TtfSAeeeDm6Lr/Ts0tyH27pIRalUMBhoMkMtQkRqC2JEbZv+cn0bvrwWhZrLYr3UAxlZXKS9kozUaQn9kTzueU+KlgRDZ6YkRdpoeYt0UrDriy0012b8JiXhuCRUqA8Jn6oTeA8OmNiO+GCQ7S497v6DU+//nPJ0nDIir32Nx7LOy0fQYneCA+ejZEVi+fJQz5J0+MWwlX/g3Gw5n3AN/ja8I7DV+nQPrh3t+OfoSGj3ad76f8kHqslHOcSmfwAAxH8t7Z+fX7SnHHekYc4pM/x/eZOPn3ce93TtPvXRZ+7zNxDH4GI4F5bxSzpF7RtSghETl6ddFo7/7Yte0OWfVpDK6iLqg7LdRLYtR4nb9ST8+6AgngQyjw0AcwW9AtHOrtRZRDmn8vLFgfxzzjpbF8w/MkordF7YGd8ei9P5GYL5NgmEp9g4j2rtj1q+/FmqfrfbOWATd1RP3ilmhafWosP+EUrRi8Jh7+6f+RJR+SAoSP2lDDVjEjdJOwo9rhLuV3Syw7XusvtDYgSRLpS8g+baXUXlwOM32eU+KnEqlsxuCsDkN8RUOPhhjiMofPP9KNhGfe2ssa5SuuuCIxACsDwU/4HI+Jh+ccmKFedtllaUaho6Mj2eGzlJWlp3lDdh4cD6JBSfmXf/mX6RWMh6kn1rajfKqG+IlI3vL8OR03cN+XnyFc9CQQPZILgOhdDv5eRH5McAGeAYTPe+JK+UgBJ/GT4/A3OA+UXTk4jOvK+SkPV+ne3+GyHtJ6ehWnQGK0CKV77/Y4sGdLNEnkLu3vo/YgvjcoYkfsZsoNtX+vLKLblp0SDYvXauzfLOWcpuPUK9c3yux2cYecc5wVzSs7ZLcvO5HhPVrvf2P0PvzjaJOmPop9ilMj4b8hHvvZ1VHsliGQiL2waJnUA8eIwa6SnuCkWHtGYxzYtT06t9wYDUofvV+t5v0ZcpApiqa+fnF0br87Bnv3REPL2qSTEOpE8rDrEsuuVBIz82xOid+ERNY9P8w1PXPeiHhmoMJpIDAKCA1gOo2GDMECjkuD4qDR01PSQ6IDcKOBwdBwWG7LPHzqORQfCcS4EsKyH9JHbEbsxhSY4QOEjzadnog0KjX0HA3vyRuKSRbNoNBknIwk5Hd5eK6N0/lmqgwGwMo7TGxhQAB4AePhnjIljwDDC4DyID3AZZZupvlDejBg6ggFHuk5L+OhJh5lQZkwfGDTlPHikmfqkvIAanRPD4l2HXG9b/9j2kbhkagTo5QbRZnWNmiqTlN/otnSIppaOdhojFUbXhXrznhh1LbKJkE9Pwo9FHnY49fUMK+vIYTE9bqhB2PnnTfHQ7d8ScTObBPjddYMiPSV94bYH4/dc3U8ct81MdDUEE1tx8ji73dixfoXSnmvbeU7nhu7t35PaYj4oWrlFGbELANj/DoxhcHubTHQszsaWtcoj4mTKRzweMZZej5zv3NK/FS2Ob0bNs9yUbT803gP0LCY1ycsSjuUd4zlATdkwtIz/s7v/E6yeUcbjUgOweSSBcojAJwAPTrEUikfNDbwMycNrg5JC4S39EE+aPA0/rHi8618N4o9dho2YLnGEAggjL/D7/keDpcVU3HE51tsDOWwnF1WhOe9tx9zfL7bU5DG6zjEJxwHzzhMZDnuPI+E5R7dArMqDImQ6hgKwdxddsQHjJ9r4sF0UQIaWBGJoRDxnIc8f4TLnyd5BhoRcWnhbRQPyBBnWCsRGf+LkESrSqc0LMCz8mBhIFrXSFGqRTo1C2gDng0gvjTuzAwM6ziwIw7svj0evvM70XnfzVqNJ4lVvX4BxZ3CIEUkO4EGifKaSqzrk50IGv/9P48HZbi1dO2p0bjkxGhevEqWv9p1um+n4sDk1ZbV88OuyHYtjGdgZ+r59SK9p7Wz7KDU6nUzi5CzmllM5vGoXYmPf3PwCY3FQENEQejemjF6TmzgQ9TF4IfFLvSqLK3F+s9gfOBA4QcTAYhHgysHwpMGtgMYEwH0pjAdFteQ1jnnnHMIY6mEg7xh3PKxj30svbbOgKEPzyEEwjh/5Th4B/Ae4q1E+HkcfwvSAUuhYU4sOvJafIc1Xt9zJi+kg6QDw+IeIGx5eO5JC8WjPDcnU2J2xGWaFRyVvoc4fm6HJJQH34SZMroc0nWYlHj2k+cj9fsaT6cRvwirr2e/CCot7xGNKX0Rfl+9TL21lp8ptAFN1y1YcXzUtCGp9cb+x34W22//euy846ux646vyCLwi7Hl5k9qDf6H4rZr3xt77pOhkLrHgqi9X7YB2OIjZTRp+IAOoadPzjwXnxYdZ2xUnjX2r2+R3uAR7SSMfYVMi1pao75ZCsmi3ITAjFLPrnzpj54f2aHQL+8/vXRCquPU3EvMqlTjs0uec9rzZ3VY1WXeUKqJQPhKkgVxaUy8z8ENzOf8XX4NgTLFBtHDdDA9fuc735kW1JhY8vD5NbjJE7YNDBswmfUiGObcnadK+TOe/J3z6ngO47PDcmZYgDETEg5DE8+pO67DEtfXDKmwlcAAiZkMjK3QN0DkZgROCzwwZRsTtbe3J0aJTYHxOSxnwvPceMzEGKIxjMMuAY9EGAI5TB7/8dfKkx7iZiuZ8BFABA8bryMtvR2SaI3ZbPK7p562KAVeiIhrZAK8c8sPYuuP/1e0NbVKxO+CJKUkRCGo4YK2/26olw2C4sr8TDGkN1CXPFTbKsOhQvQM1Eu8/81Yv+Hk2CllYK9MiPFMXIhuzfmzelHMUs48o14+D4QzET49vzAmQtcvww22HadMsFPgHWbA5AMjpBSO0yzB7LKWGcg0BQNAQIwHPXeNkg1R3UA43tN7dHR0pF5o8+bNo95zaHhu9PRqjDUtujMOrtTY3FgRYSF2dAkQPqalrDyEKJwH59P54cwzJAeIAYICyDe9N8DUFQSQi9fpRdmP8+1v8H1ZsFGC83sIlm9kRgBdB+nk7/L4PCc8W5z99V//dVqliP0FNvu8c7w8DuH5Pr4DsJSF/UKl8iQMZUI8ACMnGCoMBz0GDIDFUAyPiF+pTFPE7IfmgX2MunwREGI4/RnMgEcyWJJ9fqOSa0i9tVaHioyLWpOP3X6DevO2ugYp8rTRav2SWFC/LNoal0Sz2lFyyDGooYCIr169eIuIWyZCsV/qhn65/jrpwkvjlPMujG1bfh333Xld0i00DUkR2NesVXuQFVaEmj6sk72BpvEAzUWl8X6i63QPM9TTNGwpET/6gNTiCZQuUtRZ+Tmie34q342OxotFIOvTuWauF1GWcawbNWEZc9LL0phQcNG7gofGRDjOXiVo4oc4aMQ0Sqfn0uYZRI5FIEY44GKhEFOFbvzOZ3lc48AG/vOf/3yyB6B3o7Fj7YaNAUCeKsU1kWAYw0wH3wKhkV/nNY+XX/ubwe+wlooIl6fp/GMBiYQDoC+ACGF2SACVwOlRLqyKRKKB8TL1apzl8UiXdwBSEHYLb3rTm5LRjxkpU5roAqiT8SAtihGqWlnroYZjtV794KKoH2osmfXWHUg9aH1B5CvmMCQia5ABTo1EfvUmilNywjEsrT6GPbUFiH5Qq/E0dBCB12i/xb6uh2KBxutDNa2xd1Dei9qfGeuftSkWLtFS5ltuiodv+6IYuLz6sfZf31UvTsRyXIDevl46hAGVd0nLD1MQg9L7Gqb85AYMqaAgwyMYC4uOcC4iVqs/EKRfrmYFyM0RC25cNF4IddOmTSmvaNvphd3T8JCwblQo+FCMQSw0KJ5D+DR+GjjmvQASAGCtOeF8EN5MhfQR90kfQsBQxgRFfNJ2Xrk3gItwGAUBpI9lG8DSYa4JM1ZcCAVmhx0Ei4ZY84BijWFI/r0JYdlPjjMndAfL3/sZeTHB2RwYTTzllBOtwzsPxMFaEzsKiJbnfDf4KoHj8Y449P7Wv/AM5k36eTielwOkgc4MAR+iqmMqTkTOwlrWy2NJl+bY1Isia+CkQ6xHVzAL5S8RqRSF6tmHaw9IRyDrPHn+GR7SQqelz4iznv82Gfq8LYYXnhRdWt237lmXxFkv+H9i4aL1cc+N34xHb/vfsaBhoUyGlZIIfVB5KTTIRVgjkp3S0GKfwoDwKpNIJSblUs/PnSQLDUtKTNntoJRD8jfbcEQTPx9PAzBg1Qa4Yb7jHe8YnQEwMdLgTLicabR+By6W/mIlSK+DBIBCzNaBTos4NGgON3pwwUg4wAc4fLoZ44f4jLUBwjPc2Lx5c/KfP0aU0bBcQAgAxAXQwzKGrybtFKGKH+NiCGKPSeQbYJjC97oMc3Qmbs4Ow6wHZQUYbx7H17wjDvXw3ve+N03N+h2SHUO4iaBE8vpFPa7xc+MC2YukJbtytKE8YbhzKIyI1KNkqKiy7gv17JjpIqrzLfXq8bt2b43e7gOx5swL4mkv/ot42m//TRx37ksS67jrh9dG593fisWK2iiJI03dy3i/nyXDmuevTwt95Mq7f08MyfCoVrYEidGoKSMNuEVj/FMnN18tLTLwScSOAZCGC4dmetbujmjid+NyI6JXwcgG8RLzXnolptoQTU2oDutzqkwRMdwVn4BM/9GLl7htxKtf/eokIdBgiUOjZyqPxUE33HBDGj4Qluc+UxuEdf7Gqh3nAVGdhS/cs4QXhZbtDxwmx2G89IbY/gNWqmEf4Llwh8vjTvfaRA9hAsxu0POTTz8rT4N3/g7yRl24fMvD5vfkn4PlvrgUp14YQjDEsu2E8ebxRq8hJuohkYt60FZttiFXWqjdWEgzqgQcjXDoBbMERZn5MqrHpVcU5JFHh/R20T8o918/el/s2vrjaFlxXCxec3YMy13XXTd9LPbc+2/RIj8BBU3zYTXIzAJDj6FhefRdsFoa/pJ016+px8Kg1gSgZ9B30tMngT51/UneiGKD6rOFzkHv9ZzlxknpNzJ0ODTHM3s3/qBqZtOaNLa84ik8GtRrX/vapBFmSojxPgopFHA0Hgx1aDQ50GCxiMOH/KWXljarQGzHNPbyyy9P3mfcCEmPxg5DYV07gIcelgHToAETB9elCuVqbCB9dA/0buBG1LfWPcdlDIT3tzJ/zhCF4YvT5xutq6gU33imcgafe37KGkLGNTe9P8q4vD7AnwhP9eIz8WEU5BspwqbHfFOlvJIG76gzhjUwYuKRluuk/DsOzYMIRgyg1Jdqrbzm1Yeb5bhE6/lLS3YP9rLleEr36HhY/ARzk/gv012wsdVWQ+1SreTbH/f88FOSImpi0arj4t7//kbs+/XVcsrJoqE+rRXAmEmsA7pl6bCOxcvaU28Ont4uOVMZ3CMffnL6KfEAwk89f4nOk3lx/VHHaUKANou0hJKQNkbfr0PXswlHNPHnH+4Gxoo8HH2g2GM6ivl6lFQsWsGXHb0IY0gaFnYBSAXMx2OAAtHTu0D4GJPQw5RrwZEmIHw00RArhjgMDbx4pzxP+T3XNFrn1dc0cNLhcBifD23MBwmK9xg1Ae4FuUb859s8pOHZTAB5hUBhqAAMChGeOXjrKcrz6nRN3EgqGELhzISwTNu97GUvS3jBD+Q4XD6cmXEx43FY4/c5j8szMHLUjfSSbTLXXbj66dGvoVWTxuhpccx4Q2fZBESNxvlF+RMQpqIUhCoFSeBSBGoBTpO+oVbz8Pff+EmZ7i6O7n0PR2udenUt9BmWeI6IoH2Y0/cVNLMQ9WvjqHWnawQiJiKRv/PhX8NK9M1iQogi0g0g1COpsP3X4NBgrJRHn/oWdD96r+/AD0Cy8Vfasw1PGOJ3QdDQWIiDJR86AMbQNFgaBr2klXkO7zNKPXQFED5TWDiigEkwhqfRgxcwgaJhB+wwNN1M8JM3ZoK6t+O58bsB88zvy9GauO15l/dIL4yPYXazCfjh27x5c1x55ZUpmUslLUH81TAb/AVC+PaxwDJr/A3Sk5tBlOc9Lw/CcO9nlA/lNHZZQSAif2n5FUza+aVx1Noz5CXnC1HTLOFfvS0NPCejg9epHxbhS1M/LFdoQlDAQIiBsIi1TpJAsuTTLEBhaF8M7N8TLVrQA42CtQ5NI2K6Zgro0/f19caqk14YC47G5FozBvu3RPejv5D0pPG8hgUwqZRb8qlvZJfgYm2L8qvwNdrcM00HjjAHJYKSsFxjIRQzCk8o4s+JiLlkenMaG5IAQCNloRAiMmEBxFAkBExJAXom9stDCoDw3djMAGAkV111VbJaozfCVJVxdjWNH1xu5KQPs2GaEDzc+xiL6Mmfw8AAEIEBen5EaUs1hHG+U4AZ+HHesbFnnT5DH9KF2ZDeWOB4vHc48g5QZjkQNof8nmsTu3EiSbj8XK6HxFe20OBbo8822UuWd8R2LZIZLGgpLdp/etmULMReUquVcCQq1oOF6RZt/LAYQVHTbsCw3HbheBO9wVC9Zn6EqqhpO7EKJad7WQ7CKYZ16pdhT9uaZ0f7ORfJnzpLpnHU8RMt8X1QIr/aIqSPhJAwq40ozwMDinPUmbFoufxYSCegLT8lSCiHqQ/ipxQ6RZmlnycU8dM4aBhuNMy3Y5QCMSOqc421WDkgwrOYh0U42ArAHGhMbqQ5TtLA3p6wvLc5scOW487vafzEp9HiyhvH9fMdAAAWeklEQVSlYXt7expeeO6b94C/IY9ffg2x4+CTcTfKTlYjYiDkdMrDT/eePFEuMDuceRrysvKz/OxvYnqVodQHPvCB9JprhlnEJ88c4323v4vyY0YGZSdDgbe85S1JmoCZlNcDy2MTVUtkhtUsWHV8NJ94QRy46z9jYSySN18RmhbqNCa3WlqrD0NIGn5wyQhXRji9rAVQT1vKI2I5mDDQEQmKcyj7esd0nWwFmJ+Xtx5s+usbZBAkZeCq48+M5eufHY0Lj1fAQa0AvDseu/27shCE6YueNZwQ/5CFYEOaDhys0zoD6QyOPmFT1C04OuGqUx6TFaC29a3B7oASTMOZdMXdjMOM7tI747mbACGNyg0P4xm09ByebkJhBfHiU4+e3kTvRpgT/QRJVfXajfP666+PF77whUkxR0NmShKPQeRnvMbvRMgfQFjEfdYW0CMzTJlNcLqkwbc4ry5jnvsZ15UA5SAbnyC1UO65FEbc8eIjiRHe5UfdYdOA9GVX3Xma6qtFbMoTpCLRf0jlxtLcnfd+N359zd/HwgbZ9cuQpqbQpq20GqJncHsseeYlccJzXquOeHEM7Lsveg88LJRggDnR49JPcwZKhGfyS7VCemIUvGqQK+6m1qVS2K0Rl0Cf0xP9u2+LX33vc/LRf1tpfz716EN1spMY1vQljjxqDmjfP60dql0eZ7307+TB9+kifrVjMSSs/VREcwZPqJ6/vFRoSBYtaWyIqGONiWEUHt/njbkcp+9NCOM1VoctP0MAAD0hjkYxSMIsGfF/IjBj4syBabGXP/vdRDim+t7fSllBhAbueef3fl5+Jn8MFZDIAH8D1xPFJYzrBUUrQK8PI8dVN1O06HryMigZ8ahHlQUfVMNuuCjiVqw9O7Z3vDj23v+5WNC4QHTKJhqaLZJBTs9Dt8bQyRdG/VFnR+Py9dG0XL11ghLDHbnRqZwK8/dc814a/nQW6+jeEZ3bbomtsvjr23OnjH/Ukw/KBgC7foUcFHHXSCko8o+h7i2x+rmXifA1pEryREnqqKaMhGrG4GANzxjKuUPkBsmZBgq4oea5cKHSuLh2A/LzPKyvx3vnMGOdGVoAED6AFODpvWrwmmh8Jt/V5DklNo2fPD30FZhIIzHRA7t8J8q/wzm/ZIc4PDdxT5RF+ybEGtPMHb0OKzVh8gdxi6xKA/p0Tr03pNa4OtZueEHseUTrEgblbFOKv3658FLtR3Hn3fHIzV+KJWdrTn7RymTfX+r3yadCmMaV5xJdQ7oCkkIy4BZlnS6w3hvs6YyeXdtkD/DT6Hrs57Lx75Nvfon78hSEL+HUmwunNvPS92vX5IHBaFz5/Dj25PM1uFgkpSLahpE0UkJz9/OEFvsrFdPBhlHp7ew+M/HQ2JlVQNHI+JnpOS/mqYZ4CJOHMwHwrFoCmsqXkg5jamZQcBzCllrMjGCUhMn0RGXr73e4PK/g5j7/rvI8Oh5DONZtfPzjH0/MhzgYOTGli08DJDjymdSJopv6xPdF2LVyqQ2Jy4lHTe2+eOin/1889INPxYI2eesV8RVljdessX+hrzF62zSPv0gbbph5JOqGCEtHyfmGrrlNP3AFDkx5SzqMmgEp/uSIY3DwAekH6uQxWLYQ0gyKVSuKTMd1Ij8FeexlUxFpA2Nvf02c+luXx/ITX6ShR6tmKEqdll4KnH7pbrZ/n9A9f6XCGa9xVQo/089In0aMBSIHYKKYKG9u/MxQsKgGOwWmzeh9zQBmOr85PoiTdJjtQNHI9Cg+ErGpQOyuBvwN5B2fi5gi+xvo/csVduU4SZ/eHQUtxI/UgegPsMkJvT84SumkvhytnAoZwmFYpeGShuSs3Ft7+vNiz/a7on/LD6O5EWWbjJA0397cWBeL+/Zo621tHc78fALFzxmBn4IWmucMbq4FSAss4MEgp6lZi4B4p1kA5u/FH9Sjl4Z47NvHjEGNlIr7e/fF6me+QT7+fkMjBrkPAzHmhAlAPIJcb+YCnPJcpPWkTsMETgPnmkbsg/uJej0XDmExSmIxD67I8S+IcxI3eIeb6Awe52WisH5vxoWSEvCaBJgRAM5qgW9glgVzXbT1OD+p5hvMIHGSgkcm3HTT08MQMO3GspOyTGUqYkEbj1CNwg/aEUmK0HSh57VN6+Kk33h11Cw7XeK23mncPSzRPo3CFaZBc/hsr106GqJZFnstsvJr1nr+0UNxWqR9b9G5mbPCc/AeN1zJJkfcpqAeHzfdMgsUrcuHv3r6IRkKYDuAQ9F93VoW3PHyOP7s/6E42n0KAj/M1HeYk6+2KR354Wi0NEoaOAfXPkxU4xEP7wjH3oSs/afHY7hAL8wQAjBhVFMazs9k4sAsUPQxxQgwxUiv7QVVE+HiG/h2FHZMdQJ8A1aSGGVVCxA7wyXWQwAMmbgHGIqQT8qWsTfz5/S0KM7SBpw8kiUdW2QXCq1yi31GnPabl8l76UmSpLS3obbgQgHYrU01D6ROH1ZQOkIuu1kanAhYswRFHQUNJdDWD+nMdl/J736tzlLkkWqdqL9O+ZFPHskdmquX1x78AQ5JnB+qlwVhg/aT7NkTy9b/Vpyx6TW6Zzm2GJTSRkI5nHCYk5/dT6eRcNADV7oejxiryRnxwQ1AoDRy1qLT+E0o+dnXlXD7HTMCzI0zxYURE4ChSzXgbyUs020oHDmTR/I60feSB8IgcSCys6KQaTfW9k8Utzx/MC8ApSGAqTJE7e9MD8t+eMcBAwHo/VnLgP8DSx/s0XD//fencElRBhPQP/viYROXbhWfXh4Hn9p6Q3Y3T4/TLnxdNCx9uvzlac5dvTLKvWJayQcJqBeGcSE6wEw4Cxvj9YQc6YLyUzzVeCoLmA0bcxKqqEU9BfkAoJdHY4ikXy+xv04GQ/t7u6L1xBfH+o2v1JbectKZvk+xdS7oOAhcj+Tl4MNZvfKAZ1YTOZzI80abegtlhmcQyngNsZo8g4eGyvoBO8sknhcDeWqv2nTIE1Nlb33rW5NLKxo8i5Yw8Kkmv84PvvFyIx0rymACJqxK35fnM9dZkDaQvx8vPguPyPMNN9yQCJ6wN9988+gCIfI5Fq78OQ5TsDTke2CAzAKYKWHqnObbRzNSIqSD9MQAALJGJJennlUb4vSL3hx33fzl2H3fddEmQm2S2F7AeAfzYInoSAuJCahnRg+Hw40SQfL94IcpGMQokS6U4LCYCIyC2QBQ1MqIpyAf/z39bXHMWW+MjnNeGMWWY2XaL4aQMgjbAldO/MY7d2fK50kLeUPimrEzhMqYFiJwo55qARg/S4UBO+bE647HzTT0yQAE+rznPS+tUcBq8dJLL01DgGrwwNwIZxfnzIsDWMqB18xvrPwQ12XCmTgc1aQNTsqDeIjpaOUByplViZQRJsqGiXD6PbspMXVKeVqaQBJACejyN86KZ5nosllmUXv01S3ZEKe84I1x3PPeHIMNq6L/wC6RLNt8aStuzcAXxSSKw3LCKTPhAY3rURAOSTdw8JCeThQzJJ7AeVCuvlnQg3/AJpn+NicJoSH29A7FgSWnxSkv+cvoOPflWmnYIQegWtM/wo7ENdLV4Sa+w51+xfqaqYduHDRAeg/WA9BD05vQEHnuRjbZNIkH/i1btsQ73/nOtCAI60IAazxP7U0GL8RpAmKMS8/HGByC4vlEeXWevOTXPgAYRkzmW50O+SFeNWn7Ox3X3pHIO8QP2HGpw453dppYNeLmC8Mpen0AoyesJZ3WWHgK6liHcPGlXr4mMQB9S/3qOPb0l8SZ/9ffxNLTL41uiea9BzR+l2evNhkLtaqTb1APDh0jmtM7j4r/iWRpM5q/17CCYYascTW80Bi/sDe6Bx6MHg3b1p73mnj6S//fWHLC+TEkxx7aiEtTeuoEEAvo8VN/wHzB4YUntdhvomGsyeagzLtjfYZ/eHbu8RLSqVQBjROgd6ZXYh4cQgFQmE3GqCdFGvkxkbphuzd3ennYsa5Z3gyDY1UgvgJf9KIXjRW04nPSJh+UH5aJMDKuOfyNFSNmD9vb2xPzYs4eM1+09na+Cv5qvsfhmPbjGuLv6OhI6y5Iyu+zZMsuYZoQm+pF1MxGnkKjywXakeesOOGCY2P5yedpEc7PtLfej2Jw30/kxXeH3IGtSp57ca0t8iYl4SmhJk3G+4UCBN+vBUTa9kv79TWsfG6sPP6cWHnshmhbcaIIfXnaxBfGQLPQ4KNE+1C+pgdLGoaSBFCW6Tm7fVITv3sPSpNKy8/VNL4UocKPGx3KNKaxIFDG52jqccppx5wVolb1qDxv5fdjISEcYjrjYfYZwEqPXpdpMp5Xg4dvg8Dxa4AC834p11jWjPhtsXus9IlLWcAkYIZ4AaZ8bK5raYB8cLgcx8LHc/LNkmA2WqWMYUSkUc33sEwXwk8+9CTjIuYiATBLUFqwp23g1z1Lx2nRf8aFsX/n/bH/4bui89E7tAHIdq3Y2x99/d0aEhiYJ5DdXtNCLRluiZaFx2iDDvmK1LLchctOkBefVQpY2i0IF2L1fKM8BKcOH+ahCxiHLnT4fPiE7yedhZ9KdRRohG7MTDVt3rw5aeXxGMPSXhRI1TTAUYQjF+ClAaJIYz4eYkMMpWfCnwA9lRsn4eYK+BZ/j3tp7rk2wY3HAByf8HjV9UYl5J+Zg3Lb+krfZRx8N5p+ZgwQ2THOsc0/8cbLh/E67w5vove9z2Pi0ndAaOytx5wM2nxtkCXilxSjOX7w4zxDy4EkltMLK3xBfvflwGPwwB4pXfdG34EeYVAdio/gHahGSsJmOWVp0mxGY9sybQ0m5x4yKCpqxZ6QjpS/gitN0X6J8Ev9DlkhSHqeiB+cLBI6THCQqR2mDMxmsm4UNGas1L7//e+nJb+MGRlTp8qnhiYJxuuxNeN+gDntfE58Lgnfn2Di4x4GBJAPnlcDhMUqjyEDUgNLkX/84x+Pbg5aDQ7KhzInPsMOQ86EuK6mfJx343TZ53HHrMckXovARfoaxIiEVQYiYNbPM8lOP6wXIlAxR1nnYbbLVl/1rWt1HCtjXObyNW8P1SaAULMDXKLmYZUZ+gVMdUkrkbOYC9IFvv3wyQfAcHDXkYb/pVDp+eH6eVL3/BSqG70bjQt6zAbjAFWcIS68AeOuCkbAOJu56byRV4FmRoNM57uI6/JidyH86hnw0sMqxcngNy5wcJ0TrPFO5mx81CUWgwwnYORMj1IX4H9cPSsBhPWDACGXiLlEktxx5WOE0M0cUlzeHYyXcCkPSZwn5kgHAjM5iFnvU0Cnwg0p+Xl6eVh/nvTEn5euGw/PyhtJHm4y1xA6q88YJzO2BkhnpvBPJi/TDUu+OSAinKIwZcmMAdN2SDXAdAl4Onm0tID78ksuuSRwtYbfRoYnKBV5X61Ccjr5eLLEfVKL/eWVNFMEWc5E6PV5lvc+DjNTaZZ/y2zeQ0S4RMtFdn/bbKY7EW7Kkrx94xvfSISPJIKOBV0CHpZtVDURnvn3pRI4fNqGJ3AN0AhN1CZ6zn7Gp5XfPxE+N88/RAbB+5y/O9zfwtQtwGwGNgwob5mdII9muoc7j0+E9OeJf5K1RONCFLYBTR6dxmciqUY8BhfEVX7w3EeOv5prCDYnWq4ng4t8+0CE9jVnf1s1+ZiNMHwH+WC1IED+8LaMLcF11103muRkvnc00lPwYp74J1HpECnKPYxoMJz5/Oc/n2zXaZA0uKmAGyrnnFBJa7IADgjCRMsZcBqTxefwh5vonQ+fmVHBJTg2CDYcovdnuS95nUrZGfdT6fyUUvhNtWIhHhoVja2jo+MQNIib7e3tiQlAbJMhFBMlzMMAAwDA48PvqjmzfgFFHZpwbBCYXwcPeCebv2rSm8swlBeEzXfgbARlH4o+yo96+OIXv5ieEWYqZTeX33IkpPWUUvhNt8DtUQbjIK5xzJkT62Tx00DBg7EQdu/sGcAiFvfYk8VHXj760Y/GFVdcMRrVm5qYgY2+eIJfsPgJRR87IMPgAL5xHiZRAiqweaiyBGReWtQmIbSwdGhBT1HjzaJ6mqKUUOk8HirC5Qdhv/KVr4ziA68s6RKKavAREHwi+hRHbr6LsjYsyoCpqKm5hFdrD9I7h0k3Vf4YN3E5uJ8JcBlMFleeH+J+9atfHS07DcWKW7duTShnKp8J2ZP4Z77nnwSjxK6cFWbYudNr4+UGe3c1tnRfLSrC07tjSWePN8yl//SnP00Ha/HBP1nA8AVrQ6wX7UTD0ora8GTRpZ40F58n+52VEgRHDlP5TuLzPaw5wKQam4R2Db3YrQmYKs4U+Sn0M0/8k6hsGi7aZWubierGTGOcqNHxPg/H+JxdfXBUwaIggGvCVUNo5QRtHwIwJBM9zj8BwuZpp4fj/BCWsTQehWAkWNHx7ZPBUY6euIB1HL4vD1fNPXFhoHaSSpzp5K2aNJ9sYQ5qmp5sXzYL32PilQiciJOzYSLCJ1x5Y5eYmrTVrNs3E7HPeuMd70yazhPhTPBcOy3ny2feTQQmIvQQmPiiWWerMKQK8DivE+Epf09cCJ/5eRb7OE/Oa3n48nuH95n31IGPavGU432q3s8T/yRq3o2XHodGzNnPuM8b5VhoaaA+vAU3cXEuwtLVfDZhInzG43AsMQZwAMI2X4B7fq4djutKAD4ImzOARyD2P+QZjkQ5MLABTx6uEq6xnuHRh70QObg2Hs7VgMuZsw/qwXVSDY75MKUSmBf7p9kSJiKoHD1h6aVoqMxPe+dgh8FVtcetPIMIJ8JvQiU8vvINPMcLjj0KgWcifHlaELm3COcaQCfBOgZW6+XpOs2xzk4X91sXXaSdbEcAT7xIE0g7lIvD+X015zzP1YSfD3OwBOZ7/oNlMSdX7rlo6CZWxH4AXQKLg+gFJ9OowQmB2sW3e1FWGNr3frXESjgOGBQOOQDjQ1KxIjG9mOQPCk4Apx7sqQjBo1MAqs1fCjz/MyMlME/8M1KM1SOBqGn0KPZwJQbQowJYDprofU4vxvhxGIgT4jEz8XMW5+Q9/xhoRh+bADmDA7t5AEYAeAPSdKMfh/f9RGfcprFtNxIP9geXX355rFu3LkUjPed7Ijzz72emBObF/pkpx6qx0MBNTIjAt9xyS5qqoifEyAegJ68GTHyERxzH6AjwcyQK3vl+IpwmPoeHQQEwF7T9bBVuBkAYf0c1eAnPbAFblcP0SAsjHc8gVItrorTm31dfAvPEX31ZzXhIXH/l/vUhsmoJ35kxoaLp93ShRX2Uh0z7OYzjjHUmHIeZgJWF4OAaLb3FdHDkYcfC6efgJDxKTWYPcnB6+bP569kvgeq6mNnPx1MyBYiBIQBEz3myRJCHR0RnXzyAvQkAjJBgJpPBbSIlvqcdwYfnY+bU/SxPm7DVAt/q7+U8D4evBOZ7/sNX9ill9/QQ02QJyj0vxI3YjHcbcKBB37RpU2IGhOEdZ6c11icT1zg5Q+j4PWQlI+8uvvji5DaLd1MBcJjgJ8rLVPDPx5lcCcyv6ptceR3xodH6MwRAVAdMzNPJuBWJVh5OB9d83COnBOaJ/8ipi2nnpJzQy++nm8BM45tufubjT68E5ol/euV3RMaeJ9IjslqOuEzNK/yOuCqZfoYYW8/DfAlMVALzxD9RCc2/ny+BJ2kJzBP/k7Ri5z9rvgQmKoF54p+ohObfz5fAk7QE5on/SVqx8581XwITlcD/D7vritCEBsTTAAAAAElFTkSuQmCC`,
    }
  },
  watch: {
    weiboImageScaleType() {
      // 获取 .speechless-list 元素

      console.log(11)
      let scaleClassName =
        "speechless-list-" +
          ["small", "medium", "large"][this.weiboImageScaleType] || "medium"
      const speechlessList = document.querySelector(".speechless-list")
      speechlessList.classList.remove(
        "speechless-list-small",
        "speechless-list-medium",
        "speechless-list-large"
      )
      speechlessList.classList.add(scaleClassName)
    },
  },
  methods: {
    eventStart() {
      this.state = "SELECTRANGE"
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

      this.weiboRange = {
        start: {
          year: startY,
          month: startM,
        },
        end: {
          year: endY,
          month: endM,
        },
      }
    },

    async eventFetchPosts() {
      this.state = "PENDING"

      this.pendingWording = ""
      let documentTitle = `@${this.username}`
      if (this.weiboRangeType == 1) {
        this.pendingWording += `${this.weiboRange.start.year}年${this.weiboRange.start.month}月 - ${this.weiboRange.end.year}年${this.weiboRange.end.month}月`
        documentTitle += `_${this.weiboRange.start.year}${this.weiboRange.start.month}-${this.weiboRange.end.year}${this.weiboRange.end.month}`
      }
      if (this.weiboSourceType == 1) {
        this.pendingWording += `的原创微博`
        documentTitle += `_原创微博`
      } else {
        this.pendingWording += `的全部微博`
        documentTitle += `_全部微博`
      }

      document.title = documentTitle

      let fetchTask = await fetchPost(
        {
          uid: this.uid,
          sourceType: this.weiboSourceType, //
          rangeType: this.weiboRangeType, //
          range: this.weiboRange,
        },
        (cb) => {
          switch (cb.type) {
            case "total":
              this.total = cb.value
              break
            case "count":
              this.count = cb.value
              break
          }

          if (this.total > 0) {
            this.progress = Math.floor(
              (parseFloat(this.count) / parseFloat(this.total)) * 100
            )
          }
        }
      )

      this.state = "SAVING"
    },
    eventRangeChanged(e) {
      this.weiboRange = e.range
      console.log(this.weiboRange)
    },
    eventMinimize() {
      this.isMinimum = true
      localStorage.setItem("speechlessPopupMinimize", "true")
    },
    eventResetPopup() {
      this.isMinimum = false
      localStorage.setItem("speechlessPopupMinimize", "false")
    },
    eventSavePDF() {
      setTimeout(() => {
        this.state = "DONE"
      }, 1)
      setTimeout(() => {
        window.print()
      }, 10)
    },
    eventRefresh() {
      location.reload()
    },
    eventReSave() {
      this.state = "SAVING"
    },
  },
}
</script>
<style>
body {
  background: #fff !important;
}
</style>
