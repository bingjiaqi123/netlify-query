// 任务系统通用工具类
export class TaskUtils {
  // 格式化时间
  static formatTime(timestamp: number): string {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 数组随机打乱函数
  static shuffleArray(array: any[]): any[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 检查是否为同一天
  static isSameDay(a: number, b: number): boolean {
    if (!a || !b) return false
    const da = new Date(a), db = new Date(b)
    return da.getFullYear() === db.getFullYear() && 
           da.getMonth() === db.getMonth() && 
           da.getDate() === db.getDate()
  }

  // 检查是否为同一周
  static isSameWeek(a: number, b: number): boolean {
    if (!a || !b) return false
    const da = new Date(a), db = new Date(b)
    // 以周一为一周开始
    const getWeekStart = (d: Date) => {
      const day = (d.getDay() + 6) % 7
      const start = new Date(d)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - day)
      return start.getTime()
    }
    return getWeekStart(da) === getWeekStart(db)
  }

  // 重置草稿数据
  static resetDraft() {
    return {
      title: '',
      desc: '',
      coin: 100,
      diamond: 10,
      custom: '',
      hasCoin: true,
      hasDiamond: true,
      hasCustom: false,
      isPermanent: true,
      activityId: '',
      dailyTaskId: '',
      weeklyTaskId: ''
    }
  }

  // 重置编辑草稿数据
  static resetEditDraft() {
    return {
      title: '',
      desc: '',
      coin: 0,
      diamond: 0,
      custom: '',
      hasCoin: false,
      hasDiamond: false,
      hasCustom: false
    }
  }

  // 发放奖励（>=60才发放；钻石去余法，89->80；自定义>=60全额）
  static grantRewards(task: any, score: number) {
    try {
      if (score < 60) return
      
      // 读取并更新gameData.userStats
      const gameData = wx.getStorageSync('gameData') || {}
      const userStats = gameData.userStats || {}
      
      let totalCoin = 0
      let totalDiamond = 0
      
      // 铜币：按百分比
      if (task.hasCoin && task.coin > 0) {
        totalCoin = Math.floor(task.coin * score / 100)
        userStats.coin = (userStats.coin || 0) + totalCoin
      }
      
      // 钻石：去余法到十位百分比
      if (task.hasDiamond && task.diamond > 0) {
        const pct = Math.floor(score / 10) * 10
        totalDiamond = Math.floor(task.diamond * pct / 100)
        userStats.diamond = (userStats.diamond || 0) + totalDiamond
      }
      
      // 保存gameData
      gameData.userStats = userStats
      gameData.lastUpdate = Date.now()
      wx.setStorageSync('gameData', gameData)
      
      // 同步简易userData（兼容）
      const userData = {
        coin: userStats.coin || 0,
        diamond: userStats.diamond || 0
      }
      wx.setStorageSync('userData', userData)
    } catch (err) {
      console.error('Quest grant rewards failed:', err)
    }
  }
} 