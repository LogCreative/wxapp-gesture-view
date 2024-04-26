const app = getApp()

Page({
  data: {
    dispRenderer: ""
  },
  onLoad() {
    this.setData({
      dispRenderer: this.renderer
    })
  },
  onTapToMovable(e){
    wx.navigateTo({
      url: '/pages/movable-view/movable-view',
    })
  }
})
