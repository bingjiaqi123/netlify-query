// utils/interest-calculator.ts

// 利息计算器
export class InterestCalculator {
  
  // 计算利息：每5金币得到1金币利息，上限为5金币
  static calculateInterest(currentGold: number): number {
    const baseInterest = Math.floor(currentGold / 5)
    const maxInterest = 5
    return Math.min(baseInterest, maxInterest)
  }

  // 供 Page({...}) 一行展开的方法集合
  static pageMethods: {
    calculateInterest(this: any, gold: number): number
  } = {
    calculateInterest(this: any, gold: number) {
      return InterestCalculator.calculateInterest(gold)
    }
  }
} 