Component({
  data: {
    choose: 0
  },

  methods: {
    click1() {
      this.setData({
        choose: 0
      })
      this.triggerEvent('click1', {}, {})
    },

    click2() {
      this.setData({
        choose: 1
      })
      this.triggerEvent('click2', {}, {})
    },
  }
})