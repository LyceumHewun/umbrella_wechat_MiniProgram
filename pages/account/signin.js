// pages/account/signin.js
import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 表单数据
    account: "",
    password: "",
    // css
    accountInputBorder: "",
    passwordInputBorder: "",
    errortips: ""
  },

  gotoSignup() {
    wx.navigateTo({
      url: '/pages/account/signup'
    })
  },

  /**
   * 点击微信登录
   */
  wechatLogin({ detail }) {
    // 要先登录 再获取
    // 先 wx.login 再 wx.getUserInfo
    // 不然会造成解码和编码的sessionkey不同
    // 所以button 的open-type getUserInfo的数据不使用


    wx.showLoading({
      title: 'Loading..'
    })    

    wx.login({
      success({ code }) {
        console.log(code)
        wx.getUserInfo({
          success(res) {
            console.log(res)
            Ajax.post({
              url: 'login/wechat/login',
              showLoading: true,
              data: {
                code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                rawData: res.rawData,
                signature: res.signature
              },
              success(res) {
                wx.switchTab({
                  url: '/pages/index/mine'
                })
              },
              fail(res) {
                if (res.code === 10001) {
                  wx.navigateTo({
                    url: '/pages/account/signup',
                    success() {
                      Toast.warn(res.msg)
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  /**
   * 点击登录
   */
  clickLogin() {
    let account = this.data.account
    let password = this.data.password
    let that = this
    Ajax.post({
      url: 'login/unifiedLogin',
      showLoading: true,
      data: {
        account,
        password
      },
      success(res) {
        wx.switchTab({
          url: '/pages/index/mine',
        })
      },
      fail({ msg }) {
        that.setData({
          passwordInputBorder: "error-border",
          accountInputBorder: "error-border",
          errortips: msg
        })
      }
    })
  },

  /**
   * 密码框输入监听
   */
  accountInput({ detail }) {
    let value = detail.value
    this.setData({
      account: value
    })
  },

  /**
   * 账号输入监听
   */
  passwordInput({ detail }) {
    let value = detail.value
    this.setData({
      password: value
    })
  }
})