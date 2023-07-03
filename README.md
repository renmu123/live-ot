# 介绍

这是一个 B 站直播的娱乐玩法，用处是根据用户送的礼物来增加相应的直播时长，增加一定的娱乐互动效果。~~骗观众打更多的米。~~ ~~我的直播间没人，我也不知道有没有 bug~~

# 使用

在线地址：https://live.eif93.love/

具体使用可以看这个[视频](https://www.bilibili.com/video/BV1RV4y1y7V6/)。

推荐使用 OBS 的浏览器捕捉

## 如何修改样式

1. 修改代码样式并进行自部署
2. 使用 OBS 浏览器捕捉的 CSS 修改功能

# 开发

1. `git clone https://github.com/renmu123/live-ot.git`
2. `cd live-ot`
3. `npm install`
4. `npm run dev`

# 自部署

1. `git clone https://github.com/renmu123/live-ot.git`
2. `cd live-ot`
3. `npm install`
4. `npm run build`

如果想要更新礼物数据，运行 `npm run updateGift` 或者 `node getGift.js`，可以修改其中的参数，不同的直播间以及分区的礼物可能会有不同。
