// pages/tweets/index.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { Storage } from '../../utils/storage.js'
import { ImageUtil } from '../../utils/qiniu.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 固定评论输入框
    fixCommentInput: false,
    avatarUrl: "",
    commentId: null,
    comment: ""
  },

  onLoad(options) {
    init()
    let clickComment = options.clickComment
    if (clickComment) {
      pageScrollToCommentInput()
    }
    let that = this
    let id = options.id
    console.log("tweetsId: " + id)
    if (id) {
      Ajax.get({
        url: 'tweets/getTweets',
        data: {
          id
        },
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

      // 拉取评论
      Ajax.get({
        url: 'comment/getComments',
        data: {
          tweetsId: id
        },
        success({ data }) {
          console.log(data)
          that.setData({
            commentList: data
          })
        }
      })
    }


    // 等待图片加载
    
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
  },

  onShow() {
    let avatarUrl = Storage.user().avatarUrl
    this.setData({
      avatarUrl
    })
  },

  /**
   * 监听页面滚动
   */
  onPageScroll({
    scrollTop
  }) {
    let fixCommentInput = this.data.fixCommentInput
    if (!fixCommentInput && commentInputTop <= scrollTop) {
      this.setData({
        fixCommentInput: !fixCommentInput
      })
    } else if (fixCommentInput && commentInputTop > scrollTop) {
      this.setData({
        fixCommentInput: !fixCommentInput
      })
    }
  },

  /**
   * <ly-card/> 绑定事件
   * 点击评论图标
   */
  clickComment() {
    // 移动到评论输入框
    wx.pageScrollTo({
      scrollTop: commentInputTop,
      duration: 0
    })
    // 获取评论输入框焦点
    this.setData({
      commentInputFocus: true
    })
  },

  /**
   * 点赞推文
   */
  clickLike() {
    reacquireCommentInputTop()
  },

  /**
   * 图片加载完成
   */
  imageLoad({ detail }) {
    wx.hideLoading()
    console.log(detail.detail.height)
    if (commentInputTop < detail.detail.height) {
      reacquireCommentInputTop()
    }
  },

  /**
   * 点击键盘右下角
   * 发送评论
   */
  bindconfirm({ detail }) {
    let value = detail.value
    let id = this.data.data.id
    let commentId = this.data.commentId
    let that = this
    Ajax.post({
      url: 'comment/publishComment',
      showLoading: true,
      data: {
        tweetsId: id,
        commentId,
        content: value
      },
      success() {
        Toast.success('发表成功')
        that.setData({
          comment: ""
        })
        // 拉取评论
        Ajax.get({
          url: 'comment/getComments',
          data: {
            tweetsId: id
          },
          success({ data }) {
            console.log(data)
            that.setData({
              commentList: data
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
   * 点击评论的回复按钮
   */
  clickCommentReply({ detail }) {
    let comment = detail.comment
    console.log(comment)

    this.setData({
      commentId: comment.id,
      comment: '@' + comment.username + ' ',
      commentInputFocus: true
    })
  },

  /**
   * 输入评论
   */
  inputComment({ detail }) {
    let value = detail.value
    if (value === "") {
      this.setData({
        commentId: null
      })
    }
  },

  /**
   * 分享
   */
  onShareAppMessage(res) {
    let photos = this.data.data.picturesList
    let tweetsId = this.data.data.id
    return {
      path: 'pages/tweets/index?id=' + tweetsId,
      imageUrl: photos[0]
    }
  },

  /**
   * 点击趣图模式的相机图标
   * 参加互动
   */
  clickCamera() {
    let that = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        wx.getLocation({
          type: 'gcj02',
          success(res) {
            console.log(res)

            ImageUtil.upload({
              filePath: tempFilePaths[0],
              success(key) {
                Ajax.post({
                  url: 'interesting/tweets/checkInterestingTweets',
                  showLoading: true,
                  data: {
                    tweetsId: that.data.data.id,
                    latitude: res.latitude,
                    longitude: res.longitude,
                    picturesList: new Array(key)
                  },
                  success({ data }) {
                    console.log(data)
                    let hiddenConent = data.hiddenConent
                    let gotMoney = data.gotMoney
                    if (gotMoney) {
                      Toast.success('获得红包' + gotMoney + '元')
                    } else {
                      Toast.success(hiddenConent + '')
                    }

                    that.setData({
                      interesting: data
                    })
                  },
                  fail({ msg }) {
                    Toast.fail(msg)
                  }
                })
              }
            })
          },
          fail() {
            Toast.fail('获取定位失败')
          }
        })

      }
    })
  }
})

/**
 * 评论输入框位置
 */
var commentInputTop = 0
/**
 * ly-card高度
 */
var lyCardHeight = 0

/**
 * 初始化参数
 */
var init = () => {
  // 获取评论输入框位置
  wx.createSelectorQuery().select(".comment-input").fields({
    rect: true
  }, (result) => {
    commentInputTop = result.top
  }).exec()
  // 记录ly-card高度
  wx.createSelectorQuery().select("#ly-card").boundingClientRect(
    (result) => {
      lyCardHeight = result.height
    }
  ).exec()
}

/**
 * onLoad的时候调用
 * 移动到评论输入框
 */
var pageScrollToCommentInput = () => {
  // 获取评论输入框的位置
  wx.createSelectorQuery().select(".comment-input").fields({
    rect: true
  }, (result) => {
    commentInputTop = result.top
    // 移动到评论输入框的位置
    wx.pageScrollTo({
      scrollTop: commentInputTop,
      duration: 0
    })
  }).exec()
}

/**
 * 重新获取评论输入框的位置
 */
var reacquireCommentInputTop = () => {
  // 延时500毫秒 不然有bug, 因为点击动画有延时, wxml不会立即改变
  setTimeout(
    () => {
      wx.createSelectorQuery().select("#ly-card").boundingClientRect(
        (result) => {
          let lyCardHeightTemp = result.height
          console.log(commentInputTop)
          console.log(lyCardHeight)
          console.log(lyCardHeightTemp)
          commentInputTop = commentInputTop - (lyCardHeight - lyCardHeightTemp)
          console.log(commentInputTop)
          console.log("---")
          lyCardHeight = lyCardHeightTemp
        }
      ).exec()
    }, 350
  )
}