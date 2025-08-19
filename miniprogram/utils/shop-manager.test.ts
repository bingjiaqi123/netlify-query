// utils/shop-manager.test.ts
// 商店管理器的测试文件

import { ShopManager } from './shop-manager'

// 模拟测试数据
const mockOwnedIds: string[] = ['half-joker', 'flag-joker']

console.log('=== ShopManager 测试 ===')

// 测试1: 获取商店状态
console.log('测试1: 获取商店状态')
const shopStatus = ShopManager.getShopStatus(mockOwnedIds)
console.log('商店状态:', shopStatus)

// 测试2: 生成商店小丑牌
console.log('\n测试2: 生成商店小丑牌')
const shopJokers = ShopManager.generateShopJokers(3, mockOwnedIds)
console.log('生成的商店小丑牌:', shopJokers.map(j => ({
  name: j.name,
  rarity: j.rarity,
  price: j.buyPrice
})))

// 测试3: 检查稀有度分布
console.log('\n测试3: 检查稀有度分布')
const rarityCounts = {
  '普通': 0,
  '罕见': 0,
  '稀有': 0,
  '传说': 0
}

// 模拟100次生成，统计稀有度分布
for (let i = 0; i < 100; i++) {
  const jokers = ShopManager.generateShopJokers(1, mockOwnedIds)
  if (jokers.length > 0) {
    const rarity = jokers[0].rarity
    rarityCounts[rarity as keyof typeof rarityCounts]++
  }
}

console.log('100次生成的稀有度分布:', rarityCounts)

// 测试4: 检查是否应该显示商店
console.log('\n测试4: 检查是否应该显示商店')
const shouldShow = ShopManager.shouldShowJokerShop(mockOwnedIds)
console.log('是否应该显示商店:', shouldShow)

console.log('\n=== 测试完成 ===') 