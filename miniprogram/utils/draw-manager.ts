// utils/draw-manager.ts

export class DrawManager {
  static pageMethods: {
    drawCardsToHand(this: any, count: number): void
    sortHandByPoint(this: any, hand: any[]): any[][]
  } = {
    drawCardsToHand(this: any, count: number) {
      const deck = [...this.data.deck]
      const hand = [...this.data.hand]

      for (let i = 0; i < count && deck.length > 0; i++) {
        const idx = Math.floor(Math.random() * deck.length)
        hand.push(deck.splice(idx, 1)[0])
      }
      
      // 按照当前的排序模式进行排序
      const { HandResortManager } = require('./hand-resort-manager')
      const handRows = HandResortManager.setHandRows(hand, this.data.sortMode || 'point')
      
      this.setData({
        deck,
        hand,
        handRows,
        remainCards: deck.length
      })
      
      // 更新手牌数量
      if (this.updateHandCount) this.updateHandCount()
    },
    
    // 按点数模式排序手牌（保持向后兼容，但主要使用HandResortManager）
    sortHandByPoint(this: any, hand: any[]) {
      // 先清空4x7，填充背面牌
      let handRows: any[][] = Array.from({length: 4}, () => Array(7).fill(null).map(() => ({ back: true })))
      
      if (!hand || hand.length === 0) {
        return handRows
      }
      
      // 使用点数排序逻辑
      const pointOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
      const suitOrder = ['🍎', '🍏', '🦄', '🐴']
      
      // 先按点数分组
      const highCards = hand.filter(card => ['A', 'K', 'Q', 'J', '10', '9'].includes(card.point))
      const lowCards = hand.filter(card => ['8', '7', '6', '5', '4', '3'].includes(card.point))
      
      // 高牌组：按点数大小排序，同点数按花色排序
      highCards.sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        if (aPoint !== bPoint) return aPoint - bPoint // 点数大的在前（索引小的在前）
        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit) // 同点数按花色排序
      })
      
      // 低牌组：按点数大小排序，同点数按花色排序
      lowCards.sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        if (aPoint !== bPoint) return aPoint - bPoint // 点数大的在前（索引小的在前）
        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit) // 同点数按花色排序
      })
      
      // 填入前两行：A>K>Q>J>10>9
      let row = 0
      let col = 0
      
      for (let card of highCards) {
        if (row < 2) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 填入后两行：8>7>6>5>4>3
      row = 2
      col = 0
      
      for (let card of lowCards) {
        if (row < 4) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      return handRows
    }
  }
} 