// utils/discard-manager.ts
import { calculateAutoDrawCount } from '../mechanics/round-phases'

export class DiscardManager {
  static pageMethods: {
    discardCard(this: any): void
    removeSelectedCardsForDiscard(this: any): void
    removeSelectedCardsFromHand(this: any): void
  } = {
    discardCard(this: any) {
      if (!this.data.hasSelectedCards || this.data.isScoring) return

      // 移除选中的牌（临时丢弃，不放回卡包）
      this.removeSelectedCardsForDiscard()

      // 消耗1次弃牌次数
      this.setData({ remainDiscard: this.data.remainDiscard - 1 })

      // 重新抽牌到手牌上限
      const currentHandCount = this.data.hand.length
      const drawCount = calculateAutoDrawCount(this.data.handLimit, currentHandCount)
      if (drawCount > 0) {
        this.drawCardsToHand(drawCount)
      }
    },

    removeSelectedCardsForDiscard(this: any) {
      const handRows = this.data.handRows.map((row: any[]) => row.map(card => card))
      const selectedCards = this.data.selectedCards
      const hand = [...this.data.hand]

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          if (selectedCards[row][col] && handRows[row][col] && !handRows[row][col].back) {
            const cardToRemove = handRows[row][col]
            handRows[row][col] = { back: true }
            const cardIndex = hand.findIndex((card: any) => card.suit === cardToRemove.suit && card.point === cardToRemove.point)
            if (cardIndex >= 0) hand.splice(cardIndex, 1)
          }
        }
      }

      // 重新排序剩余的手牌
      const { HandResortManager } = require('./hand-resort-manager')
      const sortedHandRows = HandResortManager.setHandRows(hand, this.data.sortMode || 'point')

      this.setData({
        handRows: sortedHandRows,
        hand,
        selectedCards: Array.from({ length: 4 }, () => Array(7).fill(false)),
        hasSelectedCards: false
      })
    },

    removeSelectedCardsFromHand(this: any) {
      const handRows = this.data.handRows.map((row: any[]) => row.map(card => card))
      const selectedCards = this.data.selectedCards
      const hand = [...this.data.hand]

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          if (selectedCards[row][col] && handRows[row][col] && !handRows[row][col].back) {
            const cardToRemove = handRows[row][col]
            handRows[row][col] = { back: true }
            const cardIndex = hand.findIndex((card: any) => card.suit === cardToRemove.suit && card.point === cardToRemove.point)
            if (cardIndex >= 0) hand.splice(cardIndex, 1)
          }
        }
      }

      // 重新排序剩余的手牌
      const { HandResortManager } = require('./hand-resort-manager')
      const sortedHandRows = HandResortManager.setHandRows(hand, this.data.sortMode || 'point')

      this.setData({
        handRows: sortedHandRows,
        hand,
        selectedCards: Array.from({ length: 4 }, () => Array(7).fill(false)),
        hasSelectedCards: false,
        isScoring: false
      })
    }
  }
} 