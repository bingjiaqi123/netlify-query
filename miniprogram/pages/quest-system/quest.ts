import { getRandomQuote } from '../../utils/motivational-quotes'
import { ActivityTaskManager } from '../../data/activity-tasks.js'
import { DailyTaskManager } from '../../data/daily-tasks.js'
import { WeeklyTaskManager } from '../../data/weekly-tasks.js'

import {
  StudentDailyTasks,
  StudentWeeklyTasks,
  StudentEventTasks,
  ParentDailyTasks,
  ParentWeeklyTasks,
  ParentEventTasks,
  TaskUtils,
  RewardManager,
  DailyResetManager,
  WeeklyResetManager,
  ParentTaskManager,

  PresetGroupManager
} from './components/index'

Page({
  data: {
    isParentMode: false,
    activeTab: 'daily' as 'daily' | 'weekly' | 'event',
    activeSub: 'available' as 'available' | 'ongoing',
    canRedrawDaily: true, // 每日任务是否可以重抽
    canRedrawWeekly: true, // 每周任务是否可以重抽
    tasks: {
      daily: { available: [], ongoing: [] },
      weekly: { available: [], ongoing: [] },
      event: { available: [], ongoing: [] }
    },
    pools: {
      daily: { permanent: [], random: { groups: [] } },
      weekly: { permanent: [], random: { groups: [] } }
    },
    draft: {
      title: '',
      desc: '',
      coin: 100,
      diamond: 10,
      custom: '',
      hasCoin: true,
      hasDiamond: true,
      hasCustom: false,
      isPermanent: true,
      activityId: '', // 活动任务ID
      dailyTaskId: '', // 每日任务ID
      weeklyTaskId: '' // 每周任务ID
    },
    showPublishPanel: false,
    // 编辑任务数据
    showEditPanel: false,
    editingTaskId: '',
    editDraft: {
      title: '',
      desc: '',
      coin: 0,
      diamond: 0,
      custom: '',
      hasCoin: false,
      hasDiamond: false,
      hasCustom: false
    },
    // 任务管理器
    activityTaskManager: null as any,
    dailyTaskManager: null as any,
    weeklyTaskManager: null as any,

    // 匹配到的任务信息
    matchedActivityTask: null as any,
    matchedDailyTask: null as any,
    matchedWeeklyTask: null as any,
  },

  onLoad() {
    // 清理小丑牌相关的预设组和任务
    this.cleanupJokerData()
    
    // 初始化任务管理器
    this.setData({
      activityTaskManager: new ActivityTaskManager(),
      dailyTaskManager: new DailyTaskManager(),
      weeklyTaskManager: new WeeklyTaskManager(),

    })
    
    this.loadData()
    this.ensureSpecialTasks()
    this.ensureRandomPresetGroups()
    this.initBanners()
    this.checkRedrawStatus()
  },

  // 清理小丑牌相关的预设组和任务
  cleanupJokerData() {
    const pools = wx.getStorageSync('questPools') || {}
    
    // 清理每日常驻任务中的"完成所有每日任务"
    if (pools.daily && pools.daily.permanent) {
      pools.daily.permanent = pools.daily.permanent.filter((task: any) => 
        !task.isSpecialCompleteAll && task.title !== '完成所有每日任务'
      )
    }
    
    // 清理每周常驻任务中的"完成所有每周任务"
    if (pools.weekly && pools.weekly.permanent) {
      pools.weekly.permanent = pools.weekly.permanent.filter((task: any) => 
        !task.isSpecialCompleteAll && task.title !== '完成所有每周任务'
      )
    }
    
    // 清理每周随机任务池中的小丑牌相关组
    if (pools.weekly && pools.weekly.random && pools.weekly.random.groups) {
      pools.weekly.random.groups = pools.weekly.random.groups.filter((group: any) => 
        group.name !== '小丑牌模式' && group.name !== '小丑牌阵营'
      )
    }
    
    wx.setStorageSync('questPools', pools)
  },

  onShow() {
    this.loadData()
    this.refreshVisible()
    this.checkRedrawStatus()
  },

  // 加载数据
  loadData() {
    const questData = wx.getStorageSync('questData') || {}
    const questPools = wx.getStorageSync('questPools') || {}
    
    // 确保pools有默认结构
    if (!questPools.daily) questPools.daily = { permanent: [], random: { groups: [] } }
    if (!questPools.weekly) questPools.weekly = { permanent: [], random: { groups: [] } }
    if (!questPools.daily.permanent) questPools.daily.permanent = []
    if (!questPools.weekly.permanent) questPools.weekly.permanent = []
    if (!questPools.daily.random) questPools.daily.random = { groups: [] }
    if (!questPools.weekly.random) questPools.weekly.random = { groups: [] }
    
    this.setData({
      tasks: questData,
      pools: questPools
    })
    
    this.refreshVisible()
  },

  // 返回主界面
  goBack() {
    wx.navigateBack()
  },

  // 切换模式
  toggleMode() {
    const newMode = !this.data.isParentMode
    this.setData({ isParentMode: newMode })
    if (newMode) {
      this.refreshManageTasks()
    } else {
      this.refreshVisible()
    }
  },
  
  // 获取星期图标
  getWeekdayIcon(): string {
    const weekdayIcons = ['sun.png', 'mon.png', 'tues.png', 'wed.png', 'thur.png', 'fri.png', 'sat.png']
    return weekdayIcons[new Date().getDay()]
  },

  // 初始化横幅数据
  initBanners() {
    this.setData({
      dailyBanner: {
        date: new Date().getDate(),
        quote: getRandomQuote()
      },
      weeklyBanner: {
        weekdayIcon: this.getWeekdayIcon(),
        quote: getRandomQuote()
      }
    })
  },

  // 确保"完成所有每日/每周任务"模板存在（池中的常驻）
  ensureSpecialTasks(){
    const pools = wx.getStorageSync('questPools') || {}
    const updatedPools = PresetGroupManager.ensurePermanentPresetTasks(pools)
    wx.setStorageSync('questPools', updatedPools)
  },

  // 确保随机池存在预设分组和默认分组
  ensureRandomPresetGroups(){
    const pools = this.data.pools as any
    const updatedPools = PresetGroupManager.ensureRandomPresetGroups(pools)
    this.setData({ pools: updatedPools })
    this.save()
  },



  // 检查是否需要重置每日/每周，并执行重置
  resetIfNeeded(){
    const now = Date.now()
    const lastDaily = wx.getStorageSync('questLastDailyReset') || 0
    const lastWeekly = wx.getStorageSync('questLastWeeklyReset') || 0

    if (!this.isSameDay(now, lastDaily)){
      const tasks = this.data.tasks as any
      const pools = this.data.pools as any
      const updatedTasks = DailyResetManager.resetDaily(tasks, pools)
      this.setData({ tasks: updatedTasks })
      this.save()
      // 清理每日任务特殊重复项
      const updatedDailyTasks = DailyResetManager.cleanupSpecialDuplicates(updatedTasks)
      // 清理每周任务特殊重复项
      const finalTasks = WeeklyResetManager.cleanupSpecialDuplicates(updatedDailyTasks)
      this.setData({ tasks: finalTasks })
      this.save()
      this.refreshVisible()
      wx.setStorageSync('questLastDailyReset', now)
      // 重置每日重抽状态
      this.setData({ canRedrawDaily: true })
    }
    if (!this.isSameWeek(now, lastWeekly)){
      // 每周重置：按周日23:55为边界，这里以跨周判断
      const tasks = this.data.tasks as any
      const pools = this.data.pools as any
      const updatedTasks = WeeklyResetManager.resetWeekly(tasks, pools)
      this.setData({ tasks: updatedTasks })
      this.save()
      // 清理每日任务特殊重复项
      const updatedDailyTasks = DailyResetManager.cleanupSpecialDuplicates(updatedTasks)
      // 清理每周任务特殊重复项
      const finalTasks = WeeklyResetManager.cleanupSpecialDuplicates(updatedDailyTasks)
      this.setData({ tasks: finalTasks })
      this.save()
      this.refreshVisible()
      wx.setStorageSync('questLastWeeklyReset', now)
      // 重置每周重抽状态
      this.setData({ canRedrawWeekly: true })
    }
  },

  isSameDay(a:number,b:number){
    return TaskUtils.isSameDay(a, b)
  },
  isSameWeek(a:number,b:number){
    return TaskUtils.isSameWeek(a, b)
  },

  // 家长模式：切换子页面
  switchParentTab(e: any) {
    const tab = e.currentTarget.dataset.tab as 'daily'|'weekly'|'event'
    if (!tab) return
    this.setData({ activeTab: tab })
    this.refreshManageTasks()
  },

  // 显示发布任务面板
  showPublishPanel() {
    // 清空draft数据，确保每个任务类型独立
    this.setData({ 
      showPublishPanel: true,
      draft: {
        title: '',
        desc: '',
        coin: 0,
        diamond: 0,
        custom: '',
        hasCoin: false,
        hasDiamond: false,
        hasCustom: false,
        isPermanent: true,
        activityId: '',
        dailyTaskId: '',
        weeklyTaskId: ''
      },
      matchedActivityTask: null,
      matchedDailyTask: null,
      matchedWeeklyTask: null
    })
  },

  // 隐藏发布任务面板
  hidePublishPanel() {
    this.setData({ showPublishPanel: false })
  },

  // 切换三个一级tab
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab as 'daily'|'weekly'|'event'
    if (!tab) return
    this.setData({ activeTab: tab, activeSub: 'available' })
    this.refreshVisible()
  },

  // 切换二级子tab
  switchSub(e: any) {
    const sub = e.currentTarget.dataset.sub as 'available'|'ongoing'
    if (!sub) return
    this.setData({ activeSub: sub })
    this.refreshVisible()
  },

  // 接取任务：available -> ongoing (仅用于活动)
  acceptTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { activeTab, tasks } = this.data as any
    // 只有活动需要接取流程
    if (activeTab === 'daily' || activeTab === 'weekly') return
    
    if (StudentEventTasks.acceptTask(id, tasks)) {
    this.setData({ tasks })
    this.save()
    this.refreshVisible()
    }
  },

  // 放弃任务：ongoing -> available (仅用于活动)
  abandonTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { activeTab, tasks } = this.data as any
    // 只有活动需要放弃流程
    if (activeTab === 'daily' || activeTab === 'weekly') return
    
    if (StudentEventTasks.abandonTask(id, tasks)) {
    this.setData({ tasks })
    this.save()
    this.refreshVisible()
    }
  },

  // 提交任务：置为待审核、置顶并灰显
  submitTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { activeTab, tasks } = this.data as any
    
    // 每日/每周：处理特殊“完成所有X任务”逻辑
    if (activeTab === 'daily') {
      if (StudentDailyTasks.submitTask(id, tasks)) {
      this.setData({ tasks })
      this.save()
      this.refreshVisible()
      }
      return
    }
    
    if (activeTab === 'weekly') {
      if (StudentWeeklyTasks.submitTask(id, tasks)) {
        this.setData({ tasks })
        this.save()
        this.refreshVisible()
      }
      return
    }
    
    // 活动：从ongoing提交
    if (StudentEventTasks.submitTask(id, tasks)) {
    this.setData({ tasks })
    this.save()
    this.refreshVisible()
    }
  },

  // 家长模式：发布任务
  publishTask() {
    const { draft, activeTab, tasks, pools } = this.data as any
    const newTask = ParentTaskManager.publishTask(draft, activeTab, tasks, pools)
    
    if (newTask) {
      this.setData({ tasks, pools, draft: TaskUtils.resetDraft() })
      this.save()
      this.refreshManageTasks()
      this.hidePublishPanel()
    }
  },

  // 家长模式：删除任务
  deleteTask(e: any) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {          
          // 创建新的对象副本，避免直接修改原对象
          const tasks = JSON.parse(JSON.stringify(this.data.tasks))
          const pools = JSON.parse(JSON.stringify(this.data.pools))
          const deleted = ParentTaskManager.deleteTask(id, this.data.activeTab, tasks, pools)
          
          if (deleted) {
    this.setData({ tasks, pools })
    this.save()
            
            // 强制刷新显示
    this.refreshManageTasks()
            this.refreshVisible()
          } else {
            wx.showToast({ title:'未找到要删除的任务', icon:'none' })
          }
        }
      }
    })
  },

  // 家长模式：审核通过任务
  approveTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks, pendingReviewTasks, availableTasks, manageTasks } = this.data as any
    
    // 从当前显示的任务列表中找到对应的任务和评分
    let taskToApprove: any = null
    let appliedScore: any = 100 // 默认100分
    
    // 查找任务和评分
    const allTasks = [...(pendingReviewTasks || []), ...(availableTasks || []), ...(manageTasks || [])]
    const foundTask = allTasks.find((t: any) => t.id === id)
    
    if (foundTask) {
      taskToApprove = foundTask
      appliedScore = foundTask.score || 100
    }
    
    if (!taskToApprove) {
      wx.showToast({ title:'任务不存在', icon:'none' })
      return
    }
    
    // 解析分数（允许字符串），非法则提示；允许0-100，默认0
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
    
    let foundTab: 'daily'|'weekly'|'achieve'|'event'|null = null
    let targetTask: any = null
    for (const tab of ['daily','weekly','achieve','event'] as const){
      const ongoing = tasks[tab]?.ongoing || []
      const t = ongoing.find((x: any) => x.id === id)
      if (t) {
        t.score = score
        targetTask = t
        foundTab = tab
        break
      }
    }

    if (!foundTab || !targetTask) { wx.showToast({ title:'任务不存在', icon:'none' }); return }

    if (score >= 60) {
      // 发放奖励
      RewardManager.grantRewards(targetTask, score)
      // 审批通过并归档/移除
      if (ParentTaskManager.approveTask(id, foundTab as any, tasks, score)) {
        this.setData({ tasks })
        this.save()
        this.refreshManageTasks()
      }
    } else {
      // 分数不足：驳回并退回未提交
      if (ParentTaskManager.rejectTask(id, foundTab as any, tasks)) {
        this.setData({ tasks })
        this.save()
        this.refreshManageTasks()
        wx.showToast({ title:'已驳回', icon:'none' })
      }
    }
  },

  // 家长模式：驳回任务
  rejectTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { activeTab, tasks } = this.data as any
    const rejected = ParentTaskManager.rejectTask(id, activeTab, tasks)
    
    if (rejected) {
      this.setData({ tasks })
      this.save()
      this.refreshManageTasks()
      wx.showToast({ title:'已驳回', icon:'none' })
    }
  },

  // 刷新可见任务
  refreshVisible() {
    const { activeTab, activeSub, tasks } = this.data
    
    if (activeTab === 'event') {
      // 活动任务：根据子标签显示（待接取/进行中）
      const eventTasks = StudentEventTasks.renderTasks(tasks, activeSub as 'available'|'ongoing')
      this.setData({ visibleTasks: eventTasks })
    } else {
      // 每日/每周任务：根据子标签显示
      const tabTasks = tasks[activeTab] || { available: [], ongoing: [] }
      const visibleTasks = activeSub === 'available' ? tabTasks.available : tabTasks.ongoing
      this.setData({ visibleTasks })
    }
    
    // 刷新家长模式数据
    if (this.data.isParentMode) {
      this.refreshManageTasks()
    }
  },

  // 刷新家长模式任务管理数据
  refreshManageTasks() {
    const { activeTab, tasks } = this.data
    
    if (activeTab === 'event') {
      // 活动任务：显示所有任务（包括所有状态）
      const eventTasks = ParentEventTasks.getAllEventTasks(tasks)
      this.setData({
        manageTasks: eventTasks,
        pendingReviewTasks: ParentEventTasks.getPendingReviewTasks(tasks),
        availableTasks: ParentEventTasks.getAvailableTasks(tasks)
      })
    } else if (activeTab === 'daily') {
      // 每日任务：只显示待审核任务
      const pendingReviewTasks = ParentDailyTasks.getPendingReviewTasks(tasks)
      this.setData({
        pendingReviewTasks,
        availableTasks: [],
        manageTasks: []
      })
    } else if (activeTab === 'weekly') {
      // 每周任务：只显示待审核任务
      const pendingReviewTasks = ParentWeeklyTasks.getPendingReviewTasks(tasks)
      this.setData({
        pendingReviewTasks,
        availableTasks: [],
        manageTasks: []
      })
    }
  },

  // 格式化时间
  formatTime(timestamp: number): string {
    return TaskUtils.formatTime(timestamp)
  },

  // 草稿输入
  onDraftTitle(e: any) { this.setData({ 'draft.title': e.detail.value }) },
  onDraftDesc(e: any) { this.setData({ 'draft.desc': e.detail.value }) },
  onDraftReward(e: any) { this.setData({ 'draft.reward': e.detail.value }) },
  onDraftTab(e: any) { this.setData({ draftTabIndex: parseInt(e.detail.value,10)||0 }) },

  // 活动任务ID输入 - 自动匹配活动任务信息
  onActivityTaskIdInput(e: any) {
    const activityTaskId = e.detail.value.trim()
    const { activityTaskManager } = this.data
    
    // 更新ID到draft中
    this.setData({
      'draft.activityId': activityTaskId
    })
    
    if (!activityTaskId) {
      this.setData({ 
        matchedActivityTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      return
    }
    
    if (!activityTaskManager) {
      console.error('活动任务管理器未初始化')
      return
    }
    
    // 查找活动任务
    const activityTask = activityTaskManager.getTaskById(activityTaskId)
    
    if (activityTask) {
      // 匹配成功，自动填充信息
      this.setData({
        matchedActivityTask: activityTask,
        'draft.title': activityTask.name,
        'draft.coin': activityTask.coin,
        'draft.diamond': activityTask.diamond,
        'draft.hasCoin': activityTask.coin > 0,
        'draft.hasDiamond': activityTask.diamond > 0
      })
      wx.showToast({ title: '活动任务匹配成功', icon: 'success' })
    } else {
      // 匹配失败
      this.setData({ 
        matchedActivityTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      wx.showToast({ title: '未找到该活动任务ID', icon: 'none' })
    }
  },

  // 每日任务ID输入 - 自动匹配每日任务信息
  onDailyTaskIdInput(e: any) {
    const dailyTaskId = e.detail.value.trim()
    const { dailyTaskManager } = this.data
    
    // 更新ID到draft中
    this.setData({
      'draft.dailyTaskId': dailyTaskId
    })
    
    if (!dailyTaskId) {
      this.setData({ 
        matchedDailyTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      return
    }
    
    if (!dailyTaskManager) {
      console.error('每日任务管理器未初始化')
      return
    }
    
    // 查找每日任务
    const dailyTask = dailyTaskManager.getTaskById(dailyTaskId)
    
    if (dailyTask) {
      // 匹配成功，自动填充信息
      this.setData({
        matchedDailyTask: dailyTask,
        'draft.title': dailyTask.name,
        'draft.coin': dailyTask.coin,
        'draft.diamond': dailyTask.diamond,
        'draft.hasCoin': dailyTask.coin > 0,
        'draft.hasDiamond': dailyTask.diamond > 0
      })
      wx.showToast({ title: '每日任务匹配成功', icon: 'success' })
    } else {
      // 匹配失败
      this.setData({ 
        matchedDailyTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      wx.showToast({ title: '未找到该每日任务ID', icon: 'none' })
    }
  },

  // 每周任务ID输入 - 自动匹配每周任务信息
  onWeeklyTaskIdInput(e: any) {
    const weeklyTaskId = e.detail.value.trim()
    const { weeklyTaskManager } = this.data
    
    // 更新ID到draft中
    this.setData({
      'draft.weeklyTaskId': weeklyTaskId
    })
    
    if (!weeklyTaskId) {
      this.setData({ 
        matchedWeeklyTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      return
    }
    
    if (!weeklyTaskManager) {
      console.error('每周任务管理器未初始化')
      return
    }
    
    // 查找每周任务
    const weeklyTask = weeklyTaskManager.getTaskById(weeklyTaskId)
    
    if (weeklyTask) {
      // 匹配成功，自动填充信息
      this.setData({
        matchedWeeklyTask: weeklyTask,
        'draft.title': weeklyTask.name,
        'draft.coin': weeklyTask.coin,
        'draft.diamond': weeklyTask.diamond,
        'draft.hasCoin': weeklyTask.coin > 0,
        'draft.hasDiamond': weeklyTask.diamond > 0
      })
      wx.showToast({ title: '每周任务匹配成功', icon: 'success' })
    } else {
      // 匹配失败
      this.setData({ 
        matchedWeeklyTask: null,
        'draft.title': '',
        'draft.coin': 0,
        'draft.diamond': 0,
        'draft.hasCoin': false,
        'draft.hasDiamond': false
      })
      wx.showToast({ title: '未找到该每周任务ID', icon: 'none' })
    }
  },



  // 自定义奖励相关方法
  toggleCustomReward() {
    const current = this.data.draft.hasCustom
    this.setData({ 'draft.hasCustom': !current })
  },
  
  onCustomInput(e: any) {
    this.setData({ 'draft.custom': e.detail.value })
  },

  // 评分输入
  onScoreInput(e: any) {
    const id = e.currentTarget.dataset.id
    const value = e.detail.value || ''
    // 清空则自动变为0
    const finalValue = value === '' ? '0' : value

    // 更新对应任务的评分
    const { pendingReviewTasks, availableTasks, manageTasks } = this.data as any
    const allTasks = [...(pendingReviewTasks || []), ...(availableTasks || []), ...(manageTasks || [])]
    const taskIndex = allTasks.findIndex((t: any) => t.id === id)

    if (taskIndex >= 0) {
      allTasks[taskIndex].score = finalValue
      // 根据当前激活的列表同步更新
      if (pendingReviewTasks && pendingReviewTasks.find((t: any) => t.id === id)) {
        const idx = pendingReviewTasks.findIndex((t: any) => t.id === id)
        if (idx >= 0) {
          pendingReviewTasks[idx].score = finalValue
          this.setData({ pendingReviewTasks })
        }
      } else if (availableTasks && availableTasks.find((t: any) => t.id === id)) {
        const idx = availableTasks.findIndex((t: any) => t.id === id)
        if (idx >= 0) {
          availableTasks[idx].score = finalValue
          this.setData({ availableTasks })
        }
      } else {
        // 管理列表回写
        this.setData({ manageTasks })
      }
    }
  },

  // 切换常驻/随机开关
  togglePermanent() {
    const current = this.data.draft.isPermanent
    this.setData({ 'draft.isPermanent': !current })
  },

  // 设置随机模式
  setRandom() {
    this.setData({ 'draft.isPermanent': false })
  },

  // 设置常驻模式
  setPermanent() {
    this.setData({ 'draft.isPermanent': true })
  },

  // 导航到每日常驻任务池
  navigateToPermanentPool() {
    if (this.data.activeTab === 'daily') {
      wx.navigateTo({ url: '/pages/daily-permanent/daily-permanent' })
    } else if (this.data.activeTab === 'weekly') {
      wx.navigateTo({ url: '/pages/weekly-permanent/weekly-permanent' })
    }
  },

  // 导航到每日/每周随机任务池
  navigateToRandomPool() {
    if (this.data.activeTab === 'daily') {
      wx.navigateTo({ url: '/pages/daily-random/daily-random' })
    } else if (this.data.activeTab === 'weekly') {
      wx.navigateTo({ url: '/pages/weekly-random/weekly-random' })
    }
  },

  save() {
    wx.setStorageSync('questData', this.data.tasks)
    wx.setStorageSync('questPools', this.data.pools)
  },

  deletePoolTask(e: any) {
    const id = e.currentTarget.dataset.id
    const pool = e.currentTarget.dataset.pool
    const group = e.currentTarget.dataset.group
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
            const pools = this.data.pools as any
          const deleted = ParentTaskManager.deletePoolTask(id, pool, group, this.data.activeTab as 'daily' | 'weekly', pools)
          if (deleted) {
              this.setData({ pools })
              this.save()
              wx.showToast({ title: '已删除', icon: 'success' })
          }
        }
      }
    })
  },

  // 编辑任务
  editTask(e: any) {
    const id = e.currentTarget.dataset.id
    const { tasks } = this.data as any
    
    // 在活动任务中查找
    const eventTasks = [...(tasks.event?.available || []), ...(tasks.event?.ongoing || [])]
    const task = eventTasks.find((t: any) => t.id === id)

    if (task) {
      this.setData({
        editDraft: {
          title: task.title,
          desc: task.desc,
          coin: task.coin,
          diamond: task.diamond,
          custom: task.custom,
          hasCoin: task.hasCoin,
          hasDiamond: task.hasDiamond,
          hasCustom: task.hasCustom
        },
        editingTaskId: id,
        showEditPanel: true
      })
    }
  },

  // 隐藏编辑面板
  hideEditPanel() {
    this.setData({ showEditPanel: false })
  },

  // 更新任务
  updateTask() {
    const { editDraft, editingTaskId } = this.data

    if (!editDraft.title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const { tasks } = this.data as any
    
    if (ParentTaskManager.editTask(editingTaskId, editDraft, tasks)) {
      this.save()
      this.refreshVisible()
      this.refreshManageTasks()
      wx.showToast({ title: '已更新', icon: 'success' })
      this.hideEditPanel()
    }
  },

  // 编辑任务输入事件处理
  onEditDraftTitle(e: any) {
    this.setData({ 'editDraft.title': e.detail.value })
  },

  onEditDraftDesc(e: any) {
    this.setData({ 'editDraft.desc': e.detail.value })
  },

  // 编辑任务奖励切换
  toggleEditCoinReward() {
    const current = this.data.editDraft.hasCoin
    this.setData({ 'editDraft.hasCoin': !current })
  },

  toggleEditDiamondReward() {
    const current = this.data.editDraft.hasDiamond
    this.setData({ 'editDraft.hasDiamond': !current })
  },

  toggleEditCustomReward() {
    const current = this.data.editDraft.hasCustom
    this.setData({ 'editDraft.hasCustom': !current })
  },

  // 编辑任务奖励输入
  onEditRewardInput(e: any) {
    const type = e.currentTarget.dataset.type
    let value = parseInt(e.detail.value, 10) || 0
    
    // 确保是10的倍数且不为负数
    if (type === 'coin') {
      value = Math.max(0, Math.floor(value / 10) * 10)
    } else if (type === 'diamond') {
      value = Math.max(0, Math.floor(value / 10) * 10)
    }
    
    this.setData({ [`editDraft.${type}`]: value })
  },

  // 编辑任务奖励调整
  increaseEditReward(e: any) {
    const type = e.currentTarget.dataset.type
    const editDraft = this.data.editDraft as any
    const current = editDraft[type] || 0
    const increment = type === 'coin' ? 100 : 10
    this.setData({ [`editDraft.${type}`]: current + increment })
  },

  decreaseEditReward(e: any) {
    const type = e.currentTarget.dataset.type
    const editDraft = this.data.editDraft as any
    const current = editDraft[type] || 0
    const decrement = type === 'coin' ? 100 : 10
    const newValue = Math.max(0, current - decrement)
    this.setData({ [`editDraft.${type}`]: newValue })
  },

  onEditCustomInput(e: any) {
    this.setData({ 'editDraft.custom': e.detail.value })
  },

  // 检查重抽状态
  checkRedrawStatus() {
    const today = new Date().toDateString()
    const lastDailyRedrawDate = wx.getStorageSync('lastDailyRedrawDate')
    const lastWeeklyRedrawDate = wx.getStorageSync('lastWeeklyRedrawDate')
    
    // 检查每日任务重抽状态
    if (lastDailyRedrawDate === today) {
      this.setData({ canRedrawDaily: false })
    } else {
      this.setData({ canRedrawDaily: true })
    }
    
    // 检查每周任务重抽状态
    if (lastWeeklyRedrawDate === today) {
      this.setData({ canRedrawWeekly: false })
    } else {
      this.setData({ canRedrawWeekly: true })
    }
  },

  // 重抽每日任务
  redrawDailyTasks() {
    this.performDailyRedraw()
  },

  // 重抽每周任务
  redrawWeeklyTasks() {
    this.performWeeklyRedraw()
  },

  // 执行每日任务重抽逻辑
  performDailyRedraw() {
    try {
      // 获取任务池数据
      const questData = wx.getStorageSync('questData') || {}
      const pools = wx.getStorageSync('questPools') || {}
      
      // 使用组件重抽每日任务
      const updatedQuestData = StudentDailyTasks.redrawTasks(questData, pools)
      
      // 保存更新后的任务数据
      wx.setStorageSync('questData', updatedQuestData)
      
      // 记录重抽日期
      const today = new Date().toDateString()
      wx.setStorageSync('lastDailyRedrawDate', today)
      
      // 更新重抽状态
      this.setData({ canRedrawDaily: false })
      
      // 重抽成功，直接刷新页面数据
      this.loadData()
      this.refreshVisible()
    } catch (error) {
      console.error('每日任务重抽失败:', error)
      wx.showToast({
        title: '重抽失败',
        icon: 'error'
      })
    }
  },

  // 执行每周任务重抽逻辑
  performWeeklyRedraw() {
    try {
      // 获取任务池数据
      const questData = wx.getStorageSync('questData') || {}
      const pools = wx.getStorageSync('questPools') || {}
      
      // 使用组件重抽每周任务
      const updatedQuestData = StudentWeeklyTasks.redrawTasks(questData, pools)
      
      // 保存更新后的任务数据
      wx.setStorageSync('questData', updatedQuestData)
      
      // 记录重抽日期
      const today = new Date().toDateString()
      wx.setStorageSync('lastWeeklyRedrawDate', today)
      
      // 更新重抽状态
      this.setData({ canRedrawWeekly: false })
      
      // 重抽成功，直接刷新页面数据
      this.loadData()
      this.refreshVisible()
    } catch (error) {
      console.error('每周任务重抽失败:', error)
      wx.showToast({
        title: '重抽失败',
        icon: 'error'
      })
    }
  },

  // 数组随机打乱函数
  shuffleArray(array: any[]) {
    return TaskUtils.shuffleArray(array)
  },



}) 