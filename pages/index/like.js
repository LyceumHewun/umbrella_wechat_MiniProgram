// pages/index/like.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 3
    })

    let that = this
    // 拉取数据
    Ajax.get({
      url: 'tweets/getMyLikeTweets',
      success({ data }) {
        that.setData({
          data
        })
      },
      fail({ msg }) {
        Toast.fail(msg)
      }
    })
  }
})