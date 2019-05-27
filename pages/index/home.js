// pages/index/home.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { Storage } from '../../utils/storage.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 没有更多内容提示
    // 显示时设置为 "200rpx"
    noMoreContentTips: "0"
  },

  onLoad() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTabBar().setData({
      selected: 0
    })

    let that = this
    // 拉取信息
    Ajax.get({
      url: 'tweets/getHomeTweets',
      success({ data }) {
        console.log(data)
        that.setData({
          data
        })
      },
      fail({ msg }) {
        Toast.fail(msg)
      }
    })
  },

  /**
   * 分享
   */
  onShareAppMessage({ target }) {
    console.log(target)
    let imageUrl = target.dataset.photo
    let tweetsId = target.id
    return {
      path: 'pages/tweets/index?id=' + tweetsId,
      imageUrl
    }
  }
})