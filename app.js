/**
 * Description
 * Created by yunsheng on 2021/3/16
**/
import { get, post, setFanId } from "./utils/index";

App({
  onLaunch (options) {
    // Do something initial when launch.
    const { query = {} } = options

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    // 给promise添加 finally方法
    Promise.prototype.finally = function(callback) {
      return this.then(
        value => Promise.resolve(callback()).then(() => value),
        reason => Promise.resolve(callback()).then(() => { throw reason })
      )
    }
    /**
     * 进入小程序调用一次login接口得到code
     * 登陆小程序接口获取fan_id并设置到全局后续请求中
     */
    const scene = decodeURIComponent(query.scene || '')
    wx.login()
      .then(({ code }) => {
        return post('/fan/login', { code })
      })
      .then((res) => {
        setFanId(res.data.fan_id)
        return get('/jifen/getMemberInfo', {
          user_id: scene.split(',').length === 2 ? scene.split(',')[0] : '',
          sub_user_id: scene.split(',').length === 2 ? scene.split(',')[1] : ''
        })
      })
      .then(({ data }) => {
        if (data.room_admin && data.permission && data.permission.jifen_task) {
          // 管理员tab完全显示
          // this.globalData.tabBarList = [0, 1, 2]
        }
        this.globalData.launching = false;
      })
      .catch(e => {
        console.error(e);
      })
  },
  onShow (options) {
    // Do something when show.
  },
  onHide () {
    // Do something when hide.
  },
  onError (msg) {
    console.error(msg)
  },
  globalData: {
    launching: true, // 初始化中
    reloadCfg: { // 有些页面跳转需要目标页刷新数据
      enable: false,
      options: null
    },
    createData: null, // 跳页面时暂时保存创建数据
  }
})
