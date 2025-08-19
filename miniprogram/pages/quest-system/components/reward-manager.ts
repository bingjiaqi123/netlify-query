// 奖励管理组件
export class RewardManager {
  // 发放奖励（>=60才发放；铜币按分数百分比；钻石按分数百分比去个位；自定义>=60全额）
  static grantRewards(task: any, score: number) {
    if (score < 60) return
    
    const userData = wx.getStorageSync('userData') || {}
    const gameData = wx.getStorageSync('gameData') || {}
    const userStats = gameData.userStats || { coin: 2000, diamond: 200 }
    
    let coinGain = 0
    let diamondGain = 0
    
    // 铜币奖励：按分数百分比（76分→76%）
    if (task.hasCoin && task.coin > 0) {
      coinGain = Math.floor((task.coin * score) / 100)
      userData.coin = (userData.coin || 0) + coinGain
      userStats.coin = (userStats.coin || 0) + coinGain
    }
    
    // 钻石奖励：按分数百分比去个位（76分→70%）
    if (task.hasDiamond && task.diamond > 0) {
      const percentage = Math.floor(score / 10) * 10
      diamondGain = Math.floor((task.diamond * percentage) / 100)
      userData.diamond = (userData.diamond || 0) + diamondGain
      userStats.diamond = (userStats.diamond || 0) + diamondGain
    }
    
    // 自定义奖励（>=60全额）。如需额外处理，可在此扩展。
    // task.hasCustom && task.custom
    
    // 同步保存到两个位置，保证首页显示的数据源（gameData.userStats）更新
    gameData.userStats = userStats
    gameData.lastUpdate = Date.now()
    wx.setStorageSync('gameData', gameData)
    wx.setStorageSync('userData', userData)
  }
} 