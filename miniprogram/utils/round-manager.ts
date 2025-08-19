// utils/round-manager.ts
import { RoundPhase, initRoundState, DEFAULT_ROUND_CONFIG } from '../mechanics/round-phases'
import { getLevelConfig, FIXED_CONFIG } from '../mechanics/level-types'
import { getGameModeConfig } from '../mechanics/game-modes'
import { getScoreTargetByBet } from '../utils/target-utils'

export class RoundManager {
  // 统一的醉汉小丑牌效果计算方法
  private static calculateDrunkJokerEffect(jokerCards: any[]): number {
    const drunkJokerCount = jokerCards.filter((joker: any) => 
      joker.id === 'drunk-joker'
    ).length
    const mimicDrunkJokerCount = jokerCards.filter((joker: any) => 
      joker.id === 'mimic-drunk-joker'
    ).length
    
    // 真实醉汉小丑牌：+1弃牌次数
    // 模仿者模仿醉汉：+1弃牌次数
    return drunkJokerCount + mimicDrunkJokerCount
  }

  // 统一的弃牌次数计算方法
  private static calculateFinalDiscardCount(jokerCards: any[], mode: string): number {
    const modeConfig = getGameModeConfig(mode)
    const baseDiscardCount = modeConfig.discardsPerRound
    const drunkBonus = this.calculateDrunkJokerEffect(jokerCards)
    return baseDiscardCount + drunkBonus
  }

  static pageMethods: {
    roundWin(this: any): void
    nextRound(this: any): void
    initRound(this: any): void
    startRoundInit(this: any): void
    initLevel(this: any): void
  } = {
    roundWin(this: any) {
      // 先回收所有牌到卡包
      const { generateDeckForForce } = require('../mechanics/force-decks')
      const force = this.data.force || 'qun'
      const fullDeck = generateDeckForForce(force)
      
      // 清空手牌区
      const emptyHandRows = Array.from({length: 4}, () => Array(7).fill(null).map(() => ({ back: true })))
      
      const earnedGold = this.data.remainPlay // 剩余出牌次数转化的金币
      const levelConfig = getLevelConfig(this.data.currentLevelType)
      const levelReward = levelConfig.reward // 关卡奖励金币
      const currentGold = this.data.gold || 0
      const interest = this.calculateInterest(currentGold) // 利息
      const totalReward = earnedGold + levelReward + interest // 总奖励
      const newGold = currentGold + totalReward

      this.setData({
        // 回收所有牌
        deck: fullDeck,
        hand: [],
        handRows: emptyHandRows,
        remainCards: fullDeck.length,
        currentHandCount: 0,
        selectedCards: Array.from({ length: 4 }, () => Array(7).fill(false)),
        hasSelectedCards: false,
        // 胜利状态
        'roundState.isRoundWin': true,
        'roundState.phase': RoundPhase.SETTLEMENT,
        showSettlement: true,
        gold: newGold,
        levelReward: levelReward, // 通关奖励
        interest: interest, // 利息
        totalReward: totalReward  // 总奖励
      })
      
      // 保存金币到本地存储
      wx.setStorageSync('gameGold', newGold)
    },
    nextRound(this: any) {
      const nextRoundNumber = this.data.currentRound + 1
      const currentBetLevel = Math.floor((nextRoundNumber - 1) / 3) + 1
      const positionInCycle = (nextRoundNumber - 1) % 3
      const levelTypes = ['small-blind', 'big-blind', 'boss-battle']
      const nextLevelType = levelTypes[positionInCycle]
      const nextLevelConfig = getLevelConfig(nextLevelType)
      const newBet = currentBetLevel

      this.initDeckAndHandWithForce(this.data.force || 'qun')
      // 每回合初始抽牌数量=手牌上限(固定7张)
      this.drawCardsToHand(FIXED_CONFIG.handLimit)

      const currentGold = this.data.gold || 0
      const jokerCards = this.data.jokerCards || []
      const mode = this.data.mode || 'classic'
      const finalDiscardCount = RoundManager.calculateFinalDiscardCount(jokerCards, mode)

      this.setData({
        currentRound: nextRoundNumber,
        currentLevelType: nextLevelType,
        currentBet: newBet,
        levelType: nextLevelConfig.name,
        levelLimit: '',
        scoreTarget: getScoreTargetByBet(newBet, nextLevelType),
        remainPlay: getGameModeConfig(mode).cardsPerRound,
        remainDiscard: finalDiscardCount,
        handLimit: FIXED_CONFIG.handLimit,
        roundScore: 0,
        scoreCards: [],
        cardType: '',
        cardCount: 0,
        cardGrade: 0,
        currentMultiplier: 0,
        currentChip: 0,
        showSettlement: false,
        'roundState.isRoundWin': false,
        'roundState.phase': RoundPhase.USER_ACTION,
        gold: currentGold,
        abstractJokerBonus: 0 // 重置抽象小丑倍率
      })
    },
    initRound(this: any) {
      const roundState = initRoundState(this.data.currentRound, this.data.currentBet, DEFAULT_ROUND_CONFIG)
      this.setData({ roundState })
      this.initDeckAndHandWithForce(this.data.force || 'qun')
      // 每回合初始抽牌数量=手牌上限(固定7张)
      this.drawCardsToHand(FIXED_CONFIG.handLimit)
      this.startRoundInit()
    },
    startRoundInit(this: any) {
      const jokerCards = this.data.jokerCards || []
      const mode = this.data.mode || 'classic'
      const finalDiscardCount = RoundManager.calculateFinalDiscardCount(jokerCards, mode)

      this.setData({
        roundScore: 0,
        remainPlay: getGameModeConfig(mode).cardsPerRound,
        remainDiscard: finalDiscardCount,
        scoreTarget: getScoreTargetByBet(this.data.currentBet, this.data.currentLevelType),
        scoreCards: [],
        cardType: '',
        cardCount: 0,
        cardGrade: 0,
        currentMultiplier: 0,
        currentChip: 0,
        scoreAnim: ''
      })
      this.setData({
        'roundState.phase': RoundPhase.USER_ACTION
      })
    },
    initLevel(this: any) {
      const levelConfig = getLevelConfig(this.data.currentLevelType)
      const jokerCards = this.data.jokerCards || []
      const mode = this.data.mode || 'classic'
      const finalDiscardCount = RoundManager.calculateFinalDiscardCount(jokerCards, mode)
      
      this.setData({
        levelType: levelConfig.name,
        levelLimit: '',
        remainPlay: getGameModeConfig(mode).cardsPerRound,
        remainDiscard: finalDiscardCount,
        scoreTarget: getScoreTargetByBet(this.data.currentBet, this.data.currentLevelType),
        handLimit: FIXED_CONFIG.handLimit
      })
    }
  }
} 