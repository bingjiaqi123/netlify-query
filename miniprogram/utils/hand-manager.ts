// utils/hand-manager.ts
import { calculateCardType } from '../mechanics/card-types'
import { applyCardTypeUpgrades, getEffectiveLevel } from './upgrade-utils'

// 手牌管理器
export class HandManager {
  
  // 处理手牌点击事件（选择1-5张牌）
  static onHandCardTap(cardIdx: number, selectedHandIdx: any[]) {
    let newSelectedHandIdx = [...selectedHandIdx]
    const i = newSelectedHandIdx.indexOf(cardIdx)
    
    if (i >= 0) {
      newSelectedHandIdx.splice(i, 1)
    } else {
      if (newSelectedHandIdx.length < 5) newSelectedHandIdx.push(cardIdx)
    }
    
    // 获取当前页面实例并更新数据
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.setData) {
      currentPage.setData({ selectedHandIdx: newSelectedHandIdx })
      
      // 重新排序手牌
      if (currentPage.setHandRows) {
        currentPage.setHandRows(currentPage.data.hand, currentPage.data.sortMode)
      }
    }
  }
  
  // 处理卡牌点击事件（选择卡牌并计算牌型）
  static onCardBackTap(rowIdx: number, slotIdx: number, selectedCards: boolean[][], handRows: any[][]) {
    // 统计当前已选中数量
    const currentSelectedCount = selectedCards.reduce((sum, row) => sum + row.filter(Boolean).length, 0)
    const isCurrentlySelected = !!(selectedCards[rowIdx] && selectedCards[rowIdx][slotIdx])
    
    // 若本次操作是尝试选中且已满5张，则无效果
    if (!isCurrentlySelected && currentSelectedCount >= 5) {
      return
    }
    
    const newSelectedCards = selectedCards.map(row => row.slice())
    newSelectedCards[rowIdx][slotIdx] = !isCurrentlySelected
    
    // 获取当前页面实例并更新数据
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.setData) {
      // 直接更新 hasSelectedCards，避免依赖页面的同名方法
      const hasSelected = newSelectedCards.some(row => row.some(Boolean))
      currentPage.setData({ selectedCards: newSelectedCards, hasSelectedCards: hasSelected })
      
      // 计算牌型（仅用于展示，不改变已出牌次数）
      const selectedCardsList = HandManager.getSelectedCards(newSelectedCards, handRows)
      let cardTypeInfo = calculateCardType(selectedCardsList)
      // 应用牌型等级加成用于预览
      cardTypeInfo = applyCardTypeUpgrades(cardTypeInfo, currentPage.data.typeLevels)
      const effectiveLevel = getEffectiveLevel(currentPage.data.typeLevels, cardTypeInfo.type)
      
      // 获取当前牌型已出次数
      const cardTypeCounts = currentPage.data.cardTypeCounts || {}
      const currentCount = cardTypeCounts[cardTypeInfo.type] || 0
      
      currentPage.setData({
        cardType: cardTypeInfo.type,
        cardGrade: effectiveLevel, // 显示有效等级
        cardCount: currentCount, // 显示当前牌型已出次数
        currentMultiplier: cardTypeInfo.multiplier,
        currentChip: cardTypeInfo.chip
      })
    }
  }
  
  // 获取选中的牌（公开）
  static getSelectedCards(selectedCards: boolean[][], handRows: any[][]) {
    const selected: any[] = []
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 7; col++) {
        if (selectedCards[row][col] && handRows[row][col]) {
          const card = handRows[row][col]
          if (!card.back) {
            selected.push(card)
          }
        }
      }
    }
    return selected
  }

  // 可展开到 Page({...}) 的方法集合（确保 this 指向页面实例）
  static pageMethods: {
    onHandCardTap(this: any, e: any): void
    onCardBackTap(this: any, e: any): void
    getSelectedCards(this: any): any[]
    updateHasSelectedCards(this: any): void
    updateHandCount(this: any): void
  } = {
    onHandCardTap(this: any, e: any) {
      const idx = Number(e.currentTarget.dataset.cardidx)
      HandManager.onHandCardTap(idx, this.data.selectedHandIdx)
    },
    onCardBackTap(this: any, e: any) {
      const rowIdx = Number(e.currentTarget.dataset.rowidx)
      const slotIdx = Number(e.currentTarget.dataset.slotidx)
      HandManager.onCardBackTap(rowIdx, slotIdx, this.data.selectedCards, this.data.handRows)
    },
    getSelectedCards(this: any) {
      return HandManager.getSelectedCards(this.data.selectedCards, this.data.handRows)
    },
    updateHasSelectedCards(this: any) {
      const hasSelected = this.data.selectedCards.some((row: boolean[]) => row.some(Boolean))
      this.setData({ hasSelectedCards: hasSelected })
    },
    updateHandCount(this: any) {
      let count = 0
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          const card = this.data.handRows[row][col]
          if (card && !card.back) {
            count++
          }
        }
      }
      this.setData({ currentHandCount: count })
    }
  }
} 