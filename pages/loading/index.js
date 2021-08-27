const app = getApp()

let timer = null

Page({
  data: {},
  onLoad: function (options) {
    this.handleCheckLaunchStatus()
  },
  onHide: function () {
    clearTimeout(timer)
  },
  onUnload: function() {
    clearTimeout(timer)
  },
  handleCheckLaunchStatus() {
    clearTimeout(timer)
    if (app.globalData.launching) {
      setTimeout(this.handleCheckLaunchStatus, 500)
    } else {
      wx.switchTab({ url: '/pages/auth/index' })
    }
  }
});
