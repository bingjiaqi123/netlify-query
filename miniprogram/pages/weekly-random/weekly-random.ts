import { TaskGroupManager } from '../../data/task-groups.js'

Page({
  data: {
    randomGroups: [] as any[],
    newGroupName: '',
    newGroupId: '',
    matchedGroup: null as any,
    taskGroupManager: null as any,
    showEditPanel: false,
    editingTaskId: '',
    editingGroup: '',
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
    this.setData({
      taskGroupManager: new TaskGroupManager()
    })
    this.loadRandomGroups()
  },

  onShow() {
    this.loadRandomGroups()
  },

  // 计算任务展示ID
  computeTaskDisplayId(tab: 'daily' | 'weekly', task: any): string {
    const a = (task?.taskId || '').toString().trim()
    const b = (task?.dailyTaskId || '').toString().trim()
    const c = (task?.weeklyTaskId || '').toString().trim()
    const d = (task?.id || '').toString().trim()
    if (a && a.length === 2) return a
    if (tab === 'daily' && b && b.length === 2) return b
    if (tab === 'weekly' && c && c.length === 2) return c
    if (d && d.length === 2) return d
    // 按标题匹配标准任务库，尽量补足两位ID
    try {
      if (tab === 'daily') {
        const { DailyTaskManager } = require('../../data/daily-tasks.js')
        const dm = new DailyTaskManager()
        const byName = dm.getAllTasks().find((t: any) => t.name === task?.title)
        if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
      } else if (tab === 'weekly') {
        const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
        const wm = new WeeklyTaskManager()
        const byName = wm.getAllTasks().find((t: any) => t.name === task?.title)
        if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
      }
    } catch (e) {}
    return ''
  },

  // 加载随机任务组
  loadRandomGroups() {
    const pools = wx.getStorageSync('questPools') || {}
    const weeklyRandom = pools.weekly?.random?.groups || []
    const manager = this.data.taskGroupManager || new TaskGroupManager()
    
    // 为每个组添加选择状态与补全组ID
    const groupsWithSelection = weeklyRandom.map((group: any) => {
      let gid = typeof group.id === 'string' ? group.id.trim() : ''
      if (!gid || gid.length !== 1) {
        const name = (group.name || '').toString()
        if (name === '默认') {
          gid = 'y'
        } else if (name) {
          const matched = manager.getAllGroups().find((g: any) => g.name === name)
          if (matched && typeof matched.id === 'string' && matched.id.length === 1) {
            gid = matched.id
          }
        }
      }
      const tasks = Array.isArray(group.tasks) ? group.tasks : []
      const tasksWithId = tasks.map((t: any) => ({
        ...t,
        displayId: this.computeTaskDisplayId('weekly', t)
      }))
      return {
      ...group,
        id: gid || group.id,
        tasks: tasksWithId,
      selected: group.selected || {}
      }
    })
    
    this.setData({ randomGroups: groupsWithSelection })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },



  // 删除任务
  deleteTask(e: any) {
    const id = e.currentTarget.dataset.id
    const groupName = e.currentTarget.dataset.group
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const pools = wx.getStorageSync('questPools') || {}
          const group = pools.weekly.random.groups.find((g: any) => g.name === groupName)
          
          if (group) {
            group.tasks = group.tasks.filter((t: any) => t.id !== id)
            wx.setStorageSync('questPools', pools)
            this.loadRandomGroups()
            wx.showToast({ title: '已删除', icon: 'success' })
          }
        }
      }
    })
  },

  

  // 删除组
  deleteGroup(e: any) {
    const groupName = e.currentTarget.dataset.name
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除组"${groupName}"吗？这将删除组内的所有任务。`,
      success: (res) => {
        if (res.confirm) {
          const pools = wx.getStorageSync('questPools') || {}
          pools.weekly.random.groups = pools.weekly.random.groups.filter((g: any) => g.name !== groupName)
          wx.setStorageSync('questPools', pools)
          this.loadRandomGroups()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 切换任务选择
  toggleSelectTask(e: any) {
    const groupName = e.currentTarget.dataset.group
    const taskId = e.currentTarget.dataset.id
    const groups = this.data.randomGroups
    const group = groups.find((g: any) => g.name === groupName)
    
    if (group) {
      if (!group.selected) group.selected = {}
      group.selected[taskId] = !group.selected[taskId]
      this.setData({ randomGroups: groups })
    }
  },

  // 修改抽取数量
  onDrawCountInput(e: any) {
    const groupName = e.currentTarget.dataset.name
    const drawCount = parseInt(e.detail.value) || 0
    
    const pools = wx.getStorageSync('questPools') || {}
    const group = pools.weekly.random.groups.find((g: any) => g.name === groupName)
    
    if (group) {
      group.drawCount = drawCount
      wx.setStorageSync('questPools', pools)
    }
  },

  // 切换多选模式
  toggleMultiSelect(e: any) {
    const groupName = e.currentTarget.dataset.name
    // TODO: 实现多选模式切换
    wx.showToast({ title: '多选模式开发中', icon: 'none' })
  },



  onNewGroupNameInput(e: any) {
    this.setData({
      newGroupName: e.detail.value
    })
  },

  // 组ID输入 - 自动匹配组名
  onNewGroupIdInput(e: any) {
    const groupId = e.detail.value.trim()
    const { taskGroupManager } = this.data
    
    this.setData({
      newGroupId: groupId
    })
    
    if (!groupId) {
      this.setData({ 
        matchedGroup: null,
        newGroupName: ''
      })
      return
    }
    
    if (!taskGroupManager) {
      console.error('组名管理器未初始化')
      return
    }
    
    // 查找组名
    const taskGroup = taskGroupManager.getGroupById(groupId)
    
    if (taskGroup) {
      // 匹配成功，自动填充组名
      this.setData({
        matchedGroup: taskGroup,
        newGroupName: taskGroup.name
      })
      wx.showToast({ title: '组名匹配成功', icon: 'success' })
    } else {
      // 匹配失败
      this.setData({ 
        matchedGroup: null,
        newGroupName: ''
      })
      wx.showToast({ title: '未找到该组ID', icon: 'none' })
    }
  },

  addToGroup() {
    const { newGroupName, newGroupId, matchedGroup } = this.data
    const targetGroupName = newGroupName.trim()
    const targetGroupId = newGroupId.trim()
    
    // 获取所有选中的任务
    const selectedTasks: any[] = []
    this.data.randomGroups.forEach((group: any) => {
      if (group.selected) {
        Object.keys(group.selected).forEach((taskId: string) => {
          if (group.selected[taskId]) {
            const task = group.tasks.find((t: any) => t.id === taskId)
            if (task) {
              selectedTasks.push({ ...task, sourceGroup: group.name })
            }
          }
        })
      }
    })

    if (selectedTasks.length === 0) {
      wx.showToast({ title: '请先选择要添加的任务', icon: 'none' })
      return
    }

    const pools = wx.getStorageSync('questPools') || {}
    if (!pools.weekly || !pools.weekly.random) {
      pools.weekly = { random: { groups: [] } }
    }

    let targetGroup: any
    let finalGroupName: string
    let finalGroupId: string
    let finalGroupDescription: string

    if (matchedGroup) {
      // 使用匹配的组信息
      finalGroupName = matchedGroup.name
      finalGroupId = matchedGroup.id
      finalGroupDescription = matchedGroup.description
      
      // 查找同名组
      targetGroup = pools.weekly.random.groups.find((g: any) => g.name === finalGroupName)
      
      if (!targetGroup) {
        // 创建新组
        targetGroup = {
          id: finalGroupId,
          name: finalGroupName,
          description: finalGroupDescription,
          tasks: [],
          drawCount: 1,
          selected: {}
        }
        pools.weekly.random.groups.push(targetGroup)
      }
    } else if (targetGroupName) {
      // 使用手动输入的组名
      finalGroupName = targetGroupName
      finalGroupId = targetGroupId || ''
      finalGroupDescription = ''
      
      // 查找同名组
      targetGroup = pools.weekly.random.groups.find((g: any) => g.name === finalGroupName)
      
      if (!targetGroup) {
        // 创建新组
        targetGroup = {
          id: finalGroupId,
          name: finalGroupName,
          description: finalGroupDescription,
          tasks: [],
          drawCount: 1,
          selected: {}
        }
        pools.weekly.random.groups.push(targetGroup)
      }
    } else {
      wx.showToast({ title: '请输入组名或组ID', icon: 'none' })
      return
    }

    // 将选中的任务添加到目标组
    let addedCount = 0
    selectedTasks.forEach((task: any) => {
      // 检查任务是否已存在于目标组中
      const existingTask = targetGroup.tasks.find((t: any) => t.id === task.id)
      if (!existingTask) {
        // 创建新任务（移除sourceGroup属性）
        const { sourceGroup, ...newTask } = task
        targetGroup.tasks.push(newTask)
        addedCount++
        
        // 从原组中移除任务
        const sourceGroupObj = pools.weekly.random.groups.find((g: any) => g.name === task.sourceGroup)
        if (sourceGroupObj) {
          sourceGroupObj.tasks = sourceGroupObj.tasks.filter((t: any) => t.id !== task.id)
        }
      }
    })

    wx.setStorageSync('questPools', pools)
    this.loadRandomGroups()
    this.setData({ 
      newGroupName: '',
      newGroupId: '',
      matchedGroup: null
    })
    
    if (addedCount > 0) {
      wx.showToast({ 
        title: `成功添加 ${addedCount} 个任务到 ${finalGroupName}`,
        icon: 'success'
      })
    } else {
      wx.showToast({ 
        title: '所有任务都已存在于目标组中',
        icon: 'none'
      })
    }
  },

  // 编辑任务
  editTask(e: any) {
    const id = e.currentTarget.dataset.id
    const groupName = e.currentTarget.dataset.group
    const group = this.data.randomGroups.find((g: any) => g.name === groupName)
    const task = group?.tasks.find((t: any) => t.id === id)

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
        editingGroup: groupName,
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
    const { draft, editingTaskId, editingGroup } = this.data

    if (!draft.title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const pools = wx.getStorageSync('questPools') || {}
    const group = pools.weekly.random.groups.find((g: any) => g.name === editingGroup)
    const task = group?.tasks.find((t: any) => t.id === editingTaskId)

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
      this.loadRandomGroups()
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