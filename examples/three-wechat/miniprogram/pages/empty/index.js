// miniprogram/pages/memory/index.js
Page({
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '/pages/index/index',
    // })
  },

  goto() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  gotoOther() {
    wx.navigateTo({
      url: '/pages/index-copy/index-copy',
    })
  },

  onShareAppMessage() { }
})