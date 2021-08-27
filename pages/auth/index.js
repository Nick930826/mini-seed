import { post } from '../../utils/index'

Page({
  data: {},
  onLoad: function (options) {

  },
  handleGetUserInfo() {
    wx.getUserProfile({ desc: '使用群任务助理' })
      .then(({ userInfo }) => {
          return post('/fan/putUserInfo', { ...userInfo })
      })
      .then(res => {
        wx.navigateBack()
      })
  }
});
