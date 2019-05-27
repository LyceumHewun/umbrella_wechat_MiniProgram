// pages/wallet/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletBackgroud: 120,
    showPayment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 钱包背景动画
    let that = this
    setInterval(() => {
      let deg = that.data.walletBackgroud + 6
      if (deg >= 360) {
        deg = 0
      }
      that.setData({
        walletBackgroud: deg
      })
    }, 350)
  },

  /**
   * 点击充值按钮
   */
  clickPayment() {
    this.setData({
      showPayment: true
    })
  }
})