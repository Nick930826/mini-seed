Component({
  properties: {
    tabs: {
      type: Array, // [{value: '分类', prop: data}, ...]
    },
    activeTab: {
      type: Number,
      value: 0
    }
  },
  data: {},
  methods: {
    _handleClick({ currentTarget }) {
      const index = currentTarget.dataset.index
      if (this.data.activeTab === index) return
      this.triggerEvent('change', {
        index,
        tab: this.data.tabs[index]
      })
    }
  }
});
