// utils/scoring-utils.ts

// 获取有效的计分牌
export function getValidCardsForScoring(cards: any[], cardTypeInfo: any): any[] {
  if (!cardTypeInfo || !cardTypeInfo.type || cards.length === 0) {
    return []
  }

  const type = cardTypeInfo.type
  
  // 统计点数和花色
  const pointCount: any = {}
  const suitCount: any = {}
  const points: number[] = []
  
  for (let card of cards) {
    const point = card.point
    pointCount[point] = (pointCount[point] || 0) + 1
    suitCount[card.suit] = (suitCount[card.suit] || 0) + 1
    // 转换点数为数字用于比较，统一A牌为14
    const royalPoints: any = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11 }
    points.push((royalPoints[point] || parseInt(point)))
  }
  
  console.log('getValidCardsForScoring 调试信息:')
  console.log('牌型:', type)
  console.log('所有牌:', cards.map(c => c.point + c.suit))
  console.log('点数统计:', pointCount)
  
  // 根据牌型判断哪些牌是有效的
  let validCards: any[] = []
  
  switch (type) {
    case '五条':
      // 五条：所有牌都有效（5张相同点数）
      validCards = cards
      break
      
    case '四条':
      // 四条：4张相同点数的牌有效，1张不同点数的牌无效
      const fourPoint = Object.keys(pointCount).find(p => pointCount[p] === 4)
      if (fourPoint) {
        validCards = cards.filter(card => card.point === fourPoint)
      }
      break
      
    case '葫芦':
    case '同花葫芦':
    case '皇家葫芦':
      // 葫芦：3张相同点数的牌有效，2张相同点数的牌有效
      validCards = cards
      break
      
    case '同花':
      // 同花：所有牌都有效（5张同一花色）
      validCards = cards
      break
      
    case '同花顺':
    case '皇家同花顺':
      // 同花顺：所有牌都有效（5张连续且同花色）
      validCards = cards
      break
      
    case '顺子':
      // 顺子：所有牌都有效（5张连续）
      validCards = cards
      break
      
    case '三条':
      // 三条：3张相同点数的牌有效，其他2张无效
      const threePoint = Object.keys(pointCount).find(p => pointCount[p] === 3)
      if (threePoint) {
        validCards = cards.filter(card => card.point === threePoint)
      }
      break
      
    case '两对':
      // 两对：4张牌有效（2对），1张无效
      const pairPoints = Object.keys(pointCount).filter(p => pointCount[p] === 2)
      validCards = cards.filter(card => pairPoints.includes(card.point))
      break
      
    case '对子':
      // 对子：2张相同点数的牌有效，其他无效
      const pairPoint = Object.keys(pointCount).find(p => pointCount[p] === 2)
      if (pairPoint) {
        validCards = cards.filter(card => card.point === pairPoint)
      }
      break
      
    case '高牌':
      // 高牌：只有点数最大的牌有效
      let maxPoint = 0
      let maxCard = null
      
      for (let i = 0; i < cards.length; i++) {
        if (points[i] > maxPoint) {
          maxPoint = points[i]
          maxCard = cards[i]
        }
      }
      
      validCards = maxCard ? [maxCard] : []
      break
      
    default:
      validCards = cards
  }
  
  console.log('有效牌:', validCards.map(c => c.point + c.suit))
  console.log('无效牌:', cards.filter(c => !validCards.includes(c)).map(c => c.point + c.suit))
  
  return validCards
}

// 获取牌的点数值（用于计分，A牌为11）
export function getCardPointValue(point: string): number {
  if (point === 'A') return 11
  if (point === 'K' || point === 'Q' || point === 'J') return 10
  return parseInt(point) || 0
} 