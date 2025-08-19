// utils/storage.ts
import { getDeviceId } from './device'

const DEVICE_ID = getDeviceId()

// Base64编码函数
function base64Encode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0
  
  while (i < str.length) {
    const char1 = str.charCodeAt(i++)
    const char2 = i < str.length ? str.charCodeAt(i++) : 0
    const char3 = i < str.length ? str.charCodeAt(i++) : 0
    
    const enc1 = char1 >> 2
    const enc2 = ((char1 & 3) << 4) | (char2 >> 4)
    const enc3 = ((char2 & 15) << 2) | (char3 >> 6)
    const enc4 = char3 & 63
    
    result += chars.charAt(enc1) + chars.charAt(enc2)
    result += i > str.length + 1 ? '=' : chars.charAt(enc3)
    result += i > str.length ? '=' : chars.charAt(enc4)
  }
  
  return result
}

// Base64解码函数
function base64Decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0
  
  // 移除填充字符
  str = str.replace(/=+$/, '')
  
  while (i < str.length) {
    const enc1 = chars.indexOf(str.charAt(i++))
    const enc2 = chars.indexOf(str.charAt(i++))
    const enc3 = chars.indexOf(str.charAt(i++))
    const enc4 = chars.indexOf(str.charAt(i++))
    
    const char1 = (enc1 << 2) | (enc2 >> 4)
    const char2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    const char3 = ((enc3 & 3) << 6) | enc4
    
    result += String.fromCharCode(char1)
    if (enc3 !== -1) result += String.fromCharCode(char2)
    if (enc4 !== -1) result += String.fromCharCode(char3)
  }
  
  return result
}

// 保存游戏数据
export function saveGameData(data: any) {
  try {
  const saveData = {
      ...data,
      saveTime: Date.now(),
      deviceId: getDeviceId()
  }
    wx.setStorageSync('gameData', saveData)
    return true
  } catch (error) {
    console.error('保存游戏数据失败:', error)
    return false
  }
}

// 加载游戏数据
export function loadGameData() {
    try {
    const data = wx.getStorageSync('gameData')
    return data || null
    } catch (error) {
    console.error('加载游戏数据失败:', error)
    return null
  }
}

// 导出存档数据
export function exportSaveData(): string {
  const saveData = wx.getStorageSync(`game_${DEVICE_ID}`)
  const userInfo = wx.getStorageSync('localUserInfo')
  
  const exportData = {
    gameData: saveData,
    userInfo: userInfo,
    exportTime: Date.now(),
    version: '1.0'
  }
  
  // Base64编码
  const jsonString = JSON.stringify(exportData)
  return base64Encode(encodeURIComponent(jsonString))
}

// 导入存档数据
export function importSaveData(importCode: string): boolean {
  try {
    // Base64解码
    const jsonString = decodeURIComponent(base64Decode(importCode))
    const importData = JSON.parse(jsonString)
    
    if (importData.version && importData.gameData && importData.userInfo) {
      // 验证数据格式
      wx.setStorageSync(`game_${DEVICE_ID}`, importData.gameData)
      wx.setStorageSync('localUserInfo', importData.userInfo)
      return true
    } else {
      console.error('存档格式错误')
      return false
    }
  } catch (error) {
    console.error('导入存档失败:', error)
    return false
  }
}

// 清除所有数据
export function clearAllData() {
  try {
  wx.clearStorageSync()
    return true
  } catch (error) {
    console.error('清除数据失败:', error)
    return false
  }
}

// 获取存档信息
export function getSaveInfo() {
  const saveData = wx.getStorageSync('gameData')
  const userInfo = wx.getStorageSync('localUserInfo')
  
  return {
    hasSave: !!saveData,
    lastSaveTime: saveData?.saveTime || 0,
    userNickname: userInfo?.nickName || '未知用户',
    deviceId: getDeviceId()
  }
} 