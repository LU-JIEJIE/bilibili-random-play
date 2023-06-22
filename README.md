# bilibili-random-play



基于Tampermonkey（油猴）的b站分p视频随机播放插件

（随机播放虚拟主播的歌单才能百听不厌！关注[阿梓](https://space.bilibili.com/7706705/)喵，关注阿梓谢谢喵。推荐歌单：[梓杰伦歌曲全收录](https://www.bilibili.com/video/BV19P4y1P75w)）

## 安装

1.安装[Tampermonkey（油猴）](https://www.tampermonkey.net/)

2.安装本脚本

## 使用

安装脚本后，进入需要随机播放的分p视频页面，点击脚本嵌入的“随机”按钮即可开启随机。随机使用洗牌算法。

![image-example](example.png)

~~事实上，本脚本实现逻辑中，打开随机功能需要关闭自动连播功能且将视频“播放策略”设置为AV1或AVC。脚本内已做自动检测并关闭或开启指定设置，会强制刷新页面，属正常现象。~~

刷新可解决百分之99.99999的问题！