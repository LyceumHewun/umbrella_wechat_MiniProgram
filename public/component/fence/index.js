Component({

  properties: {
    picturesList: {
      type: Array,
      value: []
    }
  },

  methods: {
    clickPhoto({ target }) {
      wx.navigateTo({
        url: "/pages/tweets/index?id=" + target.id
      })
    }
  }
})