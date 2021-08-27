import dayjs from 'dayjs'
import { dateTimeOptions } from '../../utils/index'

function getInitData(value, type) {
  if (!value) {
    if (type === 'time') return [0, 0]
    return [0, 0, 0]
  }
  const [dateList, hourList, minuteList] = dateTimeOptions
  if (type === 'time') {
    // 时间模式，传进来的是 HH:mm
    const [hour, minute] = value.split(':')
    const hourIndex = hourList.findIndex(item => item.universal === hour)
    const minuteIndex = minuteList.findIndex(item => item.universal === minute)
    return[hourIndex, minuteIndex]
  }
  // 日期时间模式
  let dateTimeObj = dayjs(value)
  // 如果传进来是10位时间戳，强烈建议传进来也使用13位，因为发生变更后传递出去的是13位
  if (typeof value === 'number' && value.toString().length === 10) {
    dateTimeObj = dayjs(value * 1000)
  }
  const date = dateTimeObj.format('YYYY-MM-DD')
  const hour = dateTimeObj.format('HH')
  const minute = dateTimeObj.format('mm')

  const dateIndex = dateList.findIndex(item => item.universal === date)
  const hourIndex = hourList.findIndex(item => item.universal === hour)
  const minuteIndex = minuteList.findIndex(item => item.universal === minute)
  return [dateIndex, hourIndex, minuteIndex]
}

Component({
  properties: {
    value: {
      type: Number,
      optionalTypes: [String]
    },
    type: {
      type: String,
      value: 'dateTime' // 可选 time 模式
    }
  },
  data: {
    dateTimeOptions,
    _value: [0, 0, 0],
    _show: false
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({ _value: getInitData(this.data.value, this.data.type) });
    },
  },
  methods: {
    _handleChange({ detail }) {
      this.setData({ _value: detail.value })
    },
    /**
     * time 模式提交的是 HH:mm 形式
     * dateTime 模式提交的是13位时间戳
     * @private
     */
    _handleOk() {
      this.setData({ _show: false })
      let value
      if (this.data.type === 'time') {
        value = `${dateTimeOptions[1][this.data._value[0]].universal}:${dateTimeOptions[2][this.data._value[1]].universal}`
      } else {
        value = dayjs(`${dateTimeOptions[0][this.data._value[0]].universal} ${dateTimeOptions[1][this.data._value[1]].universal}:${dateTimeOptions[2][this.data._value[2]].universal}`).unix() * 1000
      }
      this.triggerEvent('ok', { value })
    },
    _handleStopPropagation() {

    },
    _handleCancel() {
      this.setData({ _show: false, _value: getInitData(this.data.value, this.data.type) })
      this.triggerEvent('cancel')
    },
    _handleShow() {
      this.setData({ _show: true })
    }
  },
  observers: {
    value(value) {
      this.setData({ _value: getInitData(value, this.data.type) });
    }
  }
});
