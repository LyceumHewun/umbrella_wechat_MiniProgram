Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "/pages/index/home",
        iconPath: "/img/tabBar/home1.png",
        selectedIconPath: "/img/tabBar/home-fill2.png"
      },
      {
        pagePath: "/pages/index/square",
        iconPath: "/img/tabBar/search1.png",
        selectedIconPath: "/img/tabBar/search2.png"
      },
      {
        pagePath: "/pages/index/publish",
        iconPath: "/img/tabBar/publish1.png",
        selectedIconPath: "/img/tabBar/publish2.png"
      },
      {
        pagePath: "/pages/index/like",
        iconPath: "/img/tabBar/heart1.png",
        selectedIconPath: "/img/tabBar/heart-fill2.png"
      },
      {
        pagePath: "/pages/index/mine",
        iconPath: "/img/tabBar/user1.png",
        selectedIconPath: "/img/tabBar/user-fill2.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const index = data.index
      if (index === 2) {
        // 中间的'田'按钮

        wx.showActionSheet({
          itemList: [
            '推文',
            '趣图'
          ],
          success({ tapIndex }) {
            if (tapIndex === 0) {
              chooseImage()
            } else if (tapIndex === 1) {
              chooseImage1()
            }
          }
        })
      } else {
        const url = data.path
        wx.switchTab({
          url
        })
      }
    }
  }
})

var chooseImage = () => {
  wx.chooseImage({
    count: 9,
    success(res) {
      let tempFilePaths = res.tempFilePaths
      wx.navigateTo({
        url: '/pages/publish/index?tempFilePaths=' + tempFilePaths
      })
    }
  })
}

var chooseImage1 = () => {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success(res) {
      let tempFilePaths = res.tempFilePaths
      wx.navigateTo({
        url: '/pages/publish/interesting?tempFilePaths=' + tempFilePaths
      })
    }
  })
}