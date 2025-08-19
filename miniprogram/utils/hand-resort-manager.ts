// utils/hand-resort-manager.ts

export class HandResortManager {
  // 私有静态方法：创建空的handRows数组
  private static createEmptyHandRows(): any[][] {
    return Array.from({ length: 4 }, () => Array(7).fill(null).map(() => ({ back: true })))
  }

  // 私有静态方法：获取排序权重
  private static getSortWeights() {
    return {
      suitOrder: { '🍎': 0, '🍏': 1, '🦄': 2, '🐴': 3 },
      pointOrder: { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3 }
    }
  }

  // 私有静态方法：排序手牌
  private static sortHand(hand: any[], sortMode: string): any[] {
    const { suitOrder, pointOrder } = this.getSortWeights()
    
    return [...hand].sort((a: any, b: any) => {
      const aPoint = pointOrder[a.point as keyof typeof pointOrder] || 0
      const bPoint = pointOrder[b.point as keyof typeof pointOrder] || 0
      const aSuit = suitOrder[a.suit as keyof typeof suitOrder] || 0
      const bSuit = suitOrder[b.suit as keyof typeof suitOrder] || 0
      
      if (sortMode === 'point') {
        if (aPoint !== bPoint) return bPoint - aPoint
        return aSuit - bSuit
      } else {
        if (aSuit !== bSuit) return aSuit - bSuit
        return bPoint - aPoint
      }
    })
  }

  // 私有静态方法：根据排序模式填充handRows
  private static fillHandRows(sortedHand: any[], sortMode: string): any[][] {
    const newHandRows = this.createEmptyHandRows()
    
    if (sortMode === 'point') {
      // 按点数排：4行，分2组，每组2行，每行7张牌
      // 前两行：A>K>Q>J>10>9（按点数大小排序，同点数按🍎>🍏>🦄>🐴排序）
      // 后两行：8>7>6>5>4>3（按点数大小排序，同点数按🍎>🍏>🦄>🐴排序）
      const pointOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
      const suitOrder = ['🍎', '🍏', '🦄', '🐴']
      
      // 先按点数分组
      const highCards = sortedHand.filter(card => ['A', 'K', 'Q', 'J', '10', '9'].includes(card.point))
      const lowCards = sortedHand.filter(card => ['8', '7', '6', '5', '4', '3'].includes(card.point))
      
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
          newHandRows[row][col] = card
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
          newHandRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
    } else {
      // 按花色排：4行，分2组，每组2行，每行7张牌
      // 前两行：红桃优先于黑桃（红桃在前，黑桃在后）
      // 后两行：方片优先于梅花（方片在前，梅花在后）
      const pointOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
      const suitOrder = ['🍎', '🍏', '🦄', '🐴']
      
      // 按花色分组并按点数排序
      const heartCards = sortedHand.filter(card => card.suit === '🍎').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const spadeCards = sortedHand.filter(card => card.suit === '🍏').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const diamondCards = sortedHand.filter(card => card.suit === '🦄').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const clubCards = sortedHand.filter(card => card.suit === '🐴').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      
      // 填入前两行：红桃优先于黑桃
      let row = 0
      let col = 0
      
      // 先填红桃
      for (let card of heartCards) {
        if (row < 2) {
          newHandRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 再填黑桃
      for (let card of spadeCards) {
        if (row < 2) {
          newHandRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 填入后两行：方片优先于梅花
      row = 2
      col = 0
      
      // 先填方片
      for (let card of diamondCards) {
        if (row < 4) {
          newHandRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 再填梅花
      for (let card of clubCards) {
        if (row < 4) {
          newHandRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
    }
    
    return newHandRows
  }

  // 私有静态方法：执行完整的重排逻辑
  private static performResort(hand: any[], sortMode: string): { sortedHand: any[], handRows: any[][] } {
    const sortedHand = this.sortHand(hand, sortMode)
    const handRows = this.fillHandRows(sortedHand, sortMode)
    return { sortedHand, handRows }
  }

  // 使用传入的hand数组进行排序（避免setData异步问题）
  static resortHandWithUpdatedHand(page: any, updatedHand: any[]) {
    // 直接使用setHandRows的逻辑，避免performResort的问题
    const handRows = HandResortManager.setHandRows(updatedHand, page.data.sortMode)
    page.setData({ handRows, hand: updatedHand })
  }

  // 设置手牌行（从HandSorter整合过来的功能）
  static setHandRows(hand: any[], sortMode: string) {
    // 先清空4x7，填充背面牌
    let handRows: any[][] = Array.from({length: 4}, () => Array(7).fill(null).map(() => ({ back: true })))
    // 如果手牌为空，直接返回背面牌
    if (!hand || hand.length === 0) {
      return handRows
    }
    
    // 点数优先分行
    const pointOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
    const suitOrder = ['🍎', '🍏', '🦄', '🐴']
    
    if (sortMode === 'point') {
      // 按点数排：4行，分2组，每组2行
      // 前两行：A>K>Q>J>10>9（按点数大小排序，同点数按🍎>🍏>🦄>🐴排序）
      // 后两行：8>7>6>5>4>3（按点数大小排序，同点数按🍎>🍏>🦄>🐴排序）
      
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
    } else {
      // 按花色排：4行，分2组，每组2行
      // 前两行：红桃优先于黑桃（红桃在前，黑桃在后）
      // 后两行：方片优先于梅花（方片在前，梅花在后）
      
      // 按花色分组并按点数排序（点数大的在前）
      const heartCards = hand.filter(card => card.suit === '🍎').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const spadeCards = hand.filter(card => card.suit === '🍏').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const diamondCards = hand.filter(card => card.suit === '🦄').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      const clubCards = hand.filter(card => card.suit === '🐴').sort((a, b) => {
        const aPoint = pointOrder.indexOf(a.point)
        const bPoint = pointOrder.indexOf(b.point)
        return aPoint - bPoint // 点数大的在前（索引小的在前）
      })
      
      // 填入前两行：红桃优先于黑桃
      let row = 0
      let col = 0
      
      // 先填红桃
      for (let card of heartCards) {
        if (row < 2) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 再填黑桃
      for (let card of spadeCards) {
        if (row < 2) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 填入后两行：方片优先于梅花
      row = 2
      col = 0
      
      // 先填方片
      for (let card of diamondCards) {
        if (row < 4) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
      
      // 再填梅花
      for (let card of clubCards) {
        if (row < 4) {
          handRows[row][col] = card
          col++
          if (col >= 7) {
            col = 0
            row++
          }
        }
      }
    }
    
    // 返回填充好的handRows
    return handRows
  }

  static pageMethods: {
    resortHand(this: any): void
    resortHandWithoutSetHand(this: any): void
    resortHandWithUpdatedHand(this: any, updatedHand: any[]): void
    sortByPoint(this: any): void
    sortBySuit(this: any): void
    setHandRows(this: any, hand: any[], sortMode: string): void
  } = {
    resortHand(this: any) {
      // 安全检查：确保handRows存在且结构正确
      if (!this.data.handRows || this.data.handRows.length !== 4 || this.data.handRows[0]?.length !== 7) {
        console.warn('handRows结构不正确，重新初始化')
        this.data.handRows = Array.from({length: 4}, () => Array(7).fill(null).map(() => ({ back: true })))
      }
      
      const { sortedHand, handRows } = HandResortManager.performResort(this.data.hand, this.data.sortMode)
      this.setData({ handRows, hand: sortedHand })
    },

    resortHandWithUpdatedHand(this: any, updatedHand: any[]) {
      HandResortManager.resortHandWithUpdatedHand(this, updatedHand)
    },

    resortHandWithoutSetHand(this: any) {
      const { sortedHand, handRows } = HandResortManager.performResort(this.data.hand, this.data.sortMode)
      this.setData({ handRows, hand: sortedHand })
    },

    sortByPoint(this: any) {
      this.setData({ sortMode: 'point' })
      this.resortHand()
    },

    sortBySuit(this: any) {
      this.setData({ sortMode: 'suit' })
      this.resortHand()
    },

    setHandRows(this: any, hand: any[], sortMode: string) {
      HandResortManager.setHandRows(hand, sortMode)
    }
  }
} 