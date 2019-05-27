// pages/index/mine.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { Storage } from '../../utils/storage.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletBackgroud: 120,
    tweetsList: [],
    container: 0
  },

  onLoad() {
    // 钱包背景动画
    let that = this
    setInterval(()=> {
      let deg = that.data.walletBackgroud + 3
      if(deg >= 360) {
        deg = 0
      }
      that.setData({
        walletBackgroud: deg
      })
    }, 200)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 4
    })

    let that = this
    // 拉取数据
    Ajax.get({
      url: 'user/getMyUserInfo',
      success({ data }) {
        that.setData({
          userInfo: data
        })
        // 保存用户信息
        Storage.user(data)
        let userId = data.id
        // 其他信息
        Ajax.get({
          url: 'user/getUserOtherInfo',
          data: {
            userId
          },
          success({ data }) {
            that.setData({
              userOtherInfo: data
            })
            // 该用户的推文
            Ajax.get({
              url: 'tweets/getTweetsListByUserId',
              data: {
                userId
              },
              success({ data }) {
                that.setData({
                  tweetsList: data
                })
              }
            })
          }
        })
      }
    })
    
  },

  /**
   * 点击钱包
   */
  clickWallet() {
    wx.navigateTo({
      url: '/pages/wallet/index'
    })
  },

  /**
   * 点击粉丝
   */
  clickFollower() {
    
  },

  /**
   * 点击已关注
   */
  clickFollowing() {

  },
  
  /**
   * 点击编辑资料
   */
  clickModifyUserInfo() {
    wx.navigateTo({
      url: '/pages/mine/modify'
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