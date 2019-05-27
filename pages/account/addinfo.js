// pages/account/addinfo.js
import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { ImageUtil } from '../../utils/qiniu.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    // 用户头像
    avatarUrl: "",
    introduction: "",
    website: ""
  },

  onLoad(options) {
    let username =  options.username
    this.setData({
      username
    })
    let that = this
    wx.getUserInfo({
      success({ userInfo }) {
        that.setData({
          avatarUrl: userInfo.avatarUrl
        })
      }
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
    let website = this.data.website
    let avatarUrl = this.data.avatarUrl

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

  }
})