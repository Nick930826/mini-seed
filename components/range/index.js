// component/zyslider/zyslider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** slider 最小值 */
    min: {
      type: Number
    },
    /** slider 最大值 */
    max: {
      type: Number
    },
    /** 预选选择的小值 */
    minValue: {
      type: Number
    },
    /** 预选选择的大值 */
    maxValue: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    min: 1,
    max: 500,
    leftValue: 1,
    rightValue: 500,
    totalLength: 0,
    bigLength: 0,
    ratio: 0.5,
    sliderLength: 40,
    containerLeft: 0, // 标识整个组件，距离屏幕左边的距离
    hideOption: '' // 初始状态为显示组件
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      const _this = this
      const { windowWidth } = wx.getSystemInfoSync()
      this.setData({ ratio: windowWidth / 750 })

      wx.createSelectorQuery().in(this)
        .select('#range_container')
        .boundingClientRect(function ({ width, left }) {
          _this.setData({
            totalLength: width / _this.data.ratio - _this.data.sliderLength,
            bigLength: width / _this.data.ratio - _this.data.sliderLength * 2,
            rightValue: width / _this.data.ratio - _this.data.sliderLength,
            containerLeft: left / _this.data.ratio
          })

          /**
           * 设置初始滑块位置
           */
          _this._propertyLeftValueChange()
          _this._propertyRightValueChange()
        })
        .exec()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    /**
    * 设置左边滑块的值
    */
    _propertyLeftValueChange: function () {
      const minValue = this.data.minValue / this.data.max * this.data.bigLength
      const min = this.data.min / this.data.max * this.data.bigLength
      this.setData({ leftValue: minValue - min })
    },

    /**
     * 设置右边滑块的值
     */
    _propertyRightValueChange: function () {
      const right = this.data.maxValue / this.data.max * this.data.bigLength + this.data.sliderLength
      this.setData({ rightValue: right })
    },

    /**
     * 左边滑块滑动
     */
    _minMove: function (e) {
      let pageX = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2

      if (pageX + this.data.sliderLength >= this.data.rightValue) {
        pageX = this.data.rightValue - this.data.sliderLength
      } else if (pageX <= 0) {
        pageX = 0
      }

      this.setData({
        leftValue: pageX
      })

      const value = parseInt(pageX / this.data.bigLength * parseInt(this.data.max - this.data.min) + this.data.min)
      this.triggerEvent('change', { min: value })
    },

    /**
     * 右边滑块滑动
     */
    _maxMove: function (e) {
      let pageX = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2
      if (pageX <= this.data.leftValue + this.data.sliderLength) {
        pageX = this.data.leftValue + this.data.sliderLength
      } else if (pageX >= this.data.totalLength) {
        pageX = this.data.totalLength
      }

      this.setData({
        rightValue: pageX
      })

      pageX = pageX - this.data.sliderLength
      const value = parseInt(pageX / this.data.bigLength * (this.data.max - this.data.min) + this.data.min)

      this.triggerEvent('change', { max: value })
    },

    /**
     * 隐藏组件
     */
    hide: function () {
      this.setData({
        hideOption: 'hide'
      })
    },
    /**
     * 显示组件
     */
    show: function () {
      this.setData({
        hideOption: ''
      })
    },
    /**
    * 重置
    */
    reset: function () {
      this.setData({
        rightValue: this.data.totalLength,
        leftValue: 0
      })
    }
  }
})
