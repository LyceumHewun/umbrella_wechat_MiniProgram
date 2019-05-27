import { Toast } from 'tips.js'
import { Storage } from 'storage.js'

// const host = 'http://127.0.0.1:9527/'
const host = 'https://api.umbralle.douyait.com/'

/**
 * 请求类
 */
class Request {
  constructor({ url, data, method }) {
    this.url = host + url
    this.data = data
    // GET POST
    this.method = method
  }

  execute({ 
    success = () => {}, 
    fail = () => {},  
    complete = () => {}, 
    showLoading = false
    }) {
    if (showLoading) {
      wx.showLoading({
        title: 'Loading...',
      })
    }
    let url = this.url
    let data = this.data
    let method = this.method
    wx.request({
      url,
      data,
      header: {
        "cookie": Storage.cookies()
      },
      method,
      fail({ errMsg }) {
        // 检查网络连接
        wx.getNetworkType({
          success({ networkType }) {
            if (networkType === 'none') {
              Toast.fail('网络连接不可用, 请稍后再试')
            } else if (errMsg.includes('request:fail')) {
              Toast.fail('连接服务器失败')
            }
          }
        })
      },
      complete(res) {
        wx.hideLoading()
        if (res.statusCode === 403) {
          // 请登录
          wx.navigateTo({
            url: '/pages/account/signin'
          })
        } else {
          new Response(res.data)
            .success(success)
            .fail(fail)
            .complete(complete)
        }
      }
    }).onHeadersReceived((res) => {
      // 有bug 只要有新cookie就会重置所有缓存的cookie
      if (res.header["Set-Cookie"] !== undefined){
        Storage.cookies(res.header["Set-Cookie"])
      }
    })
  }
}


/**
 * 响应类
 */
class Response {
  /**
   * 构造函数
   */
  constructor({ code, msg, data }) {
    this.code = code
    this.msg = msg
    this.data = data
    this.body = {
      code,
      msg,
      data
    }
  }

  success(method) {
    if (this.code === 0) {
      method(this.body)
    }
    return this
  }

  fail(method) {
    if (this.code !== 0) {
      method(this.body)
      console.error(this.msg)
    }
    return this
  }

  complete(method) {
    method(this.body)
    return this
  }
}

var Ajax = {
  post({ url, data, success, fail, complete, showLoading }) {
    return new Request({
      url,
      data,
      method: "POST"
    }).execute({ success, fail, complete, showLoading })
  },

  get({ url, data, success, fail, complete, showLoading }) {
    return new Request({
      url,
      data,
      method: "GET"
    }).execute({ success, fail, complete, showLoading })
  }
}

export {
  Ajax
}