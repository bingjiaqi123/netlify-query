// utils/pachio-effect.ts

export class PachioEffect {
  // 帕奇欧效果：随机复制一张背包里的牌（使用本地存储作为权威数据源）
  static applyPachioEffect(page: any): boolean {
    // 检查是否有帕奇欧小丑牌
    const jokerCards = page?.data?.jokerCards || []
    const hasPachio = jokerCards.some((joker: any) => joker.id === 'pachio')
    if (!hasPachio) return false

    // 从存储读取背包
    const bagRaw = (wx.getStorageSync('bagPlanetCards') || []) as Array<{ type: string; level?: number }>
    if (!bagRaw || bagRaw.length === 0) return false

    // 检查背包是否有空格子（背包最多9个格子）
    if (bagRaw.length >= 9) {
      return false
    }

    // 随机复制一张
    const randomIndex = Math.floor(Math.random() * bagRaw.length)
    const cardToCopy = bagRaw[randomIndex]
    const newBag = [...bagRaw, { type: cardToCopy.type, level: cardToCopy.level ?? 1 }]

    // 写回存储
    wx.setStorageSync('bagPlanetCards', newBag)

    // 优先使用 refreshBagData 方法刷新背包数据
    if (page && typeof page.refreshBagData === 'function') {
      page.refreshBagData()
    }
    // 兼容旧逻辑：如有需要，尽量同步到页面（仅在当前页面持有 bagItems 且面板已展开时）
    else if (page && typeof page.setData === 'function' && Array.isArray(page.data.bagItems)) {
      // 简单追加一条用于即时反馈（背包面板未打开时无影响，打开时会从存储刷新）
      const bagItems = (page.data.bagItems || []).slice()
      bagItems.push({ type: cardToCopy.type, level: (cardToCopy.level ?? 1), chars: Array.from(cardToCopy.type) })
      page.setData({ bagItems })
    }

    wx.showToast({ title: `帕奇欧效果：复制 ${cardToCopy.type}`, icon: 'success', duration: 2000 })
    return true
  }
} 