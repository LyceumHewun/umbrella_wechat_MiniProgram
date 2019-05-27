// pages/index/square.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: 0
  },

  onLoad() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 1
    })


    let that = this
    // 拉取数据
    Ajax.get({
      url: 'tweets/getSquareTweets',
      success({ data }) {
        console.log(data)
        that.setData({
          data
        })
      }
    })
  },

  click1() {
    this.setData({
      container: 0
    })
  },

  click2() {
    this.setData({
      container: 1
    })
  }
})