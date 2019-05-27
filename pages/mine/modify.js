// pages/mine/modify.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { Storage } from '../../utils/storage.js'
import { ImageUtil } from '../../utils/qiniu.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = Storage.user()
    console.log(user)
    this.setData({
      username: user.username,
      avatarUrl: user.avatarUrl,
      avatarUrlTemp: user.avatarUrl,
      introduction: user.introduction,
      introductionTemp: user.introduction,
      website: user.website,
      websiteTemp: user.website
    })
  },

  clickImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.setData({
          avatarUrl: res.tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 自我介绍输入
   */
  introductionInput({ detail: { value } }) {
    this.setData({
      introduction: value
    })
  },

  /**
   * 个人网站输入 
   */
  websiteInput({ detail: { value } }) {
    this.setData({
      website: value
    })
  },

  /**
   * 点击'继续'按钮
   */
  clickButton() {
    let introduction = this.data.introduction
    let introductionTemp = this.data.introductionTemp
    let website = this.data.website
    let websiteTemp = this.data.websiteTemp
    let avatarUrl = this.data.avatarUrl
    let avatarUrlTemp = this.data.avatarUrlTemp

    if (introduction !== introductionTemp || website !== websiteTemp || avatarUrl != avatarUrlTemp) {
      
      if (avatarUrl != avatarUrlTemp) {

        wx.showLoading({
          title: 'Loading...',
        })

        // 上传图片
        ImageUtil.upload({
          filePath: avatarUrl,
          success(key) {
            Ajax.post({
              url: 'user/updateUserInfo',
              showLoading: true,
              data: {
                introduction,
                website,
                avatar: key
              },
              success() {
                // 跳转
                wx.reLaunch({
                  url: '/pages/index/mine'
                })
              },
              fail({ msg }) {
                Toast.fail(msg)
              }
            })
          }
        })
      } else {
        // 不用修改图片
        Ajax.post({
          url: 'user/updateUserInfo',
          showLoading: true,
          data: {
            introduction,
            website
          },
          success() {
            // 跳转
            wx.reLaunch({
              url: '/pages/index/mine'
            })
          },
          fail({ msg }) {
            Toast.fail(msg)
          }
        })
      }
    }
  }
})