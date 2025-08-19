// utils/device.ts

// 简单的MD5实现（用于生成设备ID）
function simpleHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString()
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16)
}

// 获取设备ID
export function getDeviceId(): string {
  let deviceId = wx.getStorageSync('deviceId')
  if (!deviceId) {
    try {
      const systemInfo = wx.getSystemInfoSync()
      const deviceString = `${systemInfo.brand}_${systemInfo.model}_${systemInfo.system}_${systemInfo.platform}`
      deviceId = simpleHash(deviceString)
      wx.setStorageSync('deviceId', deviceId)
    } catch (error) {
      console.error('获取系统信息失败:', error)
      // 使用时间戳作为备用方案
      deviceId = simpleHash(Date.now().toString())
      wx.setStorageSync('deviceId', deviceId)
    }
  }
  return deviceId
}



// 获取或创建本地用户信息
export function getLocalUserInfo() {
  let userInfo = wx.getStorageSync('localUserInfo')
  if (!userInfo) {
    userInfo = {
      nickName: '尼莫',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      deviceId: getDeviceId(),
      createTime: Date.now(),
      lastLoginTime: Date.now()
    }
    wx.setStorageSync('localUserInfo', userInfo)
  } else {
    // 更新最后登录时间
    userInfo.lastLoginTime = Date.now()
    wx.setStorageSync('localUserInfo', userInfo)
  }
  return userInfo
} 