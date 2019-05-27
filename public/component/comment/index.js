import { Ajax } from '../../../utils/request.js'

Component({

  data: {
    subComment: []
  },

  properties: {
    comment: {
      type: Object,
      value: {}
    }
  },

  observers: {
    'comment.commentCount': () => {
      // 监听变化
    } 
  },

  methods: {
    clickReply({ detail }) {
      // 子评论
      let comment = detail.comment
      if (!comment) {
        // 如果不是点击子评论
        comment = this.data.comment
      } else {
        comment.id = this.data.comment.id
      }
      this.triggerEvent('clickReply', { comment }, {})
    },

    clickMoreSubComment() {
      let commentId = this.data.comment.id
      let that = this
      Ajax.get({
        url: 'comment/getSubComments',
        showLoading: true,
        data: {
          commentId
        },
        success({ data }) {
          console.log(data)
          that.setData({
            subComment: data
          })
        }
      })

      this.triggerEvent('clickMoreSubComment', {}, {})
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
  },

  /**
   * 组件生命周期函数-在组件布局完成后执行
   * 
   * todo 查询子评论
   */
  ready() {
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