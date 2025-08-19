// pages/home/home.ts
import { getLocalUserInfo } from '../../utils/device'
import { loadGameData, saveGameData } from '../../utils/storage'

Page({
  data: {
    userInfo: {
      nickName: '尼莫'
    },
    coin: 2000,
    diamond: 200
  },

  onLoad() {
    this.loadGameData()
    this.loadUserInfo()
  },

  onShow() {
    this.loadGameData()
    this.loadUserInfo()
  },

  // 加载游戏数据
  loadGameData() {
    const gameData = wx.getStorageSync('gameData') || {}
    const userStats = gameData.userStats || { coin: 2000, diamond: 200 }
    
    this.setData({
      coin: userStats.coin,
      diamond: userStats.diamond
    })
  },

  // 加载用户信息
  loadUserInfo() {
    try {
      const userInfo = getLocalUserInfo()
      if (userInfo && userInfo.nickName) {
        this.setData({
          userInfo: userInfo
        })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  },

  // 页面跳转
  navigateToPage(e: any) {
    const page = e.currentTarget.dataset.page
    let url = `/pages/${page}/${page}`
    
    // 特殊处理某些页面路径
    if (page === 'quest-system/quest') {
      url = '/pages/quest-system/quest'
    } else if (page === 'quest-system/history') {
      url = '/pages/quest-system/history'
    } else if (page === 'exchange') {
      url = '/pages/exchange/exchange'
    } else if (page === 'balatro') {
      url = '/pages/balatro/balatro'
    } else if (page === 'force-select') {
      url = '/pages/force-select/force-select'
    } else if (page === 'food') {
      url = '/pages/food/food'
    }
    
    wx.navigateTo({ url })
  }
}) 