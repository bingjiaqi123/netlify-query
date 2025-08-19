// 每周任务重置管理组件
export class WeeklyResetManager {
  // 重置每周：清空每周任务，注入常驻和随机模板实例
  static resetWeekly(tasks: any, pools: any) {
    tasks.weekly.available = []
    tasks.weekly.ongoing = []

    const perm = pools.weekly.permanent || []
    perm.forEach((tpl: any) => {
      if (tpl.isSpecialCompleteAll) return
      const inst = { ...tpl, id: `weekly_${Date.now()}_${Math.random()}` }
      delete inst.template
      delete inst.poolType
      tasks.weekly.available.push(inst)
    })
    
    // 随机分组抽取
    const groups = pools.weekly.random?.groups || []
    groups.forEach((g: any) => {
      const list = g.tasks || []
      let n = parseInt(g.drawCount, 10) || 0
      if (n <= 0) return
      if (n >= list.length) {
        list.forEach((tpl: any) => {
          const inst = { ...tpl, id: `weekly_${Date.now()}_${Math.random()}` }
          delete inst.template
          delete inst.poolType
          tasks.weekly.available.push(inst)
        })
      } else {
        const idxs = [...Array(list.length).keys()]
        for (let i = idxs.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [idxs[i], idxs[j]] = [idxs[j], idxs[i]] 
        }
        idxs.slice(0, n).forEach(i => {
          const tpl = list[i]
          const inst = { ...tpl, id: `weekly_${Date.now()}_${Math.random()}` }
          delete inst.template
          delete inst.poolType
          tasks.weekly.available.push(inst)
        })
      }
    })

    // 特殊任务置底：完成所有每周任务
    const special = perm.find((t: any) => t.isSpecialCompleteAll)
    if (special) {
      // 先清掉已有的特殊任务
      tasks.weekly.available = tasks.weekly.available.filter((t: any) => !t.isSpecialCompleteAll)
      const inst = { ...special, id: `weekly_special_${Date.now()}` }
      delete inst.template
      delete inst.poolType
      inst.isSpecialCompleteAll = true
      tasks.weekly.available.push(inst)
    }

    return tasks
  }

  // 清理每周的"完成所有每周任务"重复项，并确保置底
  static cleanupSpecialDuplicates(tasks: any) {
    const avail = tasks.weekly.available || []
    const ongoing = tasks.weekly.ongoing || []
    
    // 收集所有特殊任务
    const specialsAvail = avail.filter((t: any) => t.isSpecialCompleteAll)
    const specialsOngoing = ongoing.filter((t: any) => t.isSpecialCompleteAll)
    const total = specialsAvail.length + specialsOngoing.length
    
    if (total <= 1) {
      // 确保置底
      if (specialsAvail.length === 1) {
        tasks.weekly.available = avail.filter((t: any) => !t.isSpecialCompleteAll)
        tasks.weekly.available.push(specialsAvail[0])
      }
      return tasks
    }
    
    // 保留一个到available底部，移除其他
    const keep = specialsAvail[0] || specialsOngoing[0]
    tasks.weekly.available = avail.filter((t: any) => !t.isSpecialCompleteAll)
    tasks.weekly.available.push(keep)
    tasks.weekly.ongoing = ongoing.filter((t: any) => !t.isSpecialCompleteAll)
    
    return tasks
  }
} 