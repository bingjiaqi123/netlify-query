import { ParentModeManager } from './parent-mode-manager'

Page({
  data: {
    isParentMode: false,
    activeTab: 'task', // 当前激活的标签页：task 或 achieve
    studentRecords: [] as any[],
    parentRecords: [] as any[],
    studentTasks: [] as any[],
    studentAchievements: [] as any[],
    parentTasks: [] as any[],
    parentAchievements: [] as any[]
  },

  onLoad() {
    this.loadStudentHistory()
    this.loadParentHistory()
  },

  onShow() {
    // 每次显示页面时刷新数据，确保看到最新的审核结果
    this.loadStudentHistory()
    this.loadParentHistory()
  },

  // 返回主界面
  goBack() {
    wx.navigateBack()
  },

  // 切换模式
  toggleMode() {
    const newMode = !this.data.isParentMode
    this.setData({ isParentMode: newMode })
  },

  // 切换标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  // 获取两位数ID
  getTwoDigitId(task: any, type: string): string {
    if (type === 'daily' && task.dailyTaskId) {
      return task.dailyTaskId.toString().trim()
    }
    if (type === 'weekly' && task.weeklyTaskId) {
      return task.weeklyTaskId.toString().trim()
    }
    if (type === 'achieve' && task.achievementId) {
      return task.achievementId.toString().trim()
    }
    if (type === 'event' && task.activityId) {
      return task.activityId.toString().trim()
    }
    // 如果没有特定ID，尝试使用taskId
    if (task.taskId) {
      return task.taskId.toString().trim()
    }
    return ''
  },

  // 加载学生历史记录（仅记录已完成/通过的任务与成就）
  loadStudentHistory() {
    const tasks = wx.getStorageSync('questData') || {}
    const allRecords: any[] = []
    const taskRecords: any[] = []
    const achievementRecords: any[] = []
    
    // 遍历所有任务类型
    for (const tab of ['daily','weekly','achieve','event']){
      if (!tasks[tab]) continue
      const ongoing = tasks[tab].ongoing || []
      const available = tasks[tab].available || []
      const completed = (tasks[tab] as any).completed || []
      
      const collect = (task:any) => {
        const score = task.score !== undefined ? task.score : (task.status === 'approved' ? 100 : 0)
        const rewards = ParentModeManager.calculateRewards(task, score)
        const twoDigitId = this.getTwoDigitId(task, tab)
        const record = {
          id: task.id,
          twoDigitId: twoDigitId,
          type: tab,
          title: task.title,
          desc: task.desc,
          submitTime: task.submitTime,
          submitTimeText: task.submitTime ? this.formatTime(task.submitTime) : '',
          score: score,
          rewards: rewards,
          status: task.status
        }
        
        allRecords.push(record)
        
        // 分类到任务或成就
        if (tab === 'achieve') {
          achievementRecords.push(record)
        } else {
          taskRecords.push(record)
        }
      }
      
      // 仅收集审核通过的任务
      ongoing.forEach((task: any) => { if (task.status === 'approved') collect(task) })
      available.forEach((task: any) => { if (task.status === 'approved') collect(task) })
      completed.forEach((task: any) => { if (task.status === 'approved') collect(task) })
    }
    
    // 按提交时间倒序排列
    allRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    taskRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    achievementRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    
    this.setData({ 
      studentRecords: allRecords,
      studentTasks: taskRecords,
      studentAchievements: achievementRecords
    })
  },

  // 加载家长历史记录（仅记录已完成/通过的任务与成就，不记录发布）
  loadParentHistory() {
    const tasks = wx.getStorageSync('questData') || {}
    const allRecords: any[] = []
    const taskRecords: any[] = []
    const achievementRecords: any[] = []
    
    // 遍历所有任务类型
    for (const tab of ['daily','weekly','achieve','event']){
      if (!tasks[tab]) continue
      const available = tasks[tab].available || []
      const ongoing = tasks[tab].ongoing || []
      const completed = (tasks[tab] as any).completed || []
      
      const collectReviewed = (task:any) => {
        const score = task.score !== undefined ? task.score : (task.status === 'approved' ? 100 : 0)
        const rewards = ParentModeManager.calculateRewards(task, score)
        const twoDigitId = this.getTwoDigitId(task, tab)
        const record = {
          id: task.id,
          twoDigitId: twoDigitId,
          type: tab,
          title: task.title,
          desc: task.desc,
          coin: task.coin,
          diamond: task.diamond,
          custom: task.custom,
          hasCoin: task.hasCoin,
          hasDiamond: task.hasDiamond,
          hasCustom: task.hasCustom,
          submitTime: task.submitTime,
          submitTimeText: task.submitTime ? this.formatTime(task.submitTime) : '',
          score: score,
          rewards: rewards,
          status: task.status
        }
        
        allRecords.push(record)
        
        // 分类到任务或成就
        if (tab === 'achieve') {
          achievementRecords.push(record)
        } else {
          taskRecords.push(record)
        }
      }
      
      // 仅收集审核通过的任务
      ongoing.forEach((task: any) => { if (task.status === 'approved') collectReviewed(task) })
      available.forEach((task: any) => { if (task.status === 'approved') collectReviewed(task) })
      completed.forEach((task: any) => { if (task.status === 'approved') collectReviewed(task) })
    }
    
    // 按提交时间倒序排列
    allRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    taskRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    achievementRecords.sort((a, b) => (b.submitTime || 0) - (a.submitTime || 0))
    
    this.setData({ 
      parentRecords: allRecords,
      parentTasks: taskRecords,
      parentAchievements: achievementRecords
    })
  },

  // 格式化时间
  formatTime(timestamp: number): string {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
}) 