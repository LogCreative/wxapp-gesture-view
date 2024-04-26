# wxapp-gesture-view

微信小程序自定义组件 gesture-view，支持双指触控的平移、缩放、旋转，兼容 skyline 渲染器。

![demo](https://github.com/LogCreative/gesture-view/assets/61653082/c7cbdcce-6da8-4557-8b03-b98d333f00fb)

代码片段：https://developers.weixin.qq.com/s/O1nlcKmV7rQu

代码仓库：https://github.com/LogCreative/wxapp-gesture-view

## 介绍

微信小程序原生组件 [`movable-view`](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html) 只支持平移、缩放，不支持旋转，仅支持 webview 渲染器，并且有性能问题。

`gesture-view` 组件在微信小程序中原生实现了双指平移、缩放、旋转，并且兼容 skyline 渲染器。算法上参考了 Dan Burzo 的 [Pinch me, I'm zooming: gestures in the DOM](https://danburzo.ro/dom-gestures/) 一文，使得变换中心始终处于双指中点。初期实现参考了 [微信小程序单指拖拽和双指缩放旋转](https://cloud.tencent.com/developer/article/2235491) 专栏文章。

由于微信小程序不支持 `DOMMatrix`，并且无法通过原生 npm 构建的形式正常加载 [@thednp/dommatrix](https://github.com/thednp/dommatrix?tab=readme-ov-file) 包，这里直接使用了其 cjs（CommonJS）发布文件于 [utils/dommatrix.js](components/gesture-view/dommatrix.js)。

示例图片作者 [Mudassir Ali](https://www.pexels.com/photo/blue-and-green-color-abstract-painting-3609832/)。

## 使用方法

1. 将 `components/gesture-view` 文件夹复制到你的项目中。
2. 在对应页面的 `page.json` 中引用该组件：
```json
{
  "usingComponents": {
    "gesture-view": "/components/gesture-view/gesture-view"
  }
}
```
3. 在 wxml 中直接使用 `<gesture-view/>` 组件即可，组件内部是你需要展示的内容。
```html
<gesture-view width="100%" height="60vh" scaleValue="1.5" rotateValue="15">
  <image mode="aspectFit" src="/images/pexels-pixelcop-3609832.jpg"></image>
</gesture-view>
```

## 参数

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| width | String | "300rpx" | 宽度 |
| height | String | "200rpx" | 高度 |
| translateX | Boolean | true | 是否开启横向移动，关闭请使用 `translateX="{{false}}"` |
| translateXValue | Number | 0 | 横向移动初始值，单位px |
| translateY | Boolean | true | 是否开启纵向移动，关闭请使用 `translateY="{{false}}"` |
| translateYValue | Number | 0 | 纵向移动初始值，单位px |
| scale | Boolean | true | 是否开启缩放，关闭请使用 `scale="{{false}}"` |
| scaleValue | Number | 1.0 | 缩放初始值 |
| scaleMin | Number | 0.1 | 缩放范围最小值 |
| scaleMax | Number | 2.0 | 缩放范围最大值 |
| rotate | Boolean | true | 是否开启旋转，关闭请使用 `rotate="{{false}}"` |
| rotateValue | Number | 0 | 旋转初始度数 |
