// utils/auto-draw-manager.ts
import { calculateAutoDrawCount, checkGameOver, RoundPhase } from '../mechanics/round-phases'

export class AutoDrawManager {
  static pageMethods: {
    startAutoDraw(this: any): void
    gameOver(this: any): void
  } = {
    startAutoDraw(this: any) {
      if (checkGameOver(this.data.remainPlay)) {
        this.gameOver()
        return
      }
      const currentHandCount = this.data.hand.length
      const drawCount = calculateAutoDrawCount(this.data.handLimit, currentHandCount)
      if (drawCount > 0) {
        this.drawCardsToHand(drawCount)
      }
      this.setData({
        'roundState.phase': RoundPhase.USER_ACTION
      })
    },
    gameOver(this: any) {
      wx.showModal({
        title: '游戏失败',
        content: '出牌次数用完了！',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    }
  }
} 