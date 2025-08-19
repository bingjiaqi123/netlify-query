// utils/deck-initializer.ts

// 卡包初始化器
export class DeckInitializer {
  
  // 初始化卡包和手牌
  static initDeckAndHand() {
    // 1. 初始化卡包
    const suits = ['🍎', '🍏', '🦄', '🐴']
    const points = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
    let deck = []
    for (let suit of suits) {
      for (let point of points) {
        deck.push({ suit, point, label: suit + point })
      }
    }
    
    // 获取当前页面实例并更新数据
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.setData) {
      currentPage.setData({
        deck,
        hand: [],
        remainCards: deck.length,
        totalCards: deck.length, // 使用实际的卡包总数
        sortMode: 'point' // 确保排序模式正确设置
      })
      
      // 更新手牌数量
      if (currentPage.updateHandCount) {
        currentPage.updateHandCount()
      }
    }
  }

  static pageMethods: {
    initDeckAndHand(this: any): void
  } = {
    initDeckAndHand(this: any) {
      DeckInitializer.initDeckAndHand()
    }
  }
} 