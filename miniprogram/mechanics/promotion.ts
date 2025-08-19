// mechanics/promotion.ts
// 升官系统

import { RoleType } from '../utils/generals/types'

export interface PromotionResult {
  success: boolean
  newRank: number
  foodGained: number
}

/**
 * 根据官职等级获取对应粮草
 */
export function getLevelFood(rank: number): number {
  // 官职等级对应的粮草奖励
  const rankFoodMap: { [key: number]: number } = {
    1: 100,   // 步卒/小吏/公士
    2: 200,   // 伍长/书佐/亭侯
    3: 300,   // 屯长/主簿/乡侯
    4: 400,   // 军司马/郎中/县侯
    5: 500,   // 校尉/侍郎/刺史
    6: 600,   // 中郎将/尚书/州牧
    7: 700,   // 偏将军/光禄大夫/关内侯
    8: 800,   // 镇军将军/御史中丞/国公
    9: 900    // 大将军/丞相/摄政王
  }
  
  return rankFoodMap[rank] || 100
}

/**
 * 升官
 */
export function promotePlayer(currentRank: number): PromotionResult {
  const newRank = Math.min(9, currentRank + 1)
  const foodGained = getLevelFood(newRank)
  
  return {
    success: true,
    newRank,
    foodGained
  }
}

/**
 * 获取官职名称
 */
export function getRankName(rank: number, roleType?: RoleType): string {
  // 官职系统 - 根据职业类型确定
  const OFFICIAL_RANKS = {
    [RoleType.MILITARY]: { // 武将
      1: '步卒',
      2: '伍长',
      3: '屯长',
      4: '军司马',
      5: '校尉',
      6: '中郎将',
      7: '偏将军',
      8: '镇军将军',
      9: '大将军'
    },
    [RoleType.CIVIL]: { // 文官
      1: '小吏',
      2: '书佐',
      3: '主簿',
      4: '郎中',
      5: '侍郎',
      6: '尚书',
      7: '光禄大夫',
      8: '御史中丞',
      9: '丞相'
    },
    [RoleType.LORD]: { // 主公
      1: '公士',
      2: '亭侯',
      3: '乡侯',
      4: '县侯',
      5: '刺史',
      6: '州牧',
      7: '关内侯',
      8: '国公',
      9: '摄政王'
    }
  }
  
  if (rank < 1 || rank > 9) return '未知'
  
  // 如果没有指定roleType，默认使用武将体系
  const roleTypeToUse = roleType || RoleType.MILITARY
  return OFFICIAL_RANKS[roleTypeToUse][rank as keyof typeof OFFICIAL_RANKS[RoleType.MILITARY]] || '未知'
} 