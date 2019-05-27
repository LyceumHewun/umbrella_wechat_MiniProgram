import { Ajax } from 'request.js'

var getUploadToken = ({ success }) => {
  Ajax.get({
    url: 'user/getImageUploadToken',
    showLoading: true,
    success({ data }) {
      success(data)
    }
  })
}

var ImageUtil = {
  /**
   * 上传图片
   */
  upload({
    filePath,
    // success(key) 返回的文件名
    success = () => { }
  }) {
    getUploadToken({
      success(uploadToken) {
        wx.showLoading({
          title: 'Loading..',
          mask: true
        })
        wx.uploadFile({
          url: 'https://upload-z2.qiniup.com',
          filePath,
          name: 'file',
          formData: {
            'token': uploadToken
          },
          success({ statusCode, errMsg, data }) {
            wx.hideLoading()
            if (statusCode === 200) {
              let json = JSON.parse(data)
              success(json.key)
            }
          }
        })
      }
    })
  }
}

export { ImageUtil }