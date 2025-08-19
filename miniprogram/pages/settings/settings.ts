// pages/settings/settings.ts

Page({
  data: {},

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 跳转到用户信息页面
  goToUserInfo() {
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
  },

  // 跳转到存档管理页面
  goToBackup() {
    wx.navigateTo({
      url: '../backup/backup'
    })
  }
}) 