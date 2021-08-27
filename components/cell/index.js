Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    style: {
      type: String
    },
    label: { // label 字段
      type: String,
      value: null
    },
    tooltip: { // 是否有第二行提示
      type: String,
      value: null
    },
    isRichTooltip: { // 第二行提示是否是富文本内容
      type: Boolean,
      value: false
    },
    border: { // 是否有下边框
      type: Boolean,
      value: true
    },
    hasExtra: { // 是否有右侧额外区域
      type: Boolean,
      value: false
    },
    hasArrow: { // 右箭头，一般与 hasExtra 不会一起出现
      type: Boolean,
      value: false
    }
  },
  data: {},
  methods: {}
});
