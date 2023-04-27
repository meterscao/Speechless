# Speechless

![WechatIMG160 copy](https://user-images.githubusercontent.com/1685497/234859432-04ab3f05-82ae-4a2f-9b51-265c4998b38d.jpg)

Speechless 是一个帮助新浪微博用户，把微博内容导出成 PDF 进行本地备份的 Chrome Extension。

查看官网👉 [https://sppechless.fun](https://speechless.fun)

## 使用

- 通过 Chrome Web Store 安装（推荐）

  [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/igilfpckopigflpafgoajlljpdhmoall?color=green&label=Chrome%20Web%20Store&logo=google%20chrome&logoColor=white)](https://chrome.google.com/webstore/detail/speechless-%E5%BE%AE%E5%8D%9A%E5%A4%87%E4%BB%BD/igilfpckopigflpafgoajlljpdhmoall)


## 简介

✅ 一键导出 PDF

将微博的文字、图片、表情轻松备份成高质量PDF文件，方便阅读、浏览和储存。

✅ 支持时间范围筛选

可以根据时间范围进行筛选和导出，确保只备份你关心的特定时期的微博内容。

✅ 备份任何公开的微博

不仅支持备份你自己的微博，还支持其他任何公共公开的微博。

✅ 安全可靠

无需额外登录和输入密码，直接通过插件形式使用，确保你的账户安全和隐私保护。

✅ 支持原创与转载

可选择仅备份原创微博或全部微博（含转发内容），灵活满足不同需求。

✅ 精美的照片排版

支持选择图片备份的大小和清晰度，为你提供最佳的阅读和存储体验。

![WechatIMG161 copy](https://user-images.githubusercontent.com/1685497/234859469-62b64b5a-728d-48e2-ac24-45d68266f751.jpg)

![WechatIMG162 copy](https://user-images.githubusercontent.com/1685497/234859495-970397e5-1cbd-4272-868d-74ab1a6dac20.jpg)

## 原理

Chrome 并没有为 Extension 提供直接导出 PDF 的 Api，但是可以借助 Chrome 的 **打印预览/另存为 PDF** 功能，将网页的内容直接另存为 PDF。

所以 Speechless 做了以下几件事情：

1. 在页面上找到需要备份用户的 UID，这通常可以通过 URL 直接获得
2. 通过 Ajax 不断去拉取该用户可见的微博内容，当内容中有长文时，额外通过接口获取长文信息
3. 将拉取到的微博内容，添加到页面的节点上，并且设置基本的样式和布局
4. 直到所有内容都拉取完毕之后，通过点击事件触发 `window.print()` ，唤起 Chrome 自带的打印预览界面
5. 在打印预览界面 **目标打印机** 选择 **另存为 PDF**，导出即可

## 依赖

- Vue3
- TailwindCSS

## 其他

- 愿人人都有自由表达的权利。

## 更新
### version 2.0
- 支持选择时间范围
- 支持选择图片大小
- 支持仅备份原创微博
- 支持最小化窗口
- 支持多种url形式的微博主页

### version 1.2 
- 增加了默认的拉取时间间隔，以避免拉取过于频繁被微博限制的问题。但目前的方法仍不是最优解法，尚有较大优化空间
- 增加了拉取完成后，手动选择图片裁切样式的操作
- 增加了拉取完成后，手动选择是否展示 转、赞、评 信息的操作 [@rickypeng99](https://github.com/rickypeng99)
- 增加了拉取过程中暂停的操作
### version 1.1 
- 使用 Weibo API 获取用户 UID 和用户名 [@jingfelix](https://github.com/jingfelix)
- 修复了 icon name 错误的大小写问题  [@jjhhms](https://github.com/jjhhms)


