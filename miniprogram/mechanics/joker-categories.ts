// mechanics/joker-categories.ts
// 小丑牌分类管理

export interface JokerCard {
  id: string
  name: string
  rarity: '普通' | '罕见' | '稀有' | '传说'
  effect: string
  buyPrice: number
  sellPrice: number
  backgroundColor: string
  textColor: string
  category: '张数卡' | '弃牌卡' | '塔罗卡' | '手牌卡' | '点数卡' | '保底卡' | '顺劈卡' | '商店卡'
  // 模仿相关属性
  isMimicCopy?: boolean
  hasLaserShadow?: boolean
  originalMimicJoker?: JokerCard | null
}

// 张数卡：影响出牌张数
export const 张数卡_JOKERS: JokerCard[] = [
  {
    id: 'half-joker',
    name: '半张小丑',
    rarity: '普通',
    effect: '如果打出的牌少于等于3张，+20倍率',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '张数卡'
  }
]

// 弃牌卡：影响弃牌机制
export const 弃牌卡_JOKERS: JokerCard[] = [
  {
    id: 'flag-joker',
    name: '旗帜',
    rarity: '普通',
    effect: '每一个剩余的弃牌次数+30筹码',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '弃牌卡'
  },
  {
    id: 'drunk-joker',
    name: '醉汉',
    rarity: '普通',
    effect: '拥有这张小丑牌时每回合弃牌次数+1',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '弃牌卡'
  }
]

// 塔罗卡：特殊效果卡
export const 塔罗卡_JOKERS: JokerCard[] = [
  {
    id: 'pachio',
    name: '帕奇欧',
    rarity: '传说',
    effect: '特殊塔罗效果',
    buyPrice: 5,
    sellPrice: 2,
    backgroundColor: '#9C27B0',
    textColor: '#fff',
    category: '塔罗卡'
  }
]

// 手牌卡：影响手牌管理
export const 手牌卡_JOKERS: JokerCard[] = [
  {
    id: 'dna',
    name: 'DNA',
    rarity: '稀有',
    effect: '手牌相关效果',
    buyPrice: 4,
    sellPrice: 2,
    backgroundColor: '#4CAF50',
    textColor: '#fff',
    category: '手牌卡'
  }
]

// 点数卡：影响特定点数的牌
export const 点数卡_JOKERS: JokerCard[] = [
  {
    id: 'photo-joker',
    name: '照片',
    rarity: '普通',
    effect: '打出的第一张人头牌(点数为K、Q、J)在计分时倍率×2',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '点数卡'
  }
]

// 保底卡：提供稳定的倍率加成
export const 保底卡_JOKERS: JokerCard[] = [
  {
    id: 'joker-joker',
    name: '小丑',
    rarity: '普通',
    effect: '倍率+4',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '保底卡'
  },
  {
    id: 'banana-joker',
    name: '香蕉',
    rarity: '普通',
    effect: '倍率+15',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '保底卡'
  },
  {
    id: 'cavendish-joker',
    name: '卡文迪什',
    rarity: '普通',
    effect: '×3倍率',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '保底卡'
  },
  {
    id: 'baseball-card-joker',
    name: '棒球卡',
    rarity: '稀有',
    effect: '每张罕见小丑牌给予×1.5倍率',
    buyPrice: 27,
    sellPrice: 9,
    backgroundColor: '#4CAF50',
    textColor: '#fff',
    category: '保底卡'
  }
]

// 顺劈卡：从左到右第一张有效牌额外触发
export const 顺劈卡_JOKERS: JokerCard[] = [
  {
    id: 'unbroken-vote-joker',
    name: '未断选票',
    rarity: '罕见',
    effect: '从左到右第一张有效牌额外触发2次（连续触发三次再下一张）',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '顺劈卡'
  }
]

// 商店卡：在商店中发挥作用
export const 商店卡_JOKERS: JokerCard[] = [
  {
    id: 'blueprint-joker',
    name: '模仿者',
    rarity: '稀有',
    effect: '在离开每次离开商店时选一张小丑牌进行模仿',
    buyPrice: 4,
    sellPrice: 2,
    backgroundColor: '#4CAF50',
    textColor: '#fff',
    category: '商店卡'
  },
  {
    id: 'abstract-joker',
    name: '抽象小丑',
    rarity: '普通',
    effect: '每有1张小丑牌+3倍率',
    buyPrice: 3,
    sellPrice: 1,
    backgroundColor: '#2196F3',
    textColor: '#fff',
    category: '商店卡'
  }
]

// 所有小丑牌
export const ALL_JOKERS: JokerCard[] = [
  ...张数卡_JOKERS,
  ...弃牌卡_JOKERS,
  ...塔罗卡_JOKERS,
  ...手牌卡_JOKERS,
  ...点数卡_JOKERS,
  ...保底卡_JOKERS,
  ...顺劈卡_JOKERS,
  ...商店卡_JOKERS
]

// 按分类获取小丑牌
export function getJokersByCategory(category: string): JokerCard[] {
  switch (category) {
    case '张数卡': return 张数卡_JOKERS
    case '弃牌卡': return 弃牌卡_JOKERS
    case '塔罗卡': return 塔罗卡_JOKERS
    case '手牌卡': return 手牌卡_JOKERS
    case '点数卡': return 点数卡_JOKERS
    case '保底卡': return 保底卡_JOKERS
    case '顺劈卡': return 顺劈卡_JOKERS
    case '商店卡': return 商店卡_JOKERS
    default: return []
  }
}

// 按稀有度获取小丑牌
export function getJokersByRarity(rarity: string): JokerCard[] {
  return ALL_JOKERS.filter(joker => joker.rarity === rarity)
}

// 获取随机小丑牌（排除已拥有的）
export function getRandomJokerCards(count: number, excludeIds: string[] = []): JokerCard[] {
  const availableJokers = ALL_JOKERS.filter(joker => !excludeIds.includes(joker.id))
  const shuffled = [...availableJokers].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, availableJokers.length))
} 