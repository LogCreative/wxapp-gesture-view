// components/gesture-view/gesture-view.js
/**
 * Copyright (c) 2024 Log Creative
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// dommatrix CommonJS version from https://github.com/thednp/dommatrix
const CSSMatrix = require('./dommatrix');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    width: { // 宽度
      type: String,
      value: "300rpx"
    },
    height: { // 高度
      type: String,
      value: "200rpx"
    },
    translateX: { // 是否开启横向移动，关闭请使用 translateX="{{false}}"
      type: Boolean,
      value: true
    },
    translateXValue: { // 横向移动初始值，单位px
      type: Number,
      value: 0
    },
    translateY: { // 是否开启纵向移动，关闭请使用 translateY="{{false}}"
      type: Boolean,
      value: true
    },
    translateYValue: { // 纵向移动初始值，单位px
      type: Number,
      value: 0
    },
    scale: { // 是否开启缩放，关闭请使用 scale="{{false}}"
      type: Boolean,
      value: true
    },
    scaleValue: { // 缩放初始值
      type: Number,
      value: 1.0
    },
    scaleMin: { // 缩放范围最小值
      type: Number,
      value: 0.1
    },
    scaleMax: { // 缩放范围最大值
      type: Number,
      value: 2.0
    },
    rotate: { // 是否开启旋转，关闭请使用 rotate="{{false}}"
      type: Boolean,
      value: true
    },
    rotateValue: { // 旋转初始度数
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    startScale: -1,
    startDistance: -1,
    transform: "",
    transformMatrix: null,
    startTransformMatrix: null,
    startAngle: 0,
    startOrigin: {x: 0, y: 0},
    startTouches: [],
  },

  observers: {
    'transformMatrix': function(transformMatrix) {
      this.setData({
        transform: transformMatrix.toString()
      })
    }
  },

  lifetimes: {
    ready: function() {
      let initialTransformMatrix = new CSSMatrix()
        .scale(this.data.scaleValue)
        .rotate(this.data.rotateValue)
        .translate(this.data.translateXValue, this.data.translateYValue);
      this.setData({
        transformMatrix: initialTransformMatrix,
        startTransformMatrix: initialTransformMatrix
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTouchDistance(touches) {
      return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    },

    getTouchAngle(touches) {
      const x = touches[0].clientX - touches[1].clientX
      const y = touches[0].clientY - touches[1].clientY
      return Math.atan2(y, x) * 180 / Math.PI
    },

    midpoint(touches) {
      let [t1, t2] = touches;
      return {
        x: (t1.clientX + t2.clientX) / 2, 
        y: (t1.clientY + t2.clientY) / 2
      };
    },

    gestureToMatrix(translateX, translateY, scale, rotation, origin) {
      return new CSSMatrix()
        .translate(origin.x, origin.y)
        .translate(translateX || 0, translateY || 0)
        .rotate(rotation || 0)
        .scale(scale || 1)
        .translate(-origin.x, -origin.y);
    },

    touchStart: function(e) {
      const touches = e.touches
      this.data.startTouches = touches
      if (touches.length === 2) {
        let startOrigin = this.midpoint(touches);
        const that = this;
        // #gesture-ref is of no transform
        this.createSelectorQuery().select('#gesture-ref').boundingClientRect(function(rect){
          startOrigin = {
            x: startOrigin.x - rect.left,
            y: startOrigin.y - rect.top
          }
          that.setData({
            startOrigin,
            startDistance: that.getTouchDistance(touches),
            startAngle: that.getTouchAngle(touches)
          });
        }).exec();
      }
      this.setData({
        startScale: this.data.scaleValue,
        startTransformMatrix: this.data.transformMatrix
      })
    },
    
    touchMove: function(e) {
      const touches = e.touches
      const { startTouches, startScale, startAngle } = this.data
      if (touches.length === 2 && startTouches.length === 2) {
        let curScale = startScale, delta_scale = 1.0;
        if (this.data.scale) {
          curScale = startScale * (this.getTouchDistance(touches) / this.data.startDistance);
          if (curScale < this.data.scaleMin) curScale = this.data.scaleMin;
          if (curScale > this.data.scaleMax) curScale = this.data.scaleMax;
          delta_scale = curScale / startScale;
        }
        
        let delta_rotate = 0.0;
        if (this.data.rotate) {
          delta_rotate = this.getTouchAngle(touches) - startAngle;
        }

        const mp_init = this.midpoint(startTouches);
        const mp_cur = this.midpoint(touches);
        const translateX = this.data.translateX ? mp_cur.x - mp_init.x : 0;
        const translateY = this.data.translateY ? mp_cur.y - mp_init.y : 0;

        let transformMatrix = new CSSMatrix()
          .translate(this.data.startOrigin.x, this.data.startOrigin.y)
          .translate(translateX, translateY)
          .rotate(delta_rotate)
          .scale(delta_scale)
          .translate(-this.data.startOrigin.x, -this.data.startOrigin.y)
          .multiply(this.data.startTransformMatrix); 

        this.setData({
          scaleValue: curScale,
          transformMatrix: transformMatrix
        });
      } else if (startTouches.length !== 2) {
        let transformMatrix = new CSSMatrix()
          .translate(
            this.data.translateX ? touches[0].clientX - startTouches[0].clientX : 0,
            this.data.translateY ? touches[0].clientY - startTouches[0].clientY : 0)
          .multiply(this.data.startTransformMatrix)
        this.setData({
          transformMatrix: transformMatrix
        })
      }
    },

    touchEnd: function(e) {
      
    }
  }
})