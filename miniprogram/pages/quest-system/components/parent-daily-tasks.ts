// 家长端每日任务管理组件
export class ParentDailyTasks {
  // 获取待审核的每日任务
  static getPendingReviewTasks(tasks: any) {
    return (tasks.daily?.ongoing || []).filter((t: any) => t.status === 'pending-review')
  }

  // 审核通过每日任务
  static approveTask(taskId: string, tasks: any, score: number) {
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

  // 驳回每日任务
  static rejectTask(taskId: string, tasks: any) {
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

  // 删除每日任务
  static deleteTask(taskId: string, tasks: any, pools: any) {
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

  // 发布每日任务
  static publishTask(draft: any, pools: any) {
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
} 