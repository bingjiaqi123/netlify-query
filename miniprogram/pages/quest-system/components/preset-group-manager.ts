// 预设组管理组件
export class PresetGroupManager {
  // 确保常驻池存在预设任务
  static ensurePermanentPresetTasks(pools: any) {
    // 安全检查，确保pools结构完整
    if (!pools || !pools.daily || !pools.weekly) {
      console.warn('pools not properly initialized, skipping ensurePermanentPresetTasks')
      return pools
    }
    
    // 每日任务：设置预设任务
    if (!pools.daily.permanent) {
      pools.daily.permanent = []
    }
    const dailyPermanent = pools.daily.permanent
    const findDailyTask = (title: string) => dailyPermanent.find((t: any) => t.title === title)
    
    // 将预设任务移到末尾
    const dailyNonPreset = dailyPermanent.filter((t: any) => !t.isPreset)
    const dailyPreset = dailyPermanent.filter((t: any) => t.isPreset)
    pools.daily.permanent = [...dailyNonPreset, ...dailyPreset]
    
    // 每周任务：设置预设任务
    if (!pools.weekly.permanent) {
      pools.weekly.permanent = []
    }
    const weeklyPermanent = pools.weekly.permanent
    const findWeeklyTask = (title: string) => weeklyPermanent.find((t: any) => t.title === title)
    
    // 将预设任务移到末尾
    const weeklyNonPreset = weeklyPermanent.filter((t: any) => !t.isPreset)
    const weeklyPreset = weeklyPermanent.filter((t: any) => t.isPreset)
    pools.weekly.permanent = [...weeklyNonPreset, ...weeklyPreset]
    
    return pools
  }

  // 确保随机池存在预设分组和默认分组
  static ensureRandomPresetGroups(pools: any) {
    // 安全检查，确保pools结构完整
    if (!pools || !pools.daily || !pools.weekly) {
      console.warn('pools not properly initialized, skipping ensureRandomPresetGroups')
      return pools
    }
    
    // 每日任务：设置预设组
    if (!pools.daily.random || !pools.daily.random.groups) {
      pools.daily.random = { groups: [] }
    }
    const dailyGroups = pools.daily.random.groups
    const findDailyGroup = (name: string) => dailyGroups.find((g: any) => g.name === name)
    
    // 每日任务默认组
    if (!findDailyGroup('默认')) {
      dailyGroups.push({ name: '默认', drawCount: 0, tasks: [] })
    }
    
    // 将每日任务预设组移到末尾
    const dailyNonPresetGroups = dailyGroups.filter((group: any) => !group.isPreset)
    const dailyPresetGroups = dailyGroups.filter((group: any) => group.isPreset)
    pools.daily.random.groups = [...dailyNonPresetGroups, ...dailyPresetGroups]
    
    // 每周任务：设置预设组
    if (!pools.weekly.random || !pools.weekly.random.groups) {
      pools.weekly.random = { groups: [] }
    }
    const weeklyGroups = pools.weekly.random.groups
    const findGroup = (name: string) => weeklyGroups.find((g: any) => g.name === name)
    
    // 默认组
    if (!findGroup('默认')) {
      weeklyGroups.push({ name: '默认', drawCount: 0, tasks: [] })
    }
    
    // 将预设组移到末尾，确保置底显示
    const nonPresetGroups = weeklyGroups.filter((group: any) => !group.isPreset)
    const presetGroups = weeklyGroups.filter((group: any) => group.isPreset)
    pools.weekly.random.groups = [...nonPresetGroups, ...presetGroups]
    
    return pools
  }
} 