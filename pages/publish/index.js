// pages/publish/index.js

import { Ajax } from '../../utils/request.js'
import { Toast } from '../../utils/tips.js'
import { ImageUtil } from '../../utils/qiniu.js'

var content = ""
var permissionType = 1
var picturesList

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [],
    photoSwiperIndex: 1
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
   * 滑动相册
   */
  swiperPhotoChange(event) {
    let index = event.detail.current
    this.setData({
      photoSwiperIndex: index + 1
    })
  },

  /**
   * 点击相册(查看大图)
   */
  clickPhotoFrame() {
    let photos = this.data.photos
    let index = this.data.photoSwiperIndex - 1
    wx.previewImage({
      urls: photos,
      current: photos[index]
    })
  },

  /**
   * 说说这张图片
   */
  bindinput({ detail }) {
    content = detail.value
  },

  /**
   * 选择仅自己可见
   */
  changePermissionType({ detail }) {
    if (detail.value) {
      permissionType = 3
    } else {
      permissionType = 1
    }
  },

  /**
   * 点击发布按钮
   */
  clickPublish() {
    let photos = this.data.photos
    picturesList = new Array().concat(photos)

    // 用来关闭定时器
    let i = 0

    photos.forEach((item, index) => {
      ImageUtil.upload({
        filePath: item,
        success(key) {
          // 指定位置插入
          picturesList.splice(index, 1, key)
          i++
        }
      })
    })

    let id = setInterval(() => {
      if (i == photos.length) {
        // 关闭定时器
        clearInterval(id)

        // 发送
        publish()
      }
    },250)


  }
})

// 发送
var publish = () => {
  Ajax.post({
    url: 'tweets/publishTweets',
    data: {
      content,
      permissionType,
      picturesList
    },
    success({ data }) {
      console.log(data)
      // 跳转到推文主页
      wx.redirectTo({
        url: '/pages/tweets/index?id=' + data.id
      })
    },
    fail({ msg }) {
      Toast.fail(msg)
    }
  })
}