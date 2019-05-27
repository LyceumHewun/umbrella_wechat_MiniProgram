// pages/mine/index.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { Storage } from '../../utils/storage.js'

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
    let myUserInfo = Storage.user()
    this.setData({
      myUserInfo
    })

    console.log(options)
    let userId = options.userId

    let that = this
    // 拉取数据
    Ajax.get({
      url: 'user/getOtherUserInfo',
      data: {
        userId
      },
      success({ data }) {
        that.setData({
          userInfo: data
        })
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
      },
      fail({ msg }) {
        Toast.fail(msg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 点击关注
   */
  clickFollowing() {
    let followingUserId = this.data.userInfo.id
    let userInfo = this.data.userInfo
    let that = this
    Ajax.post({
      url: 'follow/followingUser',
      showLoading: true,
      data: {
        followingUserId
      },
      success() {
        userInfo.isFollowing = true
        that.setData({
          userInfo
        })
        // 刷新其他信息
        Ajax.get({
          url: 'user/getUserOtherInfo',
          data: {
            userId: followingUserId
          },
          success({ data }) {
            that.setData({
              userOtherInfo: data
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
   * 点击已关注（取消关注）
   */
  clickUnfollowing() {
    let followingUserId = this.data.userInfo.id
    let userInfo = this.data.userInfo
    let that = this
    Ajax.post({
      url: 'follow/unFollowingUser',
      showLoading: true,
      data: {
        followingUserId
      },
      success() {
        userInfo.isFollowing = false
        that.setData({
          userInfo
        })
        // 刷新其他信息
        Ajax.get({
          url: 'user/getUserOtherInfo',
          data: {
            userId: followingUserId
          },
          success({ data }) {
            that.setData({
              userOtherInfo: data
            })
          }
        })
      },
      fail({ msg }) {
        Toast.fail(msg)
      }
    })
  }
})