import { RoundState } from '../../mechanics/round-phases'
import { getGameModeConfig } from '../../mechanics/game-modes'
import { generateDeckForForce } from '../../mechanics/force-decks'
import { PageLoader } from '../../utils/page-loader'
import { DeckInitializer } from '../../utils/deck-initializer'
import { HandManager } from '../../utils/hand-manager'
import { ScoringManager } from '../../utils/scoring-manager'
import { DrawManager } from '../../utils/draw-manager'
import { HandResortManager } from '../../utils/hand-resort-manager'
import { SortButtons } from '../../utils/sort-buttons'
import { InfoPanelManager } from '../../utils/info-panel-manager'
import { DiscardManager } from '../../utils/discard-manager'
import { RoundManager } from '../../utils/round-manager'
import { AutoDrawManager } from '../../utils/auto-draw-manager'
import { BagManager } from '../../utils/bag-manager'
import { InterestCalculator } from '../../utils/interest-calculator'

Page({
  data: {
    // 状态栏
    levelType: '',
    levelLimit: '',
    currentRound: 1,
    currentBet: 1, // 注数
    targetBet: 8, // 目标注数
    remainPlay: 0, // 剩余可出牌数
    remainDiscard: 0, // 剩余可弃牌数
    scoreTarget: 0, // 分数目标
    roundScore: 0, // 当前回合分数
    gold: 0, // 初始金币数，将在onLoad中设置
    currentMultiplier: 0, // 当前倍率
    currentChip: 0, // 当前筹码
    levelReward: 0, // 通关奖励
    totalReward: 0, // 总奖励
    interest: 0, // 利息
    cardType: '', // 牌型名称
    cardCount: 0, // 已出牌型数量
    cardGrade: 0, // 牌型等级
    cardTypeCounts: {} as any,
    currentHandCount: 0, // 当前手牌数量
    handLimit: 7,
    mode: 'classic', // 游戏模式
    force: '', // 阵营
    // 卡牌区
    jokerCards: [] as any[],
    scoreCards: [] as any[],
    previewCards: [] as any[],
    remainCards: 20,
    totalCards: 54,
    abstractJokerBonus: 0, // 抽象小丑倍率加成
    // 手牌区
    handRows: Array.from({length: 4}, () => Array(7).fill(null)) as any[][],
    sortMode: 'point', // 'point' or 'suit'
    deck: [] as any[], // 卡包
    hand: [] as any[], // 当前手牌
    selectedHandIdx: [] as any[], // 选中手牌的索引
    isScoring: false,
          handFlat: Array(28).fill(null),
          selectedCards: Array.from({length: 4}, () => Array(7).fill(false)) as boolean[][],
    hasSelectedCards: false,
    // 关卡配置
    currentLevelType: 'small-blind' as string,
    // 回合阶段管理
    roundState: null as RoundState | null,
    // 结算面板
    showSettlement: false,
    // 比赛信息面板
    showInfoPanel: false,
    infoTypeRows: [] as any[],
    // 背包
    showBagPanel: false,
    bagItems: [] as Array<{ type: string; level: number; chars: string[] }>,
    selectedBagIndex: -1,
    typeLevels: (wx.getStorageSync('typeLevels') || {}) as Record<string, number>,
    // 小丑牌详情弹框
    showJokerDetail: false,
    currentJoker: null as any,
    // 牌组图层
    showDeckPanel: false,
    deckDisplay: [] as any[]
  },
  onLoad(options: any) {
    // 获取模式和阵营参数
    const mode = options.mode || 'classic'
    const force = options.force || 'qun'
    
    // 重置模仿者状态，确保新游戏开始时模仿者不处于模仿状态
    try {
      const { MimicManager } = require('../../utils/mimic-manager')
      MimicManager.resetMimic()
    } catch (_) {}
    
    // 新游戏开始时清空本地存储的小丑牌数据
    try {
      wx.removeStorageSync('jokerCards')
    } catch (error) {
      console.error('Error clearing joker cards from storage:', error)
    }
    
    // 获取游戏模式配置
    const modeConfig = getGameModeConfig(mode)
    
    // 初始化游戏常量
    this.setData({ 
      gold: modeConfig.initialGold,
      targetBet: 8, // 目标注数恒定为8
      mode: mode, // 保存游戏模式
      force: force, // 保存阵营
      jokerCards: [], // 新游戏开始时重置小丑牌为空数组
      abstractJokerBonus: 0, // 初始化抽象小丑倍率
      // 确保手牌区数组正确初始化
      selectedCards: Array.from({length: 4}, () => Array(7).fill(false))
    })
    
    // 保存初始金币到本地存储
    wx.setStorageSync('gameGold', modeConfig.initialGold)
    
    // 清空背包
    PageLoader.resetBagOnGameStart()
    
    // 初始化卡包和手牌区
    this.initDeckAndHandWithForce(force)
    
    this.initLevel()
    this.initRound()
  },

  onShow() {
    // 每次显示页面时刷新背包数据，确保从商店返回时数据同步
    if (this.refreshBagData) {
      this.refreshBagData()
    }
    
    // 刷新小丑牌数据，确保从商店返回时能显示已购买的小丑牌
    this.refreshJokerCards()
    
    // 刷新金币数据，确保从商店返回时金币数量正确
    this.refreshGoldFromShop()
  },
  
  // 手牌交互管理
  ...HandManager.pageMethods,
  ...DrawManager.pageMethods,
  ...HandResortManager.pageMethods,
  ...SortButtons.pageMethods,
  ...ScoringManager.pageMethods,
  ...DiscardManager.pageMethods,
  ...RoundManager.pageMethods,
  ...AutoDrawManager.pageMethods,
  ...DeckInitializer.pageMethods,
  ...PageLoader.pageMethods,
  // 比赛信息面板
  ...InfoPanelManager.pageMethods,
  // 背包
  ...BagManager.pageMethods,
  // 利息计算
  ...InterestCalculator.pageMethods,
 
  // 刷新小丑牌数据
  refreshJokerCards() {
    const jokerCards = wx.getStorageSync('jokerCards') || []
    this.setData({ jokerCards })
  },

  // 刷新金币数据（从商店页面同步）
  refreshGoldFromShop() {
    // 从本地存储获取最新的金币数量
    // 商店页面会将更新后的金币保存到本地存储
    const storedGold = wx.getStorageSync('gameGold')
    if (storedGold !== undefined && storedGold !== null) {
      this.setData({ gold: storedGold })
    }
  },
 
  // 背包相关方法
  openBag() {
    this.setData({ showBagPanel: true })
  },

  // 进入商店
  enterShop() {
    wx.navigateTo({
      url: '../shop/shop'
    })
  },
  // 退出游戏
  exitGame() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出游戏吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },
  
  // 显示小丑牌详情
  showJokerDetail(e: any) {
    const index = e.currentTarget.dataset.index
    const joker = this.data.jokerCards[index]
    if (joker) {
      this.setData({
        showJokerDetail: true,
        currentJoker: joker
      })
    }
  },

  // 根据阵营初始化卡包和手牌
  initDeckAndHandWithForce(force: string) {
    const deck = generateDeckForForce(force)
    
    this.setData({
      deck,
      hand: [],
      remainCards: deck.length,
      totalCards: deck.length,
      sortMode: 'point'
    })
    
    // 更新手牌数量
    this.updateHandCount()
  },

  // 组件事件桥接
  showJokerDetailFromStrip(e: any) {
    const index = e.detail?.index
    if (typeof index === 'number') {
      // 获取小丑牌组件实例，获取处理后的数据
      const jokerStripComponent = this.selectComponent('#joker-strip')
      if (jokerStripComponent && jokerStripComponent.data.processedJokers) {
        const processedJoker = jokerStripComponent.data.processedJokers[index]
        if (processedJoker) {
          this.setData({
            showJokerDetail: true,
            currentJoker: processedJoker
          })
          return
        }
      }
      
      // 如果无法获取处理后的数据，回退到原始逻辑
      const joker = this.data.jokerCards[index]
      if (joker) {
        this.setData({
          showJokerDetail: true,
          currentJoker: joker
        })
      }
    }
  },

  // 刷新小丑牌显示（确保抽象小丑牌效果描述实时更新）
  refreshJokerStrip() {
    // 获取小丑牌组件实例并调用刷新方法
    const jokerStripComponent = this.selectComponent('#joker-strip')
    if (jokerStripComponent && typeof jokerStripComponent.refreshJokers === 'function') {
      jokerStripComponent.refreshJokers()
    }
  },

  // 更新小丑牌数组（确保在更新后刷新显示）
  updateJokerCards(newJokerCards: any[]) {
    this.setData({ jokerCards: newJokerCards })
    
    // 保存到本地存储，确保数据持久化
    try {
      wx.setStorageSync('jokerCards', newJokerCards)
    } catch (error) {
      console.error('Error saving joker cards to storage:', error)
    }
    
    // 延迟刷新，确保数据更新完成
    setTimeout(() => {
      this.refreshJokerStrip()
    }, 100)
  },

  // 关闭小丑牌详情
  closeJokerDetail() {
    this.setData({
      showJokerDetail: false,
      currentJoker: null
    })
  },

  // 出售小丑牌
  sellJoker() {
    const joker = this.data.currentJoker
    if (joker) {
      // 增加金币
      const newGold = this.data.gold + joker.sellPrice
      
      // 从小丑牌数组中移除
      const newJokerCards = this.data.jokerCards.filter((j: any) => j.id !== joker.id)
      
      this.setData({
        gold: newGold,
        jokerCards: newJokerCards,
        showJokerDetail: false,
        currentJoker: null
      })
      
      // 更新本地存储
      try {
        wx.setStorageSync('jokerCards', newJokerCards)
        wx.setStorageSync('gameGold', newGold)
      } catch (error) {
        console.error('Error updating joker cards in storage after selling:', error)
      }
    }
  },
  showDeck() {
    this.generateDeckDisplay()
    this.setData({ showDeckPanel: true })
  },

  closeDeck() {
    this.setData({ showDeckPanel: false })
  },

  generateDeckDisplay() {
    const { hand, scoreCards, force } = this.data
    
    // 获取所有已使用过的牌（手牌、出牌区）
    const usedCards = new Set()
    
    // 添加手牌
    hand.forEach((card: any) => {
      if (card) {
        usedCards.add(`${card.suit}${card.point}`)
      }
    })
    
    // 添加出牌区的牌
    scoreCards.forEach((card: any) => {
      if (card) {
        usedCards.add(`${card.suit}${card.point}`)
      }
    })
    
    // 根据当前阵营生成牌组显示
    const { generateDeckForForce } = require('../../mechanics/force-decks')
    const currentDeck = generateDeckForForce(force)
    
    // 统计每个点数的牌
    const pointCards: Record<string, any[]> = {}
    
    for (const card of currentDeck) {
      if (!pointCards[card.point]) {
        pointCards[card.point] = []
      }
      pointCards[card.point].push({
        suit: card.suit,
        point: card.point,
        status: usedCards.has(`${card.suit}${card.point}`) ? 'used' : 'available'
      })
    }
    
    // 按点数顺序排列
    const pointOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3']
    const deckDisplay = pointOrder
      .filter(point => pointCards[point] && pointCards[point].length > 0)
      .map(point => ({
        point,
        cards: pointCards[point]
      }))
    
    this.setData({ deckDisplay })
  }
}) 