// app.ts
import { getLocalUserInfo } from './utils/device'

App<IAppOption>({
  globalData: {
    userInfo: undefined,
    isLoggedIn: false
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 使用本地用户系统
    try {
      const userInfo = getLocalUserInfo()
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
    } catch (error) {
      console.log('初始化本地用户失败:', error)
    }
    
    // 初始化角色数据
    try {
      const generals = wx.getStorageSync('generals')
      if (!generals || generals.length === 0) {
        const { allCharacters } = require('./characters/index')
        wx.setStorageSync('generals', allCharacters)
      }
    } catch (error) {
      console.log('初始化角色数据失败:', error)
    }
  },

  // 获取本地用户信息
  getLocalUserInfo() {
    return getLocalUserInfo()
  },

})