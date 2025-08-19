// utils/general-sorter.ts

import { General, Rarity, Force } from './types'

// 稀有度权重（用于排序）
const rarityWeight = {
  [Rarity.UR]: 5,
  [Rarity.SSR]: 4,
  [Rarity.SR]: 3,
  [Rarity.R]: 2,
  [Rarity.N]: 1
}

// 势力排序权重
const forceWeight = {
  [Force.WEI]: 4,
  [Force.SHU]: 3,
  [Force.WU]: 2,
  [Force.QUN]: 1
}

// 角色排序函数
export function sortGenerals(generals: General[]): General[] {
  return generals.sort((a, b) => {
    // 1. 按势力排序（魏、蜀、吴、群）
    if (forceWeight[a.force] !== forceWeight[b.force]) {
      return forceWeight[b.force] - forceWeight[a.force]
    }
    
    // 2. 同势力按稀有度排序（UR>SSR>SR>R>N）
    if (rarityWeight[a.rarity] !== rarityWeight[b.rarity]) {
      return rarityWeight[b.rarity] - rarityWeight[a.rarity]
    }
    
    // 3. 稀有度相同按等级排序（高到低）
    if (a.level !== b.level) {
      return b.level - a.level
    }
    
    // 4. 等级相同按获取时间排序（早到晚）
    return a.obtainTime - b.obtainTime
  })
} 