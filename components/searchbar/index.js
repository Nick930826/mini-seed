Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索'
    },
    value: {
      type: String
    }
  },
  data: {
    _value: null,
    _focused: false
  },
  methods: {
    _handleInput({ detail }) {
      this.setData({ _value: detail.value });
    },
    _handleFocus() {
      this.setData({ _focused: true });
    },
    _handleBlur() {
      this.setData({ _focused: false });
    },
    _handleSearch() {
      this.triggerEvent('search', { value: this.data._value })
    },
    _handleClear() {
      this.triggerEvent('search', { value: '' })
    }
  },
  observers: {
    value(value) {
      this.setData({ _value: value })
    }
  }
});
