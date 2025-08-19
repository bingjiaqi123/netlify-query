// 家长模式任务管理组件
export class ParentTaskManager {
  // 发布任务
  static publishTask(draft: any, activeTab: 'daily' | 'weekly' | 'event', tasks: any, pools: any) {
    let newTask = null
    
    if (activeTab === 'daily') {
      newTask = this.publishDailyTask(draft, pools)
    } else if (activeTab === 'weekly') {
      newTask = this.publishWeeklyTask(draft, pools)
    } else if (activeTab === 'event') {
      newTask = this.publishEventTask(draft, tasks)
    }
    
    return newTask
  }

  // 发布每日任务
  static publishDailyTask(draft: any, pools: any) {
    if (!draft.title.trim()) return null
    
    const newTask = {
      id: `daily_${Date.now()}_${Math.random()}`,
      taskId: (draft.dailyTaskId || '').toString().trim(),
      dailyTaskId: (draft.dailyTaskId || '').toString().trim(),
      weeklyTaskId: '',
      title: draft.title,
      desc: draft.desc,
      coin: draft.coin || 0,
      diamond: draft.diamond || 0,
      custom: draft.custom,
      hasCoin: draft.hasCoin,
      hasDiamond: draft.hasDiamond,
      hasCustom: draft.hasCustom,
      isPermanent: draft.isPermanent,
      createTime: Date.now()
    }
    
    if (draft.isPermanent) {
      // 添加到常驻任务池
      if (!pools.daily.permanent) pools.daily.permanent = []
      pools.daily.permanent.push(newTask)
    } else {
      // 添加到随机任务池的默认组
      if (!pools.daily.random) pools.daily.random = { groups: [] }
      let defaultGroup = pools.daily.random.groups.find((g: any) => g.name === '默认')
      if (!defaultGroup) {
        defaultGroup = { name: '默认', drawCount: 0, tasks: [] }
        pools.daily.random.groups.push(defaultGroup)
      }
      defaultGroup.tasks.push(newTask)
    }
    
    return newTask
  }

  // 发布每周任务
  static publishWeeklyTask(draft: any, pools: any) {
    if (!draft.title.trim()) return null
    
    const newTask = {
      id: `weekly_${Date.now()}_${Math.random()}`,
      taskId: (draft.weeklyTaskId || '').toString().trim(),
      dailyTaskId: '',
      weeklyTaskId: (draft.weeklyTaskId || '').toString().trim(),
      title: draft.title,
      desc: draft.desc,
      coin: draft.coin || 0,
      diamond: draft.diamond || 0,
      custom: draft.custom,
      hasCoin: draft.hasCoin,
      hasDiamond: draft.hasDiamond,
      hasCustom: draft.hasCustom,
      isPermanent: draft.isPermanent,
      createTime: Date.now()
    }
    
    if (draft.isPermanent) {
      // 添加到常驻任务池
      if (!pools.weekly.permanent) pools.weekly.permanent = []
      pools.weekly.permanent.push(newTask)
    } else {
      // 添加到随机任务池的默认组
      if (!pools.weekly.random) pools.weekly.random = { groups: [] }
      let defaultGroup = pools.weekly.random.groups.find((g: any) => g.name === '默认')
      if (!defaultGroup) {
        defaultGroup = { name: '默认', drawCount: 0, tasks: [] }
        pools.weekly.random.groups.push(defaultGroup)
      }
      defaultGroup.tasks.push(newTask)
    }
    
    return newTask
  }

  // 发布活动任务
  static publishEventTask(draft: any, tasks: any) {
    if (!draft.title.trim()) return null
    
    const newTask = {
      id: `event_${Date.now()}_${Math.random()}`,
      title: draft.title,
      desc: draft.desc,
      coin: draft.coin || 0,
      diamond: draft.diamond || 0,
      custom: draft.custom,
      hasCoin: draft.hasCoin,
      hasDiamond: draft.hasDiamond,
      hasCustom: draft.hasCustom,
      createTime: Date.now(),
      activityId: draft.activityId // 保存原始活动任务ID
    }
    
    // 强化初始化，避免 undefined 访问
    if (!tasks || typeof tasks !== 'object') return newTask
    if (!tasks.event || typeof tasks.event !== 'object') tasks.event = { available: [], ongoing: [] }
    if (!Array.isArray(tasks.event.available)) tasks.event.available = []
    
    tasks.event.available.push(newTask)
    
    return newTask
  }

  // 删除任务
  static deleteTask(taskId: string, activeTab: 'daily' | 'weekly' | 'event', tasks: any, pools: any) {
    let deleted = false
    
    if (activeTab === 'daily') {
      deleted = this.deleteDailyTask(taskId, tasks, pools)
    } else if (activeTab === 'weekly') {
      deleted = this.deleteWeeklyTask(taskId, tasks, pools)
    } else if (activeTab === 'event') {
      deleted = this.deleteEventTask(taskId, tasks)
    }
    
    return deleted
  }

  // 删除每日任务
  static deleteDailyTask(taskId: string, tasks: any, pools: any) {
    // 从任务列表中删除
    const available = tasks.daily?.available || []
    const ongoing = tasks.daily?.ongoing || []
    
    let deleted = false
    
    // 从可用列表中删除
    const availIdx = available.findIndex((t: any) => t.id === taskId)
    if (availIdx >= 0) {
      available.splice(availIdx, 1)
      deleted = true
    }
    
    // 从进行中列表删除
    const ongoingIdx = ongoing.findIndex((t: any) => t.id === taskId)
    if (ongoingIdx >= 0) {
      ongoing.splice(ongoingIdx, 1)
      deleted = true
    }
    
    // 从任务池中删除
    if (pools.daily?.permanent) {
      const permIdx = pools.daily.permanent.findIndex((t: any) => t.id === taskId)
      if (permIdx >= 0) {
        pools.daily.permanent.splice(permIdx, 1)
        deleted = true
      }
    }
    
    return deleted
  }

  // 删除每周任务
  static deleteWeeklyTask(taskId: string, tasks: any, pools: any) {
    // 从任务列表中删除
    const available = tasks.weekly?.available || []
    const ongoing = tasks.weekly?.ongoing || []
    
    let deleted = false
    
    // 从可用列表中删除
    const availIdx = available.findIndex((t: any) => t.id === taskId)
    if (availIdx >= 0) {
      available.splice(availIdx, 1)
      deleted = true
    }
    
    // 从进行中列表删除
    const ongoingIdx = ongoing.findIndex((t: any) => t.id === taskId)
    if (ongoingIdx >= 0) {
      ongoing.splice(ongoingIdx, 1)
      deleted = true
    }
    
    // 从任务池中删除
    if (pools.weekly?.permanent) {
      const permIdx = pools.weekly.permanent.findIndex((t: any) => t.id === taskId)
      if (permIdx >= 0) {
        pools.weekly.permanent.splice(permIdx, 1)
        deleted = true
      }
    }
    
    return deleted
  }

  // 删除活动任务
  static deleteEventTask(taskId: string, tasks: any) {
    const available = tasks.event?.available || []
    const ongoing = tasks.event?.ongoing || []
    
    let deleted = false
    
    // 从可用列表中删除
    const availIdx = available.findIndex((t: any) => t.id === taskId)
    if (availIdx >= 0) {
      available.splice(availIdx, 1)
      deleted = true
    }
    
    // 从进行中列表删除
    const ongoingIdx = ongoing.findIndex((t: any) => t.id === taskId)
    if (ongoingIdx >= 0) {
      ongoing.splice(ongoingIdx, 1)
      deleted = true
    }
    
    return deleted
  }

  // 删除任务池中的任务
  static deletePoolTask(taskId: string, pool: string, group: string, activeTab: 'daily' | 'weekly', pools: any) {
    if (pool === 'permanent') {
      // 删除常驻任务
      pools[activeTab].permanent = pools[activeTab].permanent.filter((t: any) => t.id !== taskId)
      return true
    } else if (pool === 'random' && group) {
      // 删除随机任务
      const groupData = pools[activeTab].random.groups.find((g: any) => g.name === group)
      if (groupData) {
        groupData.tasks = groupData.tasks.filter((t: any) => t.id !== taskId)
        return true
      }
    }
    return false
  }

  // 编辑任务
  static editTask(taskId: string, editDraft: any, tasks: any) {
    // 在活动任务中查找
    const eventTasks = [...(tasks.event?.available || []), ...(tasks.event?.ongoing || [])]
    const task = eventTasks.find((t: any) => t.id === taskId)

    if (task) {
      task.title = editDraft.title
      task.desc = editDraft.desc
      task.coin = editDraft.coin
      task.diamond = editDraft.diamond
      task.custom = editDraft.custom
      task.hasCoin = editDraft.hasCoin
      task.hasDiamond = editDraft.hasDiamond
      task.hasCustom = editDraft.hasCustom
      return true
    }
    return false
  }

  // 审核通过任务
  static approveTask(taskId: string, activeTab: 'daily' | 'weekly' | 'event', tasks: any, score: number) {
    if (activeTab === 'daily') {
      return this.approveDailyTask(taskId, tasks, score)
    } else if (activeTab === 'weekly') {
      return this.approveWeeklyTask(taskId, tasks, score)
    } else if (activeTab === 'event') {
      return this.approveEventTask(taskId, tasks, score)
    }
    return false
  }

  // 审核通过每日任务
  static approveDailyTask(taskId: string, tasks: any, score: number) {
    const ongoing = tasks.daily?.ongoing || []
    const task = ongoing.find((t: any) => t.id === taskId)
    if (!task) return false
    
    task.score = score
    task.status = 'approved'
    task.reviewTime = Date.now()
    
    // 从进行中移除
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx >= 0) {
      ongoing.splice(idx, 1)
    }
    
    // 归档到已完成列表（供历史读取）
    if (!tasks.daily.completed) tasks.daily.completed = []
    tasks.daily.completed.unshift(task)
    
    return true
  }

  // 审核通过每周任务
  static approveWeeklyTask(taskId: string, tasks: any, score: number) {
    const ongoing = tasks.weekly?.ongoing || []
    const task = ongoing.find((t: any) => t.id === taskId)
    if (!task) return false
    
    task.score = score
    task.status = 'approved'
    task.reviewTime = Date.now()
    
    // 从进行中移除
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx >= 0) {
      ongoing.splice(idx, 1)
    }
    
    // 归档到已完成列表（供历史读取）
    if (!tasks.weekly.completed) tasks.weekly.completed = []
    tasks.weekly.completed.unshift(task)
    
    return true
  }

  // 审核通过活动任务
  static approveEventTask(taskId: string, tasks: any, score: number) {
    const ongoing = tasks.event?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    const task = ongoing[idx]
    task.score = score
    task.status = 'approved'
    task.reviewTime = Date.now()
    // 从进行中移除并归档到已完成列表（学生端不再显示，历史可读）
    ongoing.splice(idx, 1)
    if (!(tasks.event as any).completed) (tasks.event as any).completed = []
    ;(tasks.event as any).completed.unshift(task)
    return true
  }

  // 驳回任务
  static rejectTask(taskId: string, activeTab: 'daily' | 'weekly' | 'event', tasks: any) {
    if (activeTab === 'daily') {
      return this.rejectDailyTask(taskId, tasks)
    } else if (activeTab === 'weekly') {
      return this.rejectWeeklyTask(taskId, tasks)
    } else if (activeTab === 'event') {
      return this.rejectEventTask(taskId, tasks)
    }
    return false
  }

  // 驳回每日任务
  static rejectDailyTask(taskId: string, tasks: any) {
    const ongoing = tasks.daily?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = ongoing[idx]
    delete task.status
    delete task.reviewNote
    ongoing.splice(idx, 1)
    
    // 移回可用列表
    if (!tasks.daily.available) tasks.daily.available = []
    tasks.daily.available.unshift(task)
    
    return true
  }

  // 驳回每周任务
  static rejectWeeklyTask(taskId: string, tasks: any) {
    const ongoing = tasks.weekly?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = ongoing[idx]
    delete task.status
    delete task.reviewNote
    ongoing.splice(idx, 1)
    
    // 移回可用列表
    if (!tasks.weekly.available) tasks.weekly.available = []
    tasks.weekly.available.unshift(task)
    
    return true
  }

  // 驳回活动任务
  static rejectEventTask(taskId: string, tasks: any) {
    const ongoing = tasks.event?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = ongoing[idx]
    delete task.status
    delete task.reviewNote
    ongoing.splice(idx, 1)
    
    // 移回可用列表
    if (!tasks.event.available) tasks.event.available = []
    tasks.event.available.unshift(task)
    
    return true
  }
} 