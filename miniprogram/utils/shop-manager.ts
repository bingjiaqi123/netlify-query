// utils/shop-manager.ts
// 商店管理器 - 负责生成商店商品和稀有度概率

import { JokerCard, ALL_JOKERS, getJokersByRarity } from '../mechanics/joker-categories'

export interface ShopItem extends JokerCard {
  sold: boolean
}

export class ShopManager {
  // 稀有度概率配置
  private static readonly RARITY_PROBABILITIES = {
    '普通': 0.7,    // 70% 概率
    '罕见': 0.1,    // 10% 概率 (1/10)
    '稀有': 0.02,   // 2% 概率 (1/50)
    '传说': 0.005   // 0.5% 概率 (1/200)
  }

  // 生成商店小丑牌商品
  static generateShopJokers(
    count: number, 
    ownedJokerIds: string[] = [], 
    maxAttempts: number = 100
  ): ShopItem[] {
    const availableJokers = ALL_JOKERS.filter(joker => !ownedJokerIds.includes(joker.id))
    
    // 如果所有小丑牌都已获得，返回空数组
    if (availableJokers.length === 0) {
      return []
    }

    const shopItems: ShopItem[] = []
    let attempts = 0

    while (shopItems.length < count && attempts < maxAttempts) {
      attempts++
      
      // 根据稀有度概率选择小丑牌
      const selectedJoker = this.selectJokerByRarity(availableJokers, ownedJokerIds)
      
      if (selectedJoker && !shopItems.some(item => item.id === selectedJoker.id)) {
        shopItems.push({
          ...selectedJoker,
          sold: false
        })
      }
    }

    return shopItems
  }

  // 根据稀有度概率选择小丑牌
  private static selectJokerByRarity(
    availableJokers: JokerCard[], 
    ownedJokerIds: string[]
  ): JokerCard | null {
    // 按稀有度分组可用的小丑牌
    const jokersByRarity = {
      '普通': availableJokers.filter(j => j.rarity === '普通' && !ownedJokerIds.includes(j.id)),
      '罕见': availableJokers.filter(j => j.rarity === '罕见' && !ownedJokerIds.includes(j.id)),
      '稀有': availableJokers.filter(j => j.rarity === '稀有' && !ownedJokerIds.includes(j.id)),
      '传说': availableJokers.filter(j => j.rarity === '传说' && !ownedJokerIds.includes(j.id))
    }

    // 生成随机数决定稀有度
    const random = Math.random()
    let cumulativeProbability = 0

    for (const [rarity, probability] of Object.entries(this.RARITY_PROBABILITIES)) {
      cumulativeProbability += probability
      
      if (random <= cumulativeProbability) {
        const jokersOfRarity = jokersByRarity[rarity as keyof typeof jokersByRarity]
        
        // 如果该稀有度没有可用的小丑牌，尝试其他稀有度
        if (jokersOfRarity.length > 0) {
          const randomIndex = Math.floor(Math.random() * jokersOfRarity.length)
          return jokersOfRarity[randomIndex]
        }
      }
    }

    // 如果概率选择失败，从所有可用的小丑牌中随机选择
    const fallbackJokers = availableJokers.filter(j => !ownedJokerIds.includes(j.id))
    if (fallbackJokers.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackJokers.length)
      return fallbackJokers[randomIndex]
    }

    return null
  }

  // 检查是否应该显示小丑牌商店
  static shouldShowJokerShop(ownedJokerIds: string[] = []): boolean {
    const availableJokers = ALL_JOKERS.filter(joker => !ownedJokerIds.includes(joker.id))
    
    // 如果还有可用的小丑牌，显示商店
    if (availableJokers.length > 0) {
      return true
    }
    
    // 如果所有小丑牌都已获得，可以选择不显示商店
    // 或者显示一个"已集齐所有小丑牌"的提示
    return false
  }

  // 获取商店状态信息
  static getShopStatus(ownedJokerIds: string[] = []): {
    totalJokers: number
    ownedJokers: number
    availableJokers: number
    shouldShowShop: boolean
  } {
    const totalJokers = ALL_JOKERS.length
    const ownedJokers = ownedJokerIds.length
    const availableJokers = totalJokers - ownedJokers
    const shouldShowShop = this.shouldShowJokerShop(ownedJokerIds)

    return {
      totalJokers,
      ownedJokers,
      availableJokers,
      shouldShowShop
    }
  }
} 