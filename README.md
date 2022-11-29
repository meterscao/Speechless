# Speechless

![image](https://user-images.githubusercontent.com/1685497/202353941-811d2c6c-c10c-45ab-94ed-8811bebc7c34.png)


Speechless 是一个帮助新浪微博用户，把微博内容导出成 PDF 进行本地备份的 Chrome Extension。

[添加到 Chrome](https://chrome.google.com/webstore/detail/speechless-%E5%BE%AE%E5%8D%9A%E5%A4%87%E4%BB%BD/igilfpckopigflpafgoajlljpdhmoall)

## 简介
![ScreenShots](https://user-images.githubusercontent.com/1685497/202354135-41665c56-c77d-4ef7-8a10-fdcbc42be822.png)
![ScreenShots-1](https://user-images.githubusercontent.com/1685497/202354146-3286ac55-0c54-4f3f-9776-1b8e372ea547.png)
![ScreenShots-2](https://user-images.githubusercontent.com/1685497/202354154-204ac341-41e4-47ee-b11c-39c7a382ab53.png)
![ScreenShots-3](https://user-images.githubusercontent.com/1685497/202354162-cc241783-b631-4bbd-846b-ee8dc851ae76.png)
![ScreenShots-4](https://user-images.githubusercontent.com/1685497/202354168-0d1bde41-3f20-42b0-a393-8a210b61f643.png)


## 原理

Chrome 并没有为 Extension 提供直接导出 PDF 的 Api，但是可以借助 Chrome 的 **打印预览/另存为 PDF** 功能，将网页的内容直接另存为 PDF。

所以 Speechless 做了以下几件事情：

1. 在页面上找到需要备份用户的 UID，这通常可以通过 URL 直接获得
2. 通过 Ajax 不断去拉取该用户可见的微博内容，当内容中有长文时，额外通过接口获取长文信息
3. 将拉取到的微博内容，添加到页面的节点上，并且设置基本的样式和布局
4. 直到所有内容都拉取完毕之后，通过点击事件触发 `window.print()` ，唤起 Chrome 自带的打印预览界面
5. 在打印预览界面选择 **另存为 PDF**，导出即可

## 依赖

- [jQuery](https://github.com/jquery/jquery)

## 其他

- 愿人人都有自由表达的权利。

## 更新
### version 1.2 
- 增加了默认的拉取时间间隔，以避免拉取过于频繁被微博限制的问题。但目前的方法仍不是最优解法，尚有较大优化空间
- 增加了拉取完成后，手动选择图片裁切样式的操作
- 增加了拉取完成后，手动选择是否展示 转、赞、评 信息的操作 [@rickypeng99](https://github.com/rickypeng99)
- 增加了拉取过程中暂停的操作
### version 1.1 
- 使用 Weibo API 获取用户 UID 和用户名 [@jingfelix](https://github.com/jingfelix)
- 修复了 icon name 错误的大小写问题  [@jjhhms](https://github.com/jjhhms)


