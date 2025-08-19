// pages/userinfo/userinfo.ts
import { getLocalUserInfo } from '../../utils/device'

Page({
  data: {
    userInfo: null as any,
    createTime: ''
  },

  onLoad() {
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 加载用户数据
  loadUserData() {
    try {
      const userInfo = getLocalUserInfo()
      const createTime = new Date(userInfo.createTime).toLocaleString()
      
      this.setData({
        userInfo: userInfo,
        createTime: createTime
      })
    } catch (error) {
      console.error('加载用户数据失败:', error)
      wx.showToast({
        title: '加载数据失败',
        icon: 'error'
      })
    }
  },

  // 修改昵称
  editNickname() {
    wx.showModal({
      title: '修改昵称',
      content: '',
      editable: true,
      placeholderText: '1-7个汉字/数字/字母',
      success: (res) => {
        if (res.confirm && res.content) {
          const newNickname = res.content.trim()
          
          // 验证昵称格式
          if (newNickname.length === 0) {
            wx.showToast({
              title: '昵称不能为空',
              icon: 'error'
            })
            return
          }
          
          if (newNickname.length > 7) {
            wx.showToast({
              title: '昵称不能超过7个字符',
              icon: 'error'
            })
            return
          }
          
          // 检查是否包含空格或符号
          if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(newNickname)) {
            wx.showToast({
              title: '仅限汉字/数字/字母',
              icon: 'error'
            })
            return
          }
          
          try {
            // 更新用户信息
            const userInfo = this.data.userInfo
            userInfo.nickName = newNickname
            userInfo.updateTime = Date.now()
            
            // 保存到本地存储（与 getLocalUserInfo 一致）
            wx.setStorageSync('localUserInfo', userInfo)
            
            this.setData({
              userInfo: userInfo
            })
          } catch (error) {
            console.error('修改昵称失败:', error)
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            })
          }
        }
      }
    })
  }
}) 