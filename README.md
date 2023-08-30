# 介绍

这是一个 B 站直播的娱乐玩法，用处是根据用户送的礼物来增加相应的直播时长，增加一定的娱乐互动效果。~~骗观众打更多的米。~~ ~~我的直播间没人，我也不知道有没有 bug~~
![Snipaste_2023-07-03_11-24-52](https://github.com/renmu123/live-ot/assets/26896790/6c6c3070-97fb-4bad-af0e-a187421c78f0)

# 使用

在线地址：https://live.eif93.love/

具体使用可以看这个[视频](https://www.bilibili.com/video/BV1RV4y1y7V6/)。

推荐使用 OBS 的浏览器捕捉

## 如何修改样式

1. 修改代码样式并进行自部署
2. 使用 OBS 浏览器捕捉的 CSS 修改功能

# 开发

node 最低版本为 16

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

## Win 编译包

可以在[releases](https://github.com/renmu123/live-ot/releases)中找到 Win 编译好的文件，解压后双击`caddy.vbs`运行，使用 `http://localhost:8777` 来进行访问。

# TODO

- [ ] 支持背景设置
- [ ] 支持字体等设置

# 更新记录

# 1.2.0

1. 增加 win 离线安装包

# 1.1.0

1. 修改了加班姬的位置，更加方便进行调节
2. 增加了配置项的背景
3. 增加了开播时间的显示
4. 优化了删除按钮的显示

## 1.0.1

修复大航海不生效的 bug

## 1.0.0

主要功能完成了！！
