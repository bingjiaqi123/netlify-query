// 随机任务池组管理组件
export class RandomPoolGroupManager {
  // 切换组内多选模式
  static toggleGroupMultiSelect(poolUI: any, tab: 'daily' | 'weekly', group: string) {
    const key = `poolUI.${tab}.${group}.multi`
    const current = poolUI?.[tab]?.[group]?.multi || false
    return { [key]: !current }
  }

  // 切换组内任务选择
  static toggleSelectTaskInGroup(poolUI: any, tab: 'daily' | 'weekly', group: string, id: string) {
    const path = `poolUI.${tab}.${group}.selected`
    const selected = (poolUI?.[tab]?.[group]?.selected) || {}
    selected[id] = !selected[id]
    return { [path]: selected }
  }

  // 移动选中任务到目标组
  static moveSelectedToGroup(pools: any, poolUI: any, tab: 'daily' | 'weekly', groupName: string) {
    const ui = poolUI?.[groupName] || {}
    const selected = ui.selected || {}
    const targetNameRaw = ui.moveTarget || ''
    const targetName = (targetNameRaw || '默认').trim()
    const groups = pools[tab].random.groups as any[]
    const from = groups.find((g: any) => g.name === groupName)
    if (!from) return { pools, poolUI: {} }
    
    let target = groups.find((g: any) => g.name === targetName)
    if (!target) {
      target = { name: targetName, drawCount: 0, tasks: [] }
      groups.push(target)
    }
    
    const remain: any[] = []
    from.tasks.forEach((t: any) => {
      if (selected[t.id]) target.tasks.push(t)
      else remain.push(t)
    })
    from.tasks = remain
    
    // 自动解散空组（不解散默认与预设）
    if (!from.isPreset && from.name !== '默认' && from.tasks.length === 0) {
      const idx = groups.findIndex(g => g.name === from.name)
      if (idx >= 0) groups.splice(idx, 1)
    }
    
    // 清空所选
    const newPoolUI = { ...poolUI }
    newPoolUI[tab] = { ...newPoolUI[tab] }
    newPoolUI[tab][groupName] = { ...newPoolUI[tab][groupName] }
    newPoolUI[tab][groupName].selected = {}
    newPoolUI[tab][groupName].multi = false
    newPoolUI[tab][groupName].moveTarget = ''
    
    return { pools, poolUI: newPoolUI }
  }

  // 更改组抽取数量
  static changeGroupDrawCount(pools: any, tab: 'daily' | 'weekly', groupName: string, value: string) {
    let v = parseInt(value, 10)
    if (isNaN(v) || v < 0) v = 0
    const g = (pools[tab].random.groups as any[]).find((x: any) => x.name === groupName)
    if (g) {
      g.drawCount = v
    }
    return pools
  }

  // 重命名组
  static renameGroup(pools: any, poolUI: any, tab: 'daily' | 'weekly', oldName: string, newName: string) {
    if (!newName) return { pools, poolUI }
    
    const groups = pools[tab].random.groups as any[]
    if (groups.some((g: any) => g.name === newName)) {
      throw new Error('组名已存在')
    }
    
    const g = groups.find((x: any) => x.name === oldName)
    if (!g || g.isPreset) return { pools, poolUI }
    
    g.name = newName
    
    // 迁移UI键
    const newPoolUI = { ...poolUI }
    newPoolUI[tab] = { ...newPoolUI[tab] }
    const groupUI = newPoolUI[tab][oldName] || {}
    delete newPoolUI[tab][oldName]
    newPoolUI[tab][newName] = groupUI
    
    return { pools, poolUI: newPoolUI }
  }

  // 从选中任务创建新组
  static createGroupFromSelected(pools: any, poolUI: any, tab: 'daily' | 'weekly', createName: string) {
    const groups = pools[tab].random.groups as any[]
    const uiRoot = poolUI?.[tab] || {}
    let name = (createName || '').trim()
    if (!name) name = '默认'
    
    let target = groups.find((g: any) => g.name === name)
    if (!target) {
      target = { name, drawCount: 0, tasks: [] }
      groups.push(target)
    }
    
    // 收集所有组选择
    const ui = poolUI?.[tab] || {}
    for (const key of Object.keys(ui)) {
      if (key === '__createName') continue
      const sel = ui[key]?.selected || {}
      const from = groups.find((g: any) => g.name === key)
      if (!from) continue
      
      const remain: any[] = []
      from.tasks.forEach((t: any) => {
        if (sel[t.id]) target.tasks.push(t)
        else remain.push(t)
      })
      from.tasks = remain
      
      // 清空UI选择
      ui[key].selected = {}
      ui[key].multi = false
      ui[key].moveTarget = ''
      
      // 空组解散
      if (!from.isPreset && from.name !== '默认' && from.tasks.length === 0) {
        const idx = groups.findIndex(g => g.name === from.name)
        if (idx >= 0) groups.splice(idx, 1)
      }
    }
    
    return { pools, poolUI: ui }
  }

  // 检查是否有选中的任务
  static hasSelected(selected: any) {
    if (!selected) return false
    return Object.keys(selected).some(k => !!selected[k])
  }
} 