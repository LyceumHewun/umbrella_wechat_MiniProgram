// pages/account/signup.js
import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    errortips: "",
    // css
    phoneInputBorder: "",
    usernameInputBorder: "",
    passInputBorder1: "",
    passInputBorder2: "",
    password: "",
    // 表单信息
    phone: "",
    username: "",
    password: ""
  },

  /**
  * 点击获取手机号码
  */
  getPhoneNumber({ detail }) {
    // 传回服务器解密
    console.log(detail)
    
    let that = this
    Ajax.post({
      url: 'user/wechat/getPhone',
      showLoading: true,
      data: {
        encryptedData: detail.encryptedData,
        iv: detail.iv
      },
      success({ data }) {
        that.setData({
          phone: data
        })
        // 检验手机号码是否已被注册
        Ajax.get({
          url: 'user/phoneIsExist',
          data: {
            phone: data
          },
          success() {
            that.setData({
              errortips: "",
              phoneInputBorder: "success-border",
              phone: data
            })
          },
          fail() {
            that.setData({
              errortips: "该手机号已被注册",
              phoneInputBorder: "error-border"
            })
          }
        })
      },
      fail({ msg }) {
        Toast.fail(msg)
      }
    })
  },

  /**
   * 输入用户名
   */
  inputUsername({ detail }) {
    let value = detail.value
    let that = this
    if (value.length < 2) {
      that.setData({
        errortips: "用户名不少于2个字符",
        usernameInputBorder: "error-border"
      })
    } else {
      Ajax.get({
        url: 'user/usernameIsExist',
        data: {
          username: value
        },
        success() {
          that.setData({
            errortips: "",
            usernameInputBorder: "success-border",
            username: value
          })
        },
        fail() {
          that.setData({
            errortips: "该用户名已被使用",
            usernameInputBorder: "error-border"
          })
        }
      })
    }
  },

  /**
   * 输入密码1
   */
  inputpass1({ detail }) {
    let value = detail.value
    if (value.length < 8) {
      this.setData({
        errortips: "密码不少于8位数",
        passInputBorder1: "error-border"
      })
    } else {
      this.setData({
        errortips: "",
        passInputBorder1: "success-border",
        passwordTemp: value
      })
    }
  },

  /**
   * 输入密码2
   */
  inputpass2({ detail }) {
    let value = detail.value
    let passwordTemp = this.data.passwordTemp
    if (passwordTemp === value) {
      this.setData({
        errortips: "",
        passInputBorder2: "success-border",
        password: value
      })
    } else {
      this.setData({
        errortips: "两次输入的密码不一致",
        passInputBorder2: "error-border"
      })
    }
  },

  /**
   * 点击注册按钮
   */
  clickSignupButton() {
    let phone = this.data.phone
    let username = this.data.username
    let password = this.data.password
    if (phone === "") {
      this.setData({
        errortips: "手机号码不能空",
        phoneInputBorder: "error-border"
      })
    } else if (username === "") {
      this.setData({
        errortips: "用户名不能空",
        usernameInputBorder: "error-border"
      })
    } else if (password === "") {
      this.setData({
        errortips: "密码不能空",
        passInputBorder1: "error-border",
        passInputBorder2: "error-border"
      })
    } else {
      // 校验完毕
      Ajax.post({
        url: 'user/signup',
        showLoading: true,
        data: {
          phone,
          username,
          password
        },
        success(res) {
          console.log(res)
          wx.reLaunch({
            url: '/pages/account/addinfo?username=' + username
          })
        },
        fail({ msg }) {
          Toast.fail(msg)
        }
      })
    }
   }
})