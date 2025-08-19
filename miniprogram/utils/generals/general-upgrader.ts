// utils/general-upgrader.ts

import { General } from './types'

// 计算升级所需碎片数
export function calculateFragmentsNeeded(level: number): number {
  // 根据等级区间确定每级所需碎片数
  let fragmentsPerLevel = 0
  
  if (level >= 0 && level < 5) {
    fragmentsPerLevel = 5
  } else if (level >= 5 && level < 10) {
    fragmentsPerLevel = 10
  } else if (level >= 10 && level < 15) {
    fragmentsPerLevel = 15
  } else if (level >= 15 && level < 20) {
    fragmentsPerLevel = 20
  } else if (level >= 20 && level < 25) {
    fragmentsPerLevel = 25
  } else if (level >= 25 && level < 30) {
    fragmentsPerLevel = 30
  }
  
  return fragmentsPerLevel
}

// 检查是否可以升级
export function canUpgrade(general: General): boolean {
  return general.fragments >= general.fragmentsNeeded && general.level < general.maxLevel
}

// 升级角色
export function upgradeGeneral(general: General): boolean {
  if (!canUpgrade(general)) {
    return false
  }
  
  // 扣除碎片
  general.fragments -= general.fragmentsNeeded
  general.level += 1
  
  // 更新升级所需碎片数
  general.fragmentsNeeded = calculateFragmentsNeeded(general.level)
  
  // 升级normal技能（在特定等级）
  const normalSkill = general.skills.find(s => s.type === 'normal')
  if (normalSkill) {
    const upgradeLevels = [5, 10, 15, 20, 25, 30, 35]
    if (upgradeLevels.includes(general.level)) {
      normalSkill.currentLevel = Math.min(normalSkill.currentLevel + 1, normalSkill.levels.length - 1)
    }
  }
  
  return true
} 

// 检查是否可以突破
export function canBreakthrough(general: General): boolean {
  // 突破条件：等级达到30级且未突破过
  return general.level >= 30 && general.maxLevel === 30
}

// 突破角色
export function breakthroughGeneral(general: General): boolean {
  if (!canBreakthrough(general)) {
    return false
  }
  
  // 突破后等级上限提升到35级
  general.maxLevel = 35
  general.level = 30 // 突破后等级重置为30级
  
  // 更新升级所需碎片数
  general.fragmentsNeeded = calculateFragmentsNeeded(general.level)
  
  return true
} 