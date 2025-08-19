import { ParentModeManager } from '../quest-system/parent-mode-manager'
import { AchievementManager } from '../../data/achievements.js'

Page({
  data: {
    isParentMode: false,
    activeSub: 'available' as 'available'|'ongoing', // 默认显示未达成
    // 成就数据结构
    tasks: {
      achieve: { available: [] as any[], ongoing: [] as any[] }
    },
    visibleTasks: [] as any[],
    // 家长模式数据
    draft: ParentModeManager.resetDraft(),
    manageTasks: [] as any[],
    pendingReviewTasks: [] as any[], // 已提交待审核的成就
    availableTasks: [] as any[], // 未提交的成就
    showPublishPanel: false,
    // 成就管理器
    achievementManager: null as any,
    // 匹配到的成就信息
    matchedAchievement: null as any,
  },

  onLoad() {
    // 初始化成就管理器
    this.setData({
      achievementManager: new AchievementManager()
    })
    
    // 尝试从本地加载成就数据
    const savedTasks = wx.getStorageSync('questData')
    let achieveData = { available: [], ongoing: [] }
    
    if (savedTasks && savedTasks.achieve) {
      achieveData = savedTasks.achieve
    }
    
    // 确保数据结构完整
    if (!achieveData.available) achieveData.available = []
    if (!achieveData.ongoing) achieveData.ongoing = []
    
    // 初始化用户数据（如果不存在）
    const userData = wx.getStorageSync('userData') || {}
    if (typeof userData.coin === 'undefined') userData.coin = 0
    if (typeof userData.diamond === 'undefined') userData.diamond = 0
    wx.setStorageSync('userData', userData)
    
      this.setData({ 
      tasks: { achieve: achieveData }
      })
    
    this.refreshVisible()
    this.refreshManageTasks()
  },

  onShow() {
    this.refreshVisible()
    this.refreshManageTasks()
  },

  // 返回主界面
  goBack() {
    wx.navigateBack()
  },

  // 切换模式
  toggleMode() {
    const newMode = !this.data.isParentMode
    this.setData({ 
      isParentMode: newMode,
      activeSub: 'available' // 切换到学生模式时默认显示未达成
    })
    if (newMode) {
      this.refreshManageTasks()
    } else {
      this.refreshVisible()
    }
  },

  // 显示发布成就面板
  showPublishPanel() {
    this.setData({ 
      showPublishPanel: true,
      matchedAchievement: null,
      draft: ParentModeManager.resetDraft()
    })
  },

  // 隐藏发布成就面板
  hidePublishPanel() {
    this.setData({ 
      showPublishPanel: false,
      matchedAchievement: null
    })
  },

  // 切换子页面
  switchSub(e: any) {
    const sub = e.currentTarget.dataset.sub as 'available'|'ongoing'
    if (!sub) return
    this.setData({ activeSub: sub })
    this.refreshVisible()
  },

  // 提交成就
  submitTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks } = this.data as any
    
    const avail = tasks.achieve.available as any[]
    let idx = avail.findIndex(a => a.id === id)
    if (idx >= 0) {
      const achievement = { ...avail[idx], status: 'pending-review', submitTime: Date.now() }
      avail.splice(idx, 1)
      tasks.achieve.ongoing.unshift(achievement)
    } else {
      // 兼容从未达成页对已通过成就进行二次提交（该成就在ongoing中）
      const ongoing = tasks.achieve.ongoing || []
      idx = ongoing.findIndex((a:any)=> a.id===id && a.status==='approved')
      if (idx >= 0) {
        ongoing[idx].status = 'pending-review'
        ongoing[idx].submitTime = Date.now()
      } else {
        return
      }
    }
    
    this.setData({ tasks })
    this.save()
    this.refreshVisible()
  },

  // 家长模式：发布成就
  publishTask() {
    const { draft, tasks, matchedAchievement } = this.data as any
    
    // 检查是否匹配到成就
    if (!matchedAchievement) {
      wx.showToast({ title: '请先输入有效的成就ID', icon: 'none' })
      return
    }
    
    // 使用匹配到的成就信息创建新任务
    const newTask = {
      id: `achieve_${Date.now()}`,
      title: matchedAchievement.name,
      desc: draft.desc || '',
      coin: matchedAchievement.coin,
      diamond: matchedAchievement.diamond,
      custom: draft.hasCustom ? draft.custom : '',
      hasCoin: true,
      hasDiamond: true,
      hasCustom: draft.hasCustom,
      publishTime: Date.now(),
      achievementId: matchedAchievement.id // 保存原始成就ID
    }
    
    // 添加到available列表
    if (!tasks.achieve) {
      tasks.achieve = { available: [], ongoing: [] }
    }
    if (!tasks.achieve.available) {
      tasks.achieve.available = []
    }
    
    tasks.achieve.available.unshift(newTask)
    
    this.setData({ 
      tasks, 
      draft: ParentModeManager.resetDraft(),
      matchedAchievement: null
    })
      this.save()
      this.refreshManageTasks()
      this.hidePublishPanel()
    
    wx.showToast({ title: '成就发布成功', icon: 'success' })
  },

  // 家长模式：删除成就
  deleteTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks } = this.data as any
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个成就吗？',
      success: (res) => {
        if (res.confirm) {
          // 在available中查找并删除
          const availableList = tasks.achieve?.available || []
          const availableIndex = availableList.findIndex((t: any) => t.id === id)
          
          if (availableIndex >= 0) {
            availableList.splice(availableIndex, 1)
          } else {
            // 在ongoing中查找并删除
            const ongoingList = tasks.achieve?.ongoing || []
            const ongoingIndex = ongoingList.findIndex((t: any) => t.id === id)
            
            if (ongoingIndex >= 0) {
              ongoingList.splice(ongoingIndex, 1)
            } else {
              wx.showToast({ title:'未找到要删除的成就', icon:'none' })
              return
            }
          }
          this.setData({ tasks })
          this.save()
          this.refreshManageTasks()
        }
      }
    })
  },

  // 家长模式：审核（根据分数：>=60通过并发奖；<60驳回退回未提交）
  approveTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks, pendingReviewTasks, availableTasks, manageTasks } = this.data as any

    // 从可见集合获取输入的分数
    let appliedScore: any = 100
    const all = [...(pendingReviewTasks||[]), ...(availableTasks||[]), ...(manageTasks||[])]
    const found = all.find((x:any)=>x.id===id)
    if (found) appliedScore = found.score || 100

    let score = 0
    if (appliedScore !== '' && appliedScore !== null && appliedScore !== undefined) {
      const parsed = parseInt(String(appliedScore), 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        score = parsed
      } else {
        wx.showToast({ title:'请输入0-100的整数分数', icon:'none' })
        return
      }
    }

    const ongoing = tasks.achieve?.ongoing || []
    const idx = ongoing.findIndex((a: any) => a.id === id)
    if (idx < 0) { wx.showToast({ title:'成就不存在', icon:'none' }); return }

    const achievement = ongoing[idx]
    achievement.score = score
    if (score >= 60) {
      achievement.status = 'approved'
      achievement.reviewTime = Date.now()
      // 发放奖励（按分数百分比与去个位规则）
      try {
        const { RewardManager } = require('../quest-system/components/reward-manager.js')
        RewardManager.grantRewards(achievement, score)
      } catch (err) {}
      // 从进行中移除并归档
      ongoing.splice(idx, 1)
      if (!(tasks.achieve as any).completed) (tasks.achieve as any).completed = []
      ;(tasks.achieve as any).completed.unshift(achievement)
    } else {
      // 驳回退回未提交
      delete achievement.status
      delete achievement.reviewNote
      ongoing.splice(idx, 1)
      if (!tasks.achieve.available) tasks.achieve.available = []
      tasks.achieve.available.unshift(achievement)
    }

    this.setData({ tasks })
    this.save()
    this.refreshManageTasks()
    this.refreshVisible()
  },

  // 发放全额奖励（无评分）
  grantFullRewards(achievement: any) {
    try {
      const gameData = wx.getStorageSync('gameData') || {}
      const userStats = gameData.userStats || {}

      if (achievement.hasCoin && achievement.coin > 0) {
        userStats.coin = (userStats.coin || 0) + achievement.coin
      }
      if (achievement.hasDiamond && achievement.diamond > 0) {
        userStats.diamond = (userStats.diamond || 0) + achievement.diamond
      }

      gameData.userStats = userStats
      gameData.lastUpdate = Date.now()
      wx.setStorageSync('gameData', gameData)

      const userData = {
        coin: userStats.coin || 0,
        diamond: userStats.diamond || 0
      }
      wx.setStorageSync('userData', userData)
    } catch (error) {
      console.error('发放奖励失败:', error)
      wx.showToast({ title:'奖励发放失败', icon:'none' })
    }
  },

  // 家长模式：驳回成就
  rejectTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks } = this.data as any
    
    const ongoing = tasks.achieve?.ongoing || []
    const achievementIndex = ongoing.findIndex((a: any) => a.id === id)
    
    if (achievementIndex >= 0) {
      const achievement = ongoing[achievementIndex]
      achievement.status = 'rejected'
      achievement.reviewTime = Date.now()
      ongoing.splice(achievementIndex, 1)
      tasks.achieve.available.unshift(achievement)
      
      this.setData({ tasks })
      this.save()
      this.refreshManageTasks()
      this.refreshVisible()
    }
  },

  // 刷新当前列表
  refreshVisible() {
    const { activeSub, tasks } = this.data as any
    const availableList = tasks.achieve.available || []
    const ongoingList = tasks.achieve.ongoing || []
    const completedList = tasks.achieve.completed || []
    
    console.log('refreshVisible - activeSub:', activeSub)
    console.log('refreshVisible - availableList:', availableList)
    console.log('refreshVisible - ongoingList:', ongoingList)
    console.log('refreshVisible - completedList:', completedList)
    
    if (activeSub === 'available') {
      // 未达成：available中的任务 + ongoing中被驳回的任务
      const unachieved = availableList.filter((t: any) => !t.status || t.status === 'rejected')
      console.log('refreshVisible - unachieved:', unachieved)
      this.setData({ visibleTasks: unachieved.map((t:any)=>({
        ...t,
        submitTimeText: t.submitTime ? this.formatTime(t.submitTime) : '',
        reviewTimeText: t.reviewTime ? this.formatTime(t.reviewTime) : ''
      })) })
    } else if (activeSub === 'ongoing') {
      // 已达成：ongoing中状态为approved的任务 + completed中的任务
      const approvedFromOngoing = ongoingList.filter((t: any) => t.status === 'approved')
      const allCompleted = [...approvedFromOngoing, ...completedList]
      console.log('refreshVisible - approvedFromOngoing:', approvedFromOngoing)
      console.log('refreshVisible - completedList:', completedList)
      console.log('refreshVisible - allCompleted:', allCompleted)
      this.setData({ visibleTasks: allCompleted.map((t:any)=>({
        ...t,
        submitTimeText: t.submitTime ? this.formatTime(t.submitTime) : '',
        reviewTimeText: t.reviewTime ? this.formatTime(t.reviewTime) : ''
      })) })
    }
    
    console.log('refreshVisible - visibleTasks:', this.data.visibleTasks)
  },

  // 刷新管理任务列表
  refreshManageTasks() {
    const { tasks } = this.data as any
    
    const availableList = tasks.achieve?.available || []
    const ongoingList = tasks.achieve?.ongoing || []
    
    // 待审核：ongoing中状态为pending-review的任务
    const pendingReviewTasks = ongoingList.filter((t: any) => t.status === 'pending-review')
    
    // 未提交：available中的任务（包括新发布的成就）
    const availableTasks = availableList.filter((t: any) => !t.status || t.status === 'rejected')
    
    // 管理任务：所有任务（用于编辑、删除等操作）
    const manageTasks = [...availableList, ...ongoingList]
    
    const mapTimes = (arr:any[])=>arr.map((t:any)=>({
      ...t,
      publishTimeText: t.publishTime ? this.formatTime(t.publishTime) : '',
      submitTimeText: t.submitTime ? this.formatTime(t.submitTime) : '',
      reviewTimeText: t.reviewTime ? this.formatTime(t.reviewTime) : ''
    }))
    
    this.setData({ 
      pendingReviewTasks: mapTimes(pendingReviewTasks),
      availableTasks: mapTimes(availableTasks),
      manageTasks: mapTimes(manageTasks)
    })
  },

  // 评分输入（保存到相应项）
  onScoreInput(e: any) {
    const id = e.currentTarget.dataset.id
    const value = e.detail.value || ''
    const finalValue = value === '' ? '0' : value
    const { pendingReviewTasks, availableTasks, manageTasks, tasks } = this.data as any
    const update = (arr:any[])=>{
      const i = arr.findIndex((t:any)=>t.id===id)
      if (i>=0) arr[i].score = finalValue
    }
    if (pendingReviewTasks) update(pendingReviewTasks)
    if (availableTasks) update(availableTasks)
    if (manageTasks) update(manageTasks)
    // 同步到实际数据（ongoing内）
    const ongoing = tasks.achieve?.ongoing || []
    const j = ongoing.findIndex((t:any)=>t.id===id)
    if (j>=0) ongoing[j].score = finalValue
    this.setData({ pendingReviewTasks, availableTasks, manageTasks, tasks })
  },

  // 成就ID输入 - 自动匹配成就信息
  onAchievementIdInput(e: any) {
    const achievementId = e.detail.value.trim()
    const { achievementManager } = this.data
    
    this.setData({
      'draft.achievementId': achievementId
    })
    
    if (!achievementId) {
      this.setData({ 
        matchedAchievement: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      return
    }
    
    if (!achievementManager) {
      console.error('成就管理器未初始化')
      return
    }
    
    const achievement = achievementManager.getAchievementById(achievementId)
    
    if (achievement) {
      this.setData({
        matchedAchievement: achievement,
        'draft.title': achievement.name,
        'draft.coin': achievement.coin,
        'draft.diamond': achievement.diamond,
        'draft.hasCoin': achievement.coin > 0,
        'draft.hasDiamond': achievement.diamond > 0
      })
      wx.showToast({ title: '成就匹配成功', icon: 'success' })
    } else {
      this.setData({ 
        matchedAchievement: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      wx.showToast({ title: '未找到该成就ID', icon: 'none' })
    }
  },

  // 草稿相关
  onDraftDesc(e: any) {
    this.setData({ 'draft.desc': e.detail.value })
  },

  // 自定义设置相关方法
  toggleCustomReward() {
    const current = this.data.draft.hasCustom
    this.setData({ 'draft.hasCustom': !current })
  },
  
  onCustomInput(e: any) {
    this.setData({ 'draft.custom': e.detail.value })
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
  },

  save() {
    const savedTasks = wx.getStorageSync('questData') || {}
    savedTasks.achieve = this.data.tasks.achieve
    wx.setStorageSync('questData', savedTasks)
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  }
}) 