// 家长端每周任务管理组件
export class ParentWeeklyTasks {
  // 获取待审核的每周任务
  static getPendingReviewTasks(tasks: any) {
    return (tasks.weekly?.ongoing || []).filter((t: any) => t.status === 'pending-review')
  }

  // 审核通过每周任务
  static approveTask(taskId: string, tasks: any, score: number) {
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

  // 驳回每周任务
  static rejectTask(taskId: string, tasks: any) {
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

  // 删除每周任务
  static deleteTask(taskId: string, tasks: any, pools: any) {
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

  // 发布每周任务
  static publishTask(draft: any, pools: any) {
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
} 