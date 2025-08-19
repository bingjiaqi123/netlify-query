// 学生端每日任务组件
export class StudentDailyTasks {
  // 显示每日任务列表
  static renderTasks(tasks: any[]) {
    return tasks.map(task => ({
      ...task,
      isPending: task.status === 'pending-review'
    }))
  }

  // 提交每日任务
  static submitTask(taskId: string, tasks: any) {
    const avail = tasks.daily.available || []
    const idx = avail.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = { ...avail[idx], status: 'pending-review', submitTime: Date.now() }
    avail.splice(idx, 1)
    tasks.daily.ongoing.unshift(task)
    return true
  }

  // 重抽每日任务
  static redrawTasks(questData: any, pools: any) {
    // 清空当前每日任务列表
    questData.daily = { available: [], ongoing: [] }
    
    // 从每日常驻任务池添加任务
    const dailyPermanent = pools.daily?.permanent || []
    dailyPermanent.forEach((tpl: any) => {
      if (tpl.isSpecialCompleteAll) return
      const inst = { ...tpl, id: `daily_${Date.now()}_${Math.random()}` }
      delete inst.template
      delete inst.poolType
      questData.daily.available.push(inst)
    })
    
    // 从每日随机任务池抽取任务
    const dailyRandom = pools.daily?.random?.groups || []
    dailyRandom.forEach((group: any) => {
      if (group.tasks && group.tasks.length > 0) {
        const drawCount = group.drawCount || 0
        if (drawCount > 0) {
          const shuffledTasks = this.shuffleArray([...group.tasks])
          const selectedTasks = shuffledTasks.slice(0, Math.min(drawCount, group.tasks.length))
          selectedTasks.forEach((tpl: any) => {
            const inst = { ...tpl, id: `daily_${Date.now()}_${Math.random()}` }
            delete inst.template
            delete inst.poolType
            questData.daily.available.push(inst)
          })
        }
      }
    })
    
    // 特殊任务置底：完成所有每日任务
    const special = dailyPermanent.find((t: any) => t.isSpecialCompleteAll)
    if (special) {
      questData.daily.available = questData.daily.available.filter((t: any) => !t.isSpecialCompleteAll)
      const inst = { ...special, id: `daily_special_${Date.now()}` }
      delete inst.template
      delete inst.poolType
      inst.isSpecialCompleteAll = true
      questData.daily.available.push(inst)
    }
    
    return questData
  }

  // 数组随机打乱函数
  private static shuffleArray(array: any[]) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
} 