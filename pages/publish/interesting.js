// pages/publish/interesting.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { ImageUtil } from '../../utils/qiniu.js'

var content = ""
var hiddenContent = ""
var giftQuantity = ""
var giftTotalAmount = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasGift: false,
    money: 99,
    showPayment: false,
    // 清空红包两个输入框
    giftinput: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let photos = options.tempFilePaths.split(",")
    this.setData({
      photos
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 点击红包按钮
   */
  changePermissionType({ detail }) {
    if (!detail.value) {
      giftQuantity = ""
      giftTotalAmount = ""
      this.setData({
        giftinput: ""
      })
    }
    this.setData({
      hasGift: detail.value
    })
  },

  /**
   * 监听‘说说这张照片’
   */
  bindinput({ detail }) {
    content = detail.value
  },

  /**
   * 监听‘隐藏消息’
   */
  hiddenContentInput({ detail }) {
    hiddenContent = detail.value
  },

  /**
   * 监听红包‘数量’
   */
  giftQuantityInput({ detail }) {
    giftQuantity = detail.value
  },

  /**
   * 监听红包‘总金额’
   */
  giftTotalAmountInput({ detail }) {
    giftTotalAmount = detail.value
  },

  /**
   * 点击发布按钮
   */
  clickPublish() {
    let hasGift = this.data.hasGift
    let photos = this.data.photos
    let that = this

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)

        ImageUtil.upload({
          filePath: photos[0],
          success(key) {
            Ajax.post({
              url: 'interesting/tweets/publishInterestingTweets',
              showLoading: true,
              data: {
                content,
                hiddenContent,
                giftQuantity,
                giftTotalAmount,
                hasGift,
                latitude: res.latitude,
                longitude: res.longitude,
                picturesList: new Array(key)
              },
              success({ data }) {
                console.log(data)
                wx.redirectTo({
                  url: '/pages/tweets/index?id=' + data.id
                })
              },
              fail({ code, msg }) {
                Toast.fail(msg)
                console.log(code)
                if (code === 10002) {
                  that.setData({
                    showPayment: true,
                    money: giftTotalAmount
                  })
                }
              }
            })
          }
        })
      },
      fail() {
        Toast.fail('获取定位失败')
      }
    })
  },

  /**
   * 点击支付按钮
   * 
   * 支付完要继续执行 this.clickPublish()
   */
  clickPayment({ detail: { money }}) {
    console.log(money)
    let that = this

    wx.login({
      success({ code }) {
        Ajax.post({
          url: 'pay/wechatUnifiedorder',
          showLoading: true,
          data: {
            code,
            money
          },
          success({ data }) {
            console.log(data)

            wx.showLoading({
              title: '支付中...',
              mask: true
            })

            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              paySign: data.paySign,
              signType: data.signType,
              success(res) {
                console.log(res)
                wx.hideLoading()
                that.setData({
                  showPayment: false
                })
                // 返回服务器消息
                Ajax.get({
                  url: 'pay/add',
                  showLoading: true,
                  data: {
                    money
                  },
                  success() {
                    that.clickPublish()
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})