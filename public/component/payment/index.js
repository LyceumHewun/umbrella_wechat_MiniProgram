Component({

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    payment: {
      type: Boolean,
      value: false
    },
    money: {
      type: String,
      value: '0.00'
    }
  },

  methods: {
    /**
     * 点击蒙板
     */
    clickMask() {
      this.setData({
        show: false
      })
    },

    clickButton() {
      let money = this.data.money
      this.triggerEvent('clickButton', { money }, {})
    }
  }
})