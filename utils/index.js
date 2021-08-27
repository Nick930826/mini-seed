/**
 * utils
 * Created by yunsheng on 2021/1/27
 **/
import dayjs from 'dayjs'
import './zh-cn'

dayjs.locale('zh-cn')

function getUrl (url, query) {
  let _url = url
  const _q = []
  if (query) {
    _url += '?'
    Object.keys(query)
      .forEach(key => {
        let value = query[key]
        if (value === null || typeof value === 'undefined') {
          value = ''
        }
        _q.push(`${key}=${value}`)
      })
  }
  return _url + _q.join('&')
}

const accountInfo = wx.getAccountInfoSync()
const envVersion = accountInfo.miniProgram.envVersion

const baseUrl = envVersion === 'release' ? 'https://lapi.llxzl.com' : 'https://api-lottery-ll.beta.wxb.com'
// const baseUrl = 'https://lapi.llxzl.com'

let fanId = 0

function get (path, params = {}, config = {}) {
  const { silent, showLoading, baseUrl: _baseUrl } = config

  return new Promise((resolve, reject) => {
    if (!fanId) {
      setTimeout(() => {
        get(path, params, config)
          .then(res => resolve(res))
          .catch(err => reject(err))
      }, 1000)
    } else {
      showLoading && wx.showLoading({ title: '加载中...' })
      wx.request({
        url: getUrl((_baseUrl || baseUrl) + path, {
          ...params,
          // --------------------
          fan_id: fanId,
          timestamp: Date.now()
        }),
        success ({ data }) {
          console.log('request response::::::::', path, params, data)
          if (data.errcode) {
            if (data.errcode === 401) {
              wx.navigateTo({ url: '/pages/auth/index' })
              reject(data)
              return
            }
            if (!silent) {
              wx.showToast({ title: data.message, icon: 'none' })
            }
            reject(data)
          }
          resolve(data)
        },
        fail (err) {
          // 请求出错 / 超时
          console.error(err)
          if (err.errMsg.includes('timeout')) {
            wx.showToast({ title: '您当前的网络环境不稳定，请稍后重试', icon: 'none' })
          }
        },
        complete () {
          showLoading && wx.hideLoading()
        }
      })
    }
  })
}

function post (path, params, config = {}) {
  const { silent, showLoading, baseUrl: _baseUrl, json } = config

  return new Promise((resolve, reject) => {
    if (!fanId && path !== '/fan/login') {
      setTimeout(() => {
        post(path, params, config)
          .then(res => resolve(res))
          .catch(err => reject(err))
      }, 1000)
    } else {
      showLoading && wx.showLoading({ title: '加载中...' })
      wx.request({
        url: getUrl((_baseUrl || baseUrl) + path, {
          // post请求提取部分公共参数放在url上
          plan_id: params.plan_id,
          room_wxid: params.room_wxid,
          user_id: params.user_id,
          sub_user_id: params.sub_user_id,
          // ----------------------------
          fan_id: fanId,
          timestamp: Date.now()
        }),
        method: 'POST',
        header: {
          'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: params,
        success ({ data }) {
          console.log('request response::::::::', path, params, data)
          if (data.errcode) {
            if (data.errcode === 401) {
              wx.navigateTo({ url: '/pages/auth/index' })
              reject(data)
              return
            }
            if (!silent) {
              wx.showToast({ title: data.message, icon: 'none' })
            }
            reject(data)
          }
          resolve(data)
        },
        fail (err) {
          // 请求出错 / 超时
          console.error(err)
          if (err.errMsg.includes('timeout')) {
            wx.showToast({ title: '您当前的网络环境不稳定，请稍后重试', icon: 'none' })
          }
        },
        complete () {
          showLoading && wx.hideLoading()
        }
      })
    }
  })
}

function upload (params, config = {}) {
  const { silent, showLoading, baseUrl: _baseUrl } = config

  return new Promise((resolve, reject) => {
    if (!fanId) {
      setTimeout(() => {
        upload(params, config)
          .then(res => resolve(res))
          .catch(err => reject(err))
      }, 1000)
    } else {
      showLoading && wx.showLoading({ title: '上传中...' })
      wx.uploadFile({
        url: getUrl((_baseUrl || baseUrl) + '/jifen/upload', {
          // post请求提取部分公共参数放在url上
          plan_id: params.plan_id,
          room_wxid: params.room_wxid,
          user_id: params.user_id,
          sub_user_id: params.sub_user_id,
          // ----------------------------
          fan_id: fanId,
          timestamp: Date.now()
        }),
        filePath: params.filePath,
        name: params.name || 'file',
        success ({ data: _data }) {
          const data = JSON.parse(_data)
          console.log('request response::::::::', params, data)
          if (data.errcode) {
            if (data.errcode === 401) {
              wx.navigateTo({ url: '/pages/auth/index' })
              reject(data)
              return
            }
            if (!silent) {
              wx.showToast({ title: data.message, icon: 'none' })
            }
            reject(data)
          }
          resolve(data)
        },
        fail (err) {
          // 请求出错 / 超时
          console.error(err)
          if (err.errMsg.includes('timeout')) {
            wx.showToast({ title: '您当前的网络环境不稳定，请稍后重试', icon: 'none' })
          }
        },
        complete () {
          showLoading && wx.hideLoading()
        }
      })
    }
  })
}

/**
 * 页面用到的时间选项
 * @return {({value: *|string, universal: *|string}[]|{value: string, universal: string}[]|{value: string, universal: string}[])[]}
 */
function dateTimeOptionsGenerator () {
  const dateList = [...Array(60).keys()].map(addDays => {
    const date = dayjs().add(addDays, 'day')
    const obj = {
      value: date.format('M月D日 周dd'), // picker会用到这个
      universal: date.format('YYYY-MM-DD') // 前后端交流通用表达形式
    }

    if (addDays === 0) {
      obj.value = '今天'
    } else if (addDays === 1) {
      obj.value = date.format('M月D日 明天')
    } else if (addDays === 2) {
      obj.value = date.format('M月D日 后天')
    }

    return obj
  })
  const hourList = [...Array(24).keys()].map(hour => ({
    value: `${hour}时`,
    universal: `0${hour}`.slice(-2)
  }))
  const minuteList = [...Array(60).keys()].map(minute => ({
    value: `${minute}分`,
    universal: `0${minute}`.slice(-2)
  }))

  return [dateList, hourList, minuteList]
}

const dateTimeOptions = dateTimeOptionsGenerator()

module.exports = {
  envVersion,
  get,
  post,
  upload,
  setFanId: (id) => {
    fanId = id
  },
  dateTimeOptionsGenerator,
  dateTimeOptions // 在打开小程序是生成一组时间选项，建议全局使用这组时间选项，picker使用这组时间
}
