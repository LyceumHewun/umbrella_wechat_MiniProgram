import { Ajax } from '../../../utils/request.js'

Component({

  properties: {
    comment: {
      type: Object,
      value: {}
    }
  },

  methods: {
    clickReply() {
      let comment = this.data.comment
      let subComment = true
      this.triggerEvent('clickReply', { comment, subComment }, {})
    },

    clickUsername() {
      let userId = this.data.comment.userId
      wx.navigateTo({
        url: '/pages/mine/index?userId=' + userId
      })
    },

    clickLike() {
      let that = this
      setTimeout(
        () => {
          let isLike = that.data.comment.isLike
          let like = that.data.comment.likeCount
          let commentId = that.data.comment.id
          let comment = that.data.comment
          if (isLike) {
            // 取消点赞
            like--
            unlikeFuntion(commentId)
          } else {
            // 点赞
            like++
            likeFuntion(commentId)
          }
          comment.isLike = !isLike
          comment.likeCount = like
          that.setData({
            comment
          })
        }, 200
      )
      this.triggerEvent('clickLike', {}, {})
    }
  }
})


/**
 * 点赞
 */
var likeFuntion = (commentId) => {
  Ajax.post({
    url: 'like/addLike',
    data: {
      commentId
    }
  })
}

/**
 * 取消点赞
 */
var unlikeFuntion = (commentId) => {
  Ajax.post({
    url: 'like/removeLike',
    data: {
      commentId
    }
  })
}