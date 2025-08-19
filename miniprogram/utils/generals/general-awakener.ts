// utils/general-awakener.ts

import { General } from './types'

// 检查是否可以觉醒
export function canAwaken(general: General): boolean {
  return general.level >= 30 && !general.isAwakened
}

// 觉醒角色
export function awakenGeneral(general: General): boolean {
  if (!canAwaken(general)) {
    return false
  }
  
  // 升级normal技能1级
  const normalSkill = general.skills.find(s => s.type === 'normal')
  if (normalSkill) {
    normalSkill.currentLevel = Math.min(normalSkill.currentLevel + 1, normalSkill.levels.length - 1)
  }
  
  // 激活awaken技能
  const awakenSkill = general.skills.find(s => s.type === 'awaken')
  if (awakenSkill) {
    awakenSkill.currentLevel = 1
  }
  
  return true
} 