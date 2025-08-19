Page({
  data: {
    permanentTasks: [] as any[],
    showEditPanel: false,
    editingTaskId: '',
    draft: {
      title: '',
      desc: '',
      coin: 0,
      diamond: 0,
      custom: '',
      hasCoin: false,
      hasDiamond: false,
      hasCustom: false
    }
  },

  onLoad() {
    this.loadPermanentTasks()
  },

  onShow() {
    this.loadPermanentTasks()
  },

  // 计算任务展示ID
  computeTaskDisplayId(task: any): string {
    const a = (task?.taskId || '').toString().trim()
    const c = (task?.weeklyTaskId || '').toString().trim()
    const d = (task?.id || '').toString().trim()
    if (a && a.length === 2) return a
    if (c && c.length === 2) return c
    if (d && d.length === 2) return d
    try {
      const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
      const wm = new WeeklyTaskManager()
      const byName = wm.getAllTasks().find((t: any) => t.name === task?.title)
      if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
    } catch (e) {}
    return ''
  },

  // 加载常驻任务
  loadPermanentTasks() {
    const pools = wx.getStorageSync('questPools') || {}
    const weeklyPermanent = pools.weekly?.permanent || []
    const tasksWithId = weeklyPermanent.map((t: any) => ({ ...t, displayId: this.computeTaskDisplayId(t) }))
    this.setData({ permanentTasks: tasksWithId })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },



  // 删除任务
  deleteTask(e: any) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const pools = wx.getStorageSync('questPools') || {}
          pools.weekly.permanent = pools.weekly.permanent.filter((t: any) => t.id !== id)
          wx.setStorageSync('questPools', pools)
          
          this.loadPermanentTasks()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 编辑任务
  editTask(e: any) {
    const id = e.currentTarget.dataset.id
    const task = this.data.permanentTasks.find((t: any) => t.id === id)

    if (task) {
      this.setData({
        draft: {
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
    const { draft, editingTaskId } = this.data

    if (!draft.title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const pools = wx.getStorageSync('questPools') || {}
    const task = pools.weekly.permanent.find((t: any) => t.id === editingTaskId)

    if (task) {
      Object.assign(task, {
        title: draft.title,
        desc: draft.desc,
        coin: draft.coin,
        diamond: draft.diamond,
        custom: draft.custom,
        hasCoin: draft.hasCoin,
        hasDiamond: draft.hasDiamond,
        hasCustom: draft.hasCustom
      })

      wx.setStorageSync('questPools', pools)
      this.loadPermanentTasks()
      wx.showToast({ title: '已更新', icon: 'success' })
      this.hideEditPanel()
    }
  },

  // 输入事件处理
  onDraftTitle(e: any) {
    this.setData({ 'draft.title': e.detail.value })
  },

  onDraftDesc(e: any) {
    this.setData({ 'draft.desc': e.detail.value })
  },

  onCoinInput(e: any) {
    this.setData({ 'draft.coin': parseInt(e.detail.value) || 0 })
  },

  onDiamondInput(e: any) {
    this.setData({ 'draft.diamond': parseInt(e.detail.value) || 0 })
  },

  onCustomInput(e: any) {
    this.setData({ 'draft.custom': e.detail.value })
  },

  // 奖励切换
  toggleCoinReward() {
    const current = this.data.draft.hasCoin
    this.setData({ 'draft.hasCoin': !current })
  },

  toggleDiamondReward() {
    const current = this.data.draft.hasDiamond
    this.setData({ 'draft.hasDiamond': !current })
  },

  toggleCustomReward() {
    const current = this.data.draft.hasCustom
    this.setData({ 'draft.hasCustom': !current })
  },

  // 奖励输入
  onRewardInput(e: any) {
    const type = e.currentTarget.dataset.type
    let value = parseInt(e.detail.value, 10) || 0
    
    // 确保是10的倍数且不为负数
    if (type === 'coin') {
      value = Math.max(0, Math.floor(value / 10) * 10)
    } else if (type === 'diamond') {
      value = Math.max(0, Math.floor(value / 10) * 10)
    }
    
    this.setData({ [`draft.${type}`]: value })
  },

  // 奖励调整
  increaseReward(e: any) {
    const type = e.currentTarget.dataset.type
    const draft = this.data.draft as any
    const current = draft[type] || 0
    const increment = type === 'coin' ? 100 : 10
    this.setData({ [`draft.${type}`]: current + increment })
  },

  decreaseReward(e: any) {
    const type = e.currentTarget.dataset.type
    const draft = this.data.draft as any
    const current = draft[type] || 0
    const decrement = type === 'coin' ? 100 : 10
    const newValue = Math.max(0, current - decrement)
    this.setData({ [`draft.${type}`]: newValue })
  }
}) 