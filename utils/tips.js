/**
 * 自定义toast图片
 */
var show = ({ title, image }) => {
  wx.showToast({
    title,
    image,
    duration: 3000
  })
}

var Toast = {
  success(title) {
    show({
      title,
      image: '/img/toast/check-circle.png'
    })
  },

  fail(title) {
    show({
      title,
      image: '/img/toast/close-circle.png'
    })
  },

  warn(title) {
    show({
      title,
      image: '/img/toast/info-circle.png'
    })
  }
}

export {
  Toast
}