// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
import { getLocalUserInfo } from '../../utils/device'
import { getSaveInfo } from '../../utils/storage'

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName: '',
    },
    hasUserInfo: false,
    userName: '', // 用户昵称
    showLoginButton: false, // 是否显示登录按钮
    saveInfo: null as any, // 存档信息
  },

  lifetimes: {
    attached() {
      // 页面加载时获取用户信息
      this.getUserInfo()
      
      // 检查是否有存档
      const savedData = wx.getStorageSync('gameData')
      if (savedData) {
        this.setData({
          hasSave: true
        })
      }
    }
  },

  methods: {
    // 获取用户信息
    getUserInfo() {
      try {
        const userInfo = getLocalUserInfo()
        const saveInfo = getSaveInfo()
        
        this.setData({
          userName: userInfo.nickName || '尼莫',
          userInfo: userInfo,
          hasUserInfo: true,
          showLoginButton: false,
          saveInfo: saveInfo
        })
        
      } catch (error) {
        this.setData({
          userName: '尼莫',
          hasUserInfo: false,
          showLoginButton: true
        })
      }
    },



    // 查看存档信息
    onViewSaveInfo() {
      const saveInfo = this.data.saveInfo
      if (saveInfo) {
        const lastSaveTime = new Date(saveInfo.lastSaveTime).toLocaleString()
        wx.showModal({
          title: '存档信息',
          content: `用户：${saveInfo.userNickname}\n最后保存：${lastSaveTime}\n设备ID：${saveInfo.deviceId}`,
          showCancel: false
        })
      } else {
        wx.showToast({
          title: '暂无存档',
          icon: 'none'
        })
      }
    },

    // 跳转到存档管理页面
    onGoToBackup() {
      wx.navigateTo({
        url: '../backup/backup'
      })
    },

    // 事件处理函数
    toCases() {
      wx.navigateTo({
        url: '../cases/cases',
      })
    }
  },
})
