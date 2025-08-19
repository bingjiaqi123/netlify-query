// 牌型计算规则
export interface CardTypeResult {
  type: string
  count: number
  multiplier: number
  chip: number
}

// 派生类型映射到主类型
export function getCanonicalType(type: string): string {
  if (type === '皇家葫芦') return '葫芦'
  if (type === '同花葫芦') return '同花'
  if (type === '皇家同花顺') return '同花顺'
  return type
}

// 每级增幅规则（相对等级1的每级增量），与比赛信息/展示逻辑共用
export const UPGRADE_RULES: Record<string, { chip: number; multiplier: number }> = {
  '高牌': { chip: 10, multiplier: 1 },
  '对子': { chip: 15, multiplier: 1 },
  '两对': { chip: 20, multiplier: 1 },
  '三条': { chip: 20, multiplier: 2 },
  '顺子': { chip: 30, multiplier: 3 },
  '同花': { chip: 30, multiplier: 3 },
  '葫芦': { chip: 30, multiplier: 3 },
  '四条': { chip: 30, multiplier: 4 },
  '同花顺': { chip: 40, multiplier: 4 },
  '五条': { chip: 40, multiplier: 5 }
}

// 提供各牌型的基础筹码与倍率（等级1），与 calculateCardType 的返回保持一致
export const TYPE_BASES: Array<{ type: string; chip: number; multiplier: number }> = [
  { type: '五条', chip: 120, multiplier: 9 },
  { type: '皇家同花顺', chip: 110, multiplier: 8 },
  { type: '同花顺', chip: 100, multiplier: 8 },
  { type: '四条', chip: 80, multiplier: 6 },
  { type: '同花葫芦', chip: 75, multiplier: 4 },
  { type: '皇家葫芦', chip: 60, multiplier: 4 },
  { type: '葫芦', chip: 50, multiplier: 4 },
  { type: '同花', chip: 40, multiplier: 4 },
  { type: '顺子', chip: 30, multiplier: 4 },
  { type: '三条', chip: 30, multiplier: 3 },
  { type: '两对', chip: 20, multiplier: 2 },
  { type: '对子', chip: 10, multiplier: 2 },
  { type: '高牌', chip: 5, multiplier: 1 }
]

const __TYPE_BASE_MAP = new Map(TYPE_BASES.map(t => [t.type, t]))
function baseFor(type: string): { chip: number; multiplier: number } {
  const b = __TYPE_BASE_MAP.get(type)
  if (!b) return { chip: 0, multiplier: 0 }
  return { chip: b.chip, multiplier: b.multiplier }
}

// 皇家牌点数映射
const royalPoints = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11 }

// 计算牌型
export function calculateCardType(cards: any[]): CardTypeResult {
  if (cards.length === 0) return { type: '', count: 0, multiplier: 0, chip: 0 }
  
  // 统计点数和花色
  const pointCount: any = {}
  const suitCount: any = {}
  const points: number[] = []
  
  for (let card of cards) {
    const point = (royalPoints as any)[card.point] || parseInt(card.point)
    points.push(point)
    pointCount[point] = (pointCount[point] || 0) + 1
    suitCount[card.suit] = (suitCount[card.suit] || 0) + 1
  }
  
  points.sort((a, b) => b - a)
  const pointValues = Object.values(pointCount)
  const suitValues = Object.values(suitCount)
  
  // 判定牌型（按优先级从高到低）
  
  // 五条（5张相同点数的牌）
  if (cards.length === 5 && pointValues.includes(5)) {
    return { type: '五条', count: 1, ...baseFor('五条') }
  }
  
  // 四条（4张相同点数的牌）
  if (pointValues.includes(4)) {
    return { type: '四条', count: 1, ...baseFor('四条') }
  }
  
  // 5张牌的牌型判定
  if (cards.length === 5) {
    // 皇家同花顺（5张牌花色相同，且点数分别是AKQJ10）
    const isRoyal = points.every(p => p >= 10) && points.length === 5
    const isFlush = suitValues.includes(5)
    const isStraight = points.every((p, i) => i === 0 || p === points[i-1] - 1)
    if (isRoyal && isFlush && isStraight) {
      return { type: '皇家同花顺', count: 1, ...baseFor('皇家同花顺') }
    }
    
    // 同花顺
    if (isFlush && isStraight) {
      return { type: '同花顺', count: 1, ...baseFor('同花顺') }
    }
    
    // 同花葫芦（3张点数相同的牌+2张点数相同的牌，且5张牌同一花色)
    if (pointValues.includes(3) && pointValues.includes(2) && isFlush) {
      return { type: '同花葫芦', count: 1, ...baseFor('同花葫芦') }
    }
    
    // 皇家葫芦（3张点数相同的牌且点数必须是A或K或Q或J+2张点数相同的牌）
    if (pointValues.includes(3) && pointValues.includes(2)) {
      // 找到3张相同点数的牌
      let threeOfAKindPoint = 0
      for (let point in pointCount) {
        if (pointCount[point] === 3) {
          threeOfAKindPoint = parseInt(point)
          break
        }
      }
      // 检查是否是皇家牌（A、K、Q、J）
      if (threeOfAKindPoint >= 11) {
        return { type: '皇家葫芦', count: 1, ...baseFor('皇家葫芦') }
      }
    }
    
    // 葫芦(3张点数相同的牌+2张点数相同的牌)
    if (pointValues.includes(3) && pointValues.includes(2)) {
      return { type: '葫芦', count: 1, ...baseFor('葫芦') }
    }
    
    // 同花
    if (suitValues.includes(5)) {
      return { type: '同花', count: 1, ...baseFor('同花') }
    }
    
    // 顺子
    if (isStraight) {
      return { type: '顺子', count: 1, ...baseFor('顺子') }
    }
  }
  
  // 三条
  if (pointValues.includes(3)) {
    return { type: '三条', count: 1, ...baseFor('三条') }
  }
  
  // 两对
  if (pointValues.filter(v => v === 2).length === 2) {
    return { type: '两对', count: 1, ...baseFor('两对') }
  }
  
  // 对子
  if (pointValues.includes(2)) {
    return { type: '对子', count: 1, ...baseFor('对子') }
  }
  
  // 高牌
  return { type: '高牌', count: 1, ...baseFor('高牌') }
} 