<h1 style="text-align: center">Chen-Tools</h1>

![](./src/assets/images/chen-tools.webp)

一款开源免费的在线工具箱，包含开发、文档、作图、媒体、生活等实用工具，主要基于 Vite + Vue + Ant Design Vue + Pinia 开发，某些工具使用了第三方开源库。

- [项目地址](https://github.com/chenyl8848/chen-tools)
- [在线体验](https://chencoding.top:8084/)

## 工具集合

- 开发工具
  - [x] URL编码解码
  - [x] JWT 生成解析
  - [x] 时间戳转换
  - [x] JSON 格式化
  - [x] Linux 命令查询
  - [x] 颜色选择器
  - [x] 图片/Base64转换
- 文本工具
  - [x] 字数统计
  - [x] 文本比对
  - [x] 拼音转换
- 文档工具
  - [ ] 在线表格
  - [ ] Word 文档编辑器
  - [x] 富文本编辑器
- 作图工具
  - [x] 思维导图
  - [x] 流程图
  - [ ] 手绘白板
  - [x] 签名画板
  - [ ] 二维码生成器
  - [ ] 图片裁剪
- AI 工具
  - [ ] 生成证件照
  - [ ] 文本转图片
  - [ ] 文本转语音
- 媒体工具
  - [ ] 抖音去水印下载
- 其他工具
  - [ ] 抽奖
  - [ ] 亲戚称谓计算器
  - [ ] 烟花
  - [ ] 完结撒花

## 本地开发

### 启动项目

```bash
# 克隆代码
git clone https://github.com/chenyl8848/chen-tools.git

# 安装依赖
npm install

# 启动项目
npm run dev

## 打包部署
npm run build
```

### 添加工具

1. 在 `src/utils/tools.js` 中添加工具配置信息，一个完整的工具配置信息如下：
  ```json
  {
    "title": "URL 编码解码",
    "description": "URL 编码解码",
    "icon": "icon-Url",
    "favicon": "/images/url.svg",
    "path": "/url",
    "component": "/pages/dev/url"
  }
  ```
2. 在 `component` 配置的路径下新建工具组件并开发

## 感谢

- [VueUse](https://github.com/vueuse/vueuse) - 基础 Vue 组合式工具的集合。
- [LogicFlow](https://github.com/didi/LogicFlow) - 一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。
- [Univer](https://github.com/dream-num/univer) - 一个开源的办公套件引擎，旨在为开发者提供一个强大、灵活且易于使用的办公套件解决方案。
- [SimpleMindMap](https://github.com/wanglin2/mind-map) - 一个 `JavaScript` 思维导图库，也是一个完整的思维导图工具。
- [Vditor](https://github.com/Vanessa219/vditor) - 易于使用的 Markdown 编辑器，为适配不同的应用场景而生。
- [lucky-canvas](https://github.com/buuing/lucky-canvas) - 基于 `JavaScript` + `Canvas` 实现的【大转盘 & 九宫格 & 老虎机】抽奖。
- [linux-command](https://github.com/jaywcjlove/linux-command) - `Linux` 命令大全搜索工具，内容包含 `Linux` 命令手册、详解、学习、搜集。
- [signature_pad](https://github.com/szimek/signature_pad) - 基于 `HTML5 Canvas` 的流畅签名绘制。
- [vue-color](https://github.com/linx4200/vue-color) - 现代化的 `Vue` 颜色选择器集合——快速、便捷、易于使用。
- [canvas-editor](https://github.com/Hufe921/canvas-editor) - 基于 `Canvas/Svg` 的富文本编辑器。
- [qrcanvas](https://github.com/gera2ld/qrcanvas) - 基于 `Canvas` 生成二维码。
- [fireworks-js](https://github.com/crashmax-dev/fireworks-js) - 一个简单的烟花库。
- [Countable](https://github.com/RadLikeWhoa/Countable) - 一个 `JavaScript` 函数，用于统计段落、字数和字符。
- [pinyin](https://github.com/hotoo/pinyin) - 一个 `JavaScript` 函数，用于中文汉字拼音转换。
- [monaco-editor](https://github.com/microsoft/monaco-editor) - 基于浏览器的代码编辑器。

## 其他项目

- [个人博客](https://github.com/chenyl8848/chenyl8848.github.io)
- [开源项目汇总](https://github.com/chenyl8848/great-open-source-project)

## 联系本人

![](https://camo.githubusercontent.com/35f15a05ef47abcc0e8395d8bc7ada0818168e2f68f7e43ce03f2d45a141f530/68747470733a2f2f6368656e2d636f64696e672e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f2545352538352541432545342542432539372545352538462542372e706e67)