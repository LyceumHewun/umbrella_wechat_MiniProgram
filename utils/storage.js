var Storage = {
  // 请求的cookies
  cookies(data) {
    if (!data) {
      return wx.getStorageSync("cookies")
    }
    wx.setStorageSync("cookies", data)
  },

  // id
  // username
  // avatar
  // avatarUrl
  // introduction
  // website
  user(data) {
    if (!data) {
      return wx.getStorageSync("user")
    }
    wx.setStorageSync("user", data)
  }
}

export {
  Storage
}