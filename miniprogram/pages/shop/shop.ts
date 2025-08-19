// pages/shop/shop.ts
import { BagManager, addPlanetToBag } from '../../utils/bag-manager'
import { InfoPanelManager } from '../../utils/info-panel-manager'
import { getCanonicalType } from '../../mechanics/card-types'
import { JokerCard } from '../../mechanics/joker-categories'
import { PachioEffect } from '../../utils/pachio-effect'
import { ShopManager, ShopItem } from '../../utils/shop-manager'

// 扩展小丑牌类型，添加销售状态
interface ShopJokerCard extends JokerCard {
  sold: boolean
}

// 星球牌池（排除派生类型，仅售卖主类型）
const PLANET_TYPES = [
  '高牌', '对子', '两对', '三条', '顺子', '同花', '葫芦', '四条', '同花顺', '五条'
]

function pickTwoDistinct<T>(arr: T[]): [T, T] {
  if (arr.length < 2) return [arr[0], arr[0]] as any
  const i = Math.floor(Math.random() * arr.length)
  let j = Math.floor(Math.random() * arr.length)
  while (j === i) j = Math.floor(Math.random() * arr.length)
  return [arr[i], arr[j]]
}

function splitToChars(s: string): string[] {
  if (!s) return []
  return Array.from(s)
}

Page({
  data: {
    // 已拥有的小丑牌（与游戏页面同步）
    jokerCards: [] as any[],
    // 商店两个星球牌商品
    planetOffers: [] as Array<{ type: string; level: number; price: number; sold: boolean; chars: string[] }>,
    // 商店小丑牌商品
    jokerOffers: [] as ShopItem[],
    gold: 0,
    showBagPanel: false,
    bagItems: [] as Array<{ type: string; level: number; chars: string[] }>,
    selectedBagIndex: -1,
    typeLevels: (wx.getStorageSync('typeLevels') || {}) as Record<string, number>,
    // 比赛信息面板
    showInfoPanel: false,
    infoActiveTab: 'types',
    infoTypeRows: [] as any[],
    showMimicSelector: false,
    availableJokersForMimic: [] as JokerCard[],
    currentMimicJoker: null as any,
    mimicState: null as any,
    // 商店状态信息
    shopStatus: {
      totalJokers: 0,
      ownedJokers: 0,
      availableJokers: 0,
      shouldShowShop: true
    },
    // 牌堆数量（与游戏页同步）
    remainCards: 0,
    totalCards: 0,
  },
  
  onLoad() {
    // 从上一页（游戏页）同步金币
    const pages = getCurrentPages()
    const gamePage: any = pages[pages.length - 2]
    const goldFromGame = gamePage?.data?.gold ?? 0
    const [p1, p2] = pickTwoDistinct(PLANET_TYPES)
    
    // 从游戏页读取已拥有的小丑牌
    const ownedJokers: JokerCard[] = (gamePage?.data?.jokerCards || []) as JokerCard[]
    const ownedIds = ownedJokers.map(j => j.id)

    // 同步牌堆数量
    const remainCards = gamePage?.data?.remainCards ?? 0
    const totalCards = gamePage?.data?.totalCards ?? 0

    // 获取商店状态
    const shopStatus = ShopManager.getShopStatus(ownedIds)

    // 根据商店状态决定是否生成小丑牌商品
    let jokerOffers: ShopItem[] = []
    if (shopStatus.shouldShowShop) {
      jokerOffers = ShopManager.generateShopJokers(2, ownedIds)
    }
    
    this.setData({
      gold: goldFromGame,
      jokerCards: ownedJokers, // 直接使用游戏页面的jokerCards数据
      remainCards,
      totalCards,
      planetOffers: [
        { type: p1, level: this._getTypeLevelFromGame(gamePage, p1), price: 3, sold: false, chars: splitToChars(p1) },
        { type: p2, level: this._getTypeLevelFromGame(gamePage, p2), price: 3, sold: false, chars: splitToChars(p2) }
      ],
      jokerOffers,
      shopStatus
    })
  },

  showDeck() {
    const remain = this.data.remainCards
    const total = this.data.totalCards
    wx.showToast({ title: `${remain}/${total}`, icon: 'none' })
  },

  nextRoundFromShop() {
    const pages = getCurrentPages()
    const gamePage: any = pages[pages.length - 2]
    if (gamePage && typeof gamePage.nextRound === 'function') {
      // 先返回游戏页，再开启下一回合，确保数据环境正确
      wx.navigateBack({
        delta: 1,
        success: () => {
          setTimeout(() => {
            gamePage.nextRound()
          }, 0)
        }
      })
    } else {
      wx.showToast({ title: '无法进入下一回合', icon: 'none' })
    }
  },

  onShow() {
    // 每次显示页面时刷新背包数据，确保数据同步
    if (this.refreshBagData) {
      this.refreshBagData()
    }
    
    // 刷新商店状态
    this.refreshShopStatus()
  },

  // 刷新商店状态
  refreshShopStatus() {
    // 获取已购买的小丑牌
    const jokerCards = wx.getStorageSync('jokerCards') || []
    this.setData({
      jokerCards: jokerCards
    })
  },

  // 比赛信息与背包按钮交互
  ...BagManager.pageMethods,
  ...InfoPanelManager.pageMethods,

  // 购买星球牌
  buyPlanet(e: any) {
    const idx: number = e.currentTarget.dataset.index
    const offer = this.data.planetOffers[idx]
    if (!offer || offer.sold) return

    // 检查背包容量限制
    const bagItems = wx.getStorageSync('bagPlanetCards') || []
    if (bagItems.length >= 9) {
      wx.showToast({ title: '背包已满9个物品，无法购买', icon: 'none' })
      return
    }

    if (this.data.gold < offer.price) {
      wx.showToast({ title: '金币不足', icon: 'none' })
      return
    }

    // 扣金币并标记售出，加入背包
    const newGold = this.data.gold - offer.price
    const newOffers = this.data.planetOffers.slice()
    newOffers[idx] = { ...offer, sold: true }
    this.setData({ gold: newGold, planetOffers: newOffers })

    addPlanetToBag({ type: offer.type, level: offer.level })

    // 同步回游戏页金币
    const pages = getCurrentPages()
    const gamePage: any = pages[pages.length - 2]
    if (gamePage) gamePage.setData({ gold: newGold })
    
    // 保存到本地存储，确保游戏页面能同步金币
    wx.setStorageSync('gameGold', newGold)
  },

  // 购买小丑牌
  buyJoker(e: any) {
    const idx: number = e.currentTarget.dataset.index
    const joker = this.data.jokerOffers[idx]
    if (!joker) return

    if (joker.sold) return

    const pages = getCurrentPages()
    const gamePage: any = pages[pages.length - 2]
    const currentJokers: JokerCard[] = (gamePage?.data?.jokerCards || []) as JokerCard[]

    // 检查小丑牌数量限制
    if (currentJokers.length >= 7) {
      wx.showToast({ title: '小丑牌已满7张，无法购买', icon: 'none' })
      return
    }

    if (this.data.gold < joker.buyPrice) {
      wx.showToast({ title: '金币不足', icon: 'none' })
      return
    }

    // 扣金币并标记售出
    const newGold = this.data.gold - joker.buyPrice
    const newJokers = this.data.jokerOffers.slice()
    newJokers[idx] = { ...joker, sold: true }
    this.setData({ gold: newGold, jokerOffers: newJokers })

    // 将小丑牌添加到游戏页面的小丑牌槽位
    if (gamePage) {
      const updatedJokers = [...currentJokers, joker]
      
      // 使用游戏页面的更新方法，确保抽象小丑牌效果描述实时更新
      if (gamePage.updateJokerCards) {
        gamePage.updateJokerCards(updatedJokers)
      } else {
        gamePage.setData({ 
          gold: newGold,
          jokerCards: updatedJokers
        })
      }
      
      // 同步更新商店页面的jokerCards数据
      this.setData({ 
        jokerCards: updatedJokers
      })
      
      // 保存金币到本地存储，确保游戏页面能同步金币
      wx.setStorageSync('gameGold', newGold)
      
      // 更新商店状态
      const updatedShopStatus = ShopManager.getShopStatus(updatedJokers.map(j => j.id))
      
      this.setData({ 
        shopStatus: updatedShopStatus
      })
    }

    wx.showToast({ title: '已购买小丑牌', icon: 'success' })
  },

  // 计算抽象小丑的倍率加成
  calculateAbstractJokerBonus(jokerCards: any[]): number {
    const jokerCount = jokerCards.length
    return jokerCount * 3
  },

  // 从游戏页的牌型等级数据中取对应类型的当前等级
  _getTypeLevelFromGame(gamePage: any, type: string): number {
    try {
      // 同步派生类型逻辑，读取规范化类型等级
      const canonical = getCanonicalType(type)
      const levels = gamePage?.data?.typeLevels || wx.getStorageSync('typeLevels') || {}
      const lv = levels[canonical]
      if (typeof lv === 'number' && lv >= 1) return lv
    } catch (_) {}
    return 1
  },

  // 处理模仿者选择
  onMimicJokerSelected(e: any) {
    const { joker } = e.detail
    
    // 模仿者选择小丑牌
    if (joker.id === 'mimic-joker') {
      this.setData({
        showMimicSelector: true,
        currentMimicJoker: joker
      })
      return
    }

    // 处理蓝图小丑牌
    if (joker.id === 'blueprint-joker') {
      this.setData({
        showMimicSelector: true,
        currentMimicJoker: joker
      })
      return
    }

    // 普通小丑牌购买
    this.buyJoker(joker)
  },

  onMimicJokerSelect(e: any) {
    const { joker } = e.detail
    const blueprintJoker = this.data.currentMimicJoker
    
    if (blueprintJoker && joker) {
      // 激活模仿状态
      this.setData({
        mimicState: {
          mimickedJoker: joker,
          originalMimicJoker: blueprintJoker
        },
        showMimicSelector: false,
        currentMimicJoker: null
      })
      
      // 购买模仿者小丑牌
      this.buyJoker(blueprintJoker)
    }
  },

  onCancelMimic() {
    this.setData({
      showMimicSelector: false,
      currentMimicJoker: null
    })
  }
}) 