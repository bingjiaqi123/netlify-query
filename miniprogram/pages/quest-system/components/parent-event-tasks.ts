// 家长端活动任务管理组件
export class ParentEventTasks {
  // 获取所有活动任务（包括所有状态）
  static getAllEventTasks(tasks: any) {
    return [
      ...(tasks.event?.available || []), 
      ...(tasks.event?.ongoing || []),
      ...((tasks.event as any)?.pending || []),
      ...((tasks.event as any)?.completed || [])
    ]
  }

  // 获取待审核的活动任务
  static getPendingReviewTasks(tasks: any) {
    return (tasks.event?.ongoing || []).filter((t: any) => t.status === 'pending-review')
  }

  // 获取可用的活动任务
  static getAvailableTasks(tasks: any) {
    return (tasks.event?.available || []).filter((t: any) => !t.status || t.status === 'available')
  }

  // 审核通过活动任务
  static approveTask(taskId: string, tasks: any, score: number) {
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

  // 驳回活动任务
  static rejectTask(taskId: string, tasks: any) {
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

  // 删除活动任务
  static deleteTask(taskId: string, tasks: any) {
    // 从任务列表中删除
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

  // 编辑活动任务
  static editTask(taskId: string, editData: any, tasks: any) {
    const eventTasks = [...(tasks.event?.available || []), ...(tasks.event?.ongoing || [])]
    const task = eventTasks.find((t: any) => t.id === taskId)
    
    if (task) {
      Object.assign(task, {
        title: editData.title,
        desc: editData.desc,
        coin: editData.coin,
        diamond: editData.diamond,
        custom: editData.custom,
        hasCoin: editData.hasCoin,
        hasDiamond: editData.hasDiamond,
        hasCustom: editData.hasCustom
      })
      return true
    }
    
    return false
  }

  // 发布活动任务
  static publishTask(draft: any, tasks: any) {
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
    
    // 添加到活动任务可用列表
    if (!tasks.event) tasks.event = { available: [], ongoing: [] }
    if (!tasks.event.available) tasks.event.available = []
    tasks.event.available.push(newTask)
    
    return newTask
  }
} 