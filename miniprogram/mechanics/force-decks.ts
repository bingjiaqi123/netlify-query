// mechanics/force-decks.ts

export interface Card {
  suit: string
  point: string
  label: string
}

export interface ForceDeckConfig {
  name: string
  cards: Card[]
  totalCards: number
}

// 基础牌组：标准48张牌
const BASE_DECK: Card[] = []
const baseSuits = ['🍎', '🍏', '🦄', '🐴']
const basePoints = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']

// 生成基础牌组
for (const suit of baseSuits) {
  for (const point of basePoints) {
    BASE_DECK.push({ suit, point, label: suit + point })
  }
}

// 吴势力：点数不变，每个点数的4张牌花色是两张🍎和两张🦄
function generateWuDeck(): Card[] {
  const wuDeck: Card[] = []
  const wuSuits = ['🍎', '🍎', '🦄', '🦄']
  
  for (const point of basePoints) {
    for (const suit of wuSuits) {
      wuDeck.push({ suit, point, label: suit + point })
    }
  }
  
  return wuDeck
}

// 蜀势力：没有3、4、9、10，剩余点数在常规的4张牌外再多2张牌
function generateShuDeck(): Card[] {
  const shuDeck: Card[] = []
  const shuPoints = ['A', 'K', 'Q', 'J', '8', '7', '6', '5']
  const baseSuits = ['🍎', '🍏', '🦄', '🐴']
  
  // 基础4张牌
  for (const point of shuPoints) {
    for (const suit of baseSuits) {
      shuDeck.push({ suit, point, label: suit + point })
    }
  }
  
  // 额外2张牌
  const extraCards = [
    { point: '5', suit: '🍎' }, { point: '5', suit: '🍎' },
    { point: '6', suit: '🍏' }, { point: '6', suit: '🍏' },
    { point: '7', suit: '🦄' }, { point: '7', suit: '🦄' },
    { point: '8', suit: '🐴' }, { point: '8', suit: '🐴' },
    { point: 'J', suit: '🍎' }, { point: 'J', suit: '🍎' },
    { point: 'Q', suit: '🍏' }, { point: 'Q', suit: '🍏' },
    { point: 'K', suit: '🦄' }, { point: 'K', suit: '🦄' },
    { point: 'A', suit: '🐴' }, { point: 'A', suit: '🐴' }
  ]
  
  for (const card of extraCards) {
    shuDeck.push({ ...card, label: card.suit + card.point })
  }
  
  return shuDeck
}

// 魏势力：没有K、Q、J
function generateWeiDeck(): Card[] {
  const weiDeck: Card[] = []
  const weiPoints = ['A', '10', '9', '8', '7', '6', '5', '4', '3']
  const baseSuits = ['🍎', '🍏', '🦄', '🐴']
  
  // 基础4张牌
  for (const point of weiPoints) {
    for (const suit of baseSuits) {
      weiDeck.push({ suit, point, label: suit + point })
    }
  }
  
  // 额外牌
  const extraCards = [
    { point: 'A', suit: '🍎' },
    { point: '10', suit: '🍏' },
    { point: '9', suit: '🦄' },
    { point: '8', suit: '🐴' },
    { point: '7', suit: '🍎' }, { point: '7', suit: '🍎' },
    { point: '6', suit: '🍏' }, { point: '6', suit: '🍏' },
    { point: '5', suit: '🦄' }, { point: '5', suit: '🦄' },
    { point: '4', suit: '🐴' },
    { point: '3', suit: '🐴' }
  ]
  
  for (const card of extraCards) {
    weiDeck.push({ ...card, label: card.suit + card.point })
  }
  
  return weiDeck
}

// 群势力：没有K、Q、J
function generateQunDeck(): Card[] {
  const qunDeck: Card[] = []
  const qunPoints = ['A', '10', '9', '8', '7', '6', '5', '4', '3']
  const baseSuits = ['🍎', '🍏', '🦄', '🐴']
  
  // 基础4张牌
  for (const point of qunPoints) {
    for (const suit of baseSuits) {
      qunDeck.push({ suit, point, label: suit + point })
    }
  }
  
  // 移除和添加特定牌
  const removeCards = [
    { point: 'A', suit: '🍎' },
    { point: '10', suit: '🍏' },
    { point: '9', suit: '🍏' },
    { point: '8', suit: '🦄' }, { point: '8', suit: '🦄' },
    { point: '7', suit: '🦄' },
    { point: '3', suit: '🍏' }
  ]
  
  const addCards = [
    { point: '9', suit: '🍎' },
    { point: '8', suit: '🍎' }, { point: '8', suit: '🍏' }, { point: '8', suit: '🐴' },
    { point: '7', suit: '🍎' }, { point: '7', suit: '🍏' }, { point: '7', suit: '🐴' },
    { point: '6', suit: '🦄' }, { point: '6', suit: '🍏' },
    { point: '5', suit: '🍏' }
  ]
  
  // 移除指定牌
  for (const removeCard of removeCards) {
    const index = qunDeck.findIndex(card => 
      card.suit === removeCard.suit && card.point === removeCard.point
    )
    if (index !== -1) {
      qunDeck.splice(index, 1)
    }
  }
  
  // 添加指定牌
  for (const addCard of addCards) {
    qunDeck.push({ ...addCard, label: addCard.suit + addCard.point })
  }
  
  return qunDeck
}

export const FORCE_DECKS: Record<string, ForceDeckConfig> = {
  wu: {
    name: '吴势力',
    cards: generateWuDeck(),
    totalCards: generateWuDeck().length
  },
  shu: {
    name: '蜀势力',
    cards: generateShuDeck(),
    totalCards: generateShuDeck().length
  },
  wei: {
    name: '魏势力',
    cards: generateWeiDeck(),
    totalCards: generateWeiDeck().length
  },
  qun: {
    name: '群势力',
    cards: generateQunDeck(),
    totalCards: generateQunDeck().length
  }
}

export function getForceDeckConfig(force: string): ForceDeckConfig {
  return FORCE_DECKS[force] || FORCE_DECKS.qun
}

export function generateDeckForForce(force: string): Card[] {
  const config = getForceDeckConfig(force)
  return [...config.cards] // 返回副本
} 