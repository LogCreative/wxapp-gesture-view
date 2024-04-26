// pages/movable-view/movable-view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dispRenderer: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      dispRenderer: this.renderer
    })
  },

  onTapToGesture(e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})