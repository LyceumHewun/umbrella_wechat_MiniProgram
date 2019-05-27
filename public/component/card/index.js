import { Ajax } from '../../../utils/request.js'

Component({
  data: {
    photoSwiperIndex: 1
  },

  properties: {
    /* 昵称 */
    nick: {
      type: String,
      value: '昵称'
    },
    /* 头像url */
    avatar: {
      type: String,
      value: ''
    },
    /* 图片url */
    photos: {
      type: Array,
      value: []
    },
    /* 推文内容 */
    content: {
      type: String,
      value: ''
    },
    /* 点赞数 */
    like: {
      type: Number,
      value: 0
    },
    /* 评论数 */
    comment: {
      type: Number,
      value: 0
    },
    /* 时间 */
    time: {
      type: String,
      value: '刚刚'
    },
    /* 地点 */
    adress: {
      type: String,
      value: ''
    },
    /* 是否点赞 */
    isLike: {
      type: Boolean,
      value: false
    },
    /* 是否收藏 */
    isCollected: {
      type: Boolean,
      value: false
    },
    /* 趣图 */
    isInteresting: {
      type: Boolean,
      value: false
    },
    /* 有礼物 */
    hasGift: {
      type: Boolean,
      value: false
    },
    /**
     * 默认推文内容最多显示两行
     */
    hiddenText: {
      type: Boolean,
      value: true
    },
    tweetsId: {
      type: Number,
      value: 0
    },
    userId: {
      type: Number,
      value: 0
    }
  },

  methods: {
    /**
     * 点击查看更多内容
     */
    seeMoreContent() {
      this.setData({
        hiddenText: false
      })
    },

    /**
     * 点赞
     */
    clickLike() {
      let that = this
      setTimeout(
        () => {
          let isLike = that.data.isLike
          let like = that.data.like
          let tweetsId = that.data.tweetsId
          if (isLike) {
            // 取消点赞
            like--
            unlikeFuntion(tweetsId)
          } else {
            // 点赞
            like++
            likeFuntion(tweetsId)
          }
          that.setData({
            isLike: !isLike,
            like
          })
        }, 200
      )
      this.triggerEvent('clickLike', {}, {})
    },

    /**
     * 收藏
     */
    clickCollect() {
      let that = this
      setTimeout(
        () => {
          let isCollected = that.data.isCollected
          if (isCollected) {
            // 取消收藏
          } else {
            // 收藏
          }
          that.setData({
            isCollected: !isCollected
          })
        }, 200
      )
      this.triggerEvent('clickCollect', {}, {})
    },

    /**
     * 点击右上角三点(选项)
     */
    clickOption() {
      wx.showActionSheet({
        itemList: [
          '关注',
          '举报'
        ],
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
     * 点击评论
     */
    clickComment() {
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      // 当前页面url
      let url = currentPage.route
      if (url === "pages/index/home") {
        wx.navigateTo({
          url: "/pages/tweets/index?clickComment&&id=" + this.data.tweetsId
        })
      }
      this.triggerEvent('clickComment', {}, {})
    },

    /**
     * 图片加载完成
     */
    imageLoad({ detail }) {
      this.triggerEvent('imageLoad', { detail }, {})
    },

    /**
     * 点击username
     */
    clickUsername() {
      let userId = this.data.userId
      wx.navigateTo({
        url: '/pages/mine/index?userId=' + userId
      })
    }
  }
})

/**
 * 点赞
 */
var likeFuntion = (tweetsId) => {
  Ajax.post({
    url: 'like/addLike',
    data: {
      tweetsId
    }
  })
}

/**
 * 取消点赞
 */
var unlikeFuntion = (tweetsId) => {
  Ajax.post({
    url: 'like/removeLike',
    data: {
      tweetsId
    }
  })
}