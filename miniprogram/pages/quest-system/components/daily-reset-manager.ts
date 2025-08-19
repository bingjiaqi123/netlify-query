// 每日任务重置管理组件
export class DailyResetManager {
  // 重置每日：清空每日任务，只注入常驻任务（每日任务池的随机任务池为空）
  static resetDaily(tasks: any, pools: any) {
    tasks.daily.available = []
    tasks.daily.ongoing = []

    // 只加入常驻任务
    const perm = pools.daily.permanent || []
    perm.forEach((tpl: any) => {
      if (tpl.isSpecialCompleteAll) return
      const inst = { ...tpl, id: `daily_${Date.now()}_${Math.random()}` }
      delete inst.template
      delete inst.poolType
      tasks.daily.available.push(inst)
    })

    // 特殊任务置底：完成所有每日任务
    const special = perm.find((t: any) => t.isSpecialCompleteAll)
    if (special) {
      // 先清掉已有的特殊任务
      tasks.daily.available = tasks.daily.available.filter((t: any) => !t.isSpecialCompleteAll)
      const inst = { ...special, id: `daily_special_${Date.now()}` }
      delete inst.template
      delete inst.poolType
      inst.isSpecialCompleteAll = true
      tasks.daily.available.push(inst)
    }

    return tasks
  }

  // 清理每日的"完成所有每日任务"重复项，并确保置底
  static cleanupSpecialDuplicates(tasks: any) {
    const avail = tasks.daily.available || []
    const ongoing = tasks.daily.ongoing || []
    
    // 收集所有特殊任务
    const specialsAvail = avail.filter((t: any) => t.isSpecialCompleteAll)
    const specialsOngoing = ongoing.filter((t: any) => t.isSpecialCompleteAll)
    const total = specialsAvail.length + specialsOngoing.length
    
    if (total <= 1) {
      // 确保置底
      if (specialsAvail.length === 1) {
        tasks.daily.available = avail.filter((t: any) => !t.isSpecialCompleteAll)
        tasks.daily.available.push(specialsAvail[0])
      }
      return tasks
    }
    
    // 保留一个到available底部，移除其他
    const keep = specialsAvail[0] || specialsOngoing[0]
    tasks.daily.available = avail.filter((t: any) => !t.isSpecialCompleteAll)
    tasks.daily.available.push(keep)
    tasks.daily.ongoing = ongoing.filter((t: any) => !t.isSpecialCompleteAll)
    
    return tasks
  }
} 