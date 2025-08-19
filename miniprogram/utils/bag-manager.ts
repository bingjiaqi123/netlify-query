import { incrementLevel } from './upgrade-utils'
import { getCanonicalType } from '../mechanics/card-types'

export class BagManager {
  static pageMethods: {
    openBag(this: any): void
    closeBag(this: any): void
    selectBagItem(this: any, e: any): void
    useSelectedPlanet(this: any): void
    sellSelectedPlanet(this: any): void
    toggleSelectOne(this: any, e: any): void
    toggleSelectAll(this: any): void
    refreshBagData(this: any): void
  } = {
    openBag(this: any) {
      // 每次打开背包时都从存储中重新读取最新数据
      this.refreshBagData()
      this.setData({ showBagPanel: true })
    },
    closeBag(this: any) {
      this.setData({ showBagPanel: false, selectedBagIndex: -1, isAllSelected: false, selectedCount: 0 })
    },
    // 新增：刷新背包数据的方法
    refreshBagData(this: any) {
      const items = (wx.getStorageSync('bagPlanetCards') || []) as Array<{ type: string; level?: number }>
      const withFlags = items.map((i, idx) => ({ id: idx, type: i.type, level: i.level ?? 1, chars: Array.from(i.type), __selected: false }))
      this.setData({ 
        bagItems: withFlags, 
        selectedBagIndex: -1, 
        isAllSelected: false, 
        selectedCount: 0 
      })
    },
    selectBagItem(this: any, e: any) {
      const index = e.currentTarget.dataset.index
      this.setData({ selectedBagIndex: index })
    },
    toggleSelectOne(this: any, e: any) {
      const idx = e.currentTarget.dataset.index
      const list = (this.data.bagItems || []).slice()
      if (!list[idx]) return
      list[idx].__selected = !list[idx].__selected
      const count = list.filter((x: any) => x.__selected).length
      this.setData({ bagItems: list, selectedCount: count, isAllSelected: count > 0 && count === list.length })
    },
    toggleSelectAll(this: any) {
      const list = (this.data.bagItems || []).slice()
      const target = !(this.data.isAllSelected || false)
      for (const it of list) it.__selected = target
      const count = target ? list.length : 0
      this.setData({ bagItems: list, isAllSelected: target, selectedCount: count })
    },
    useSelectedPlanet(this: any) {
      const raw = (wx.getStorageSync('bagPlanetCards') || []) as Array<{ type: string; level?: number }>
      const list = (this.data.bagItems || []) as Array<any>
      const indices = list.map((it, i) => (it.__selected ? i : -1)).filter((i) => i >= 0)
      if (indices.length === 0) return
      // 升级对应牌型等级（逐个）
      let levels = this.data.typeLevels || {}
      for (const i of indices) {
        const item = raw[i]
        if (!item) continue
        const canonicalType = getCanonicalType(item.type)
        levels = incrementLevel(levels, canonicalType)
      }
      wx.setStorageSync('typeLevels', levels)
      this.setData({ typeLevels: levels })
      // 同步等级到游戏页面
      const pages = getCurrentPages()
      const gamePage: any = pages.find(p => (p as any).route?.endsWith('pages/balatro/balatro'))
      if (gamePage) gamePage.setData({ typeLevels: levels })
      // 从背包剔除选中
      const remain = raw.filter((_, i) => !indices.includes(i))
      wx.setStorageSync('bagPlanetCards', remain)
      const withFlags = remain.map((i, idx) => ({ id: idx, type: i.type, level: i.level ?? 1, chars: Array.from(i.type), __selected: false }))
      this.setData({ bagItems: withFlags, selectedCount: 0, isAllSelected: false })
      wx.showToast({ title: '已使用', icon: 'success' })
    },
    sellSelectedPlanet(this: any) {
      const raw = (wx.getStorageSync('bagPlanetCards') || []) as Array<{ type: string; level?: number }>
      const list = (this.data.bagItems || []) as Array<any>
      const indices = list.map((it, i) => (it.__selected ? i : -1)).filter((i) => i >= 0)
      if (indices.length === 0) return
      // 售出 +selectedCount 金币
      const gold = (this.data.gold || 0) + indices.length
      this.setData({ gold })
      const pages = getCurrentPages()
      const gamePage: any = pages.find(p => (p as any).route?.endsWith('pages/balatro/balatro'))
      if (gamePage) gamePage.setData({ gold })
      
      // 保存金币到本地存储
      wx.setStorageSync('gameGold', gold)
      // 从背包剔除选中
      const remain = raw.filter((_, i) => !indices.includes(i))
      wx.setStorageSync('bagPlanetCards', remain)
      const withFlags = remain.map((i, idx) => ({ id: idx, type: i.type, level: i.level ?? 1, chars: Array.from(i.type), __selected: false }))
      this.setData({ bagItems: withFlags, selectedCount: 0, isAllSelected: false })
      wx.showToast({ title: `已售出 +🥮${indices.length}`, icon: 'success' })
    }
  }
}

export function addPlanetToBag(item: { type: string; level?: number }) {
  const items = (wx.getStorageSync('bagPlanetCards') || []) as Array<{ type: string; level?: number }>
  items.push({ type: item.type, level: item.level ?? 1 })
  wx.setStorageSync('bagPlanetCards', items)
  
  // 尝试通知当前页面刷新背包数据
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && typeof currentPage.refreshBagData === 'function') {
    currentPage.refreshBagData()
  }
} 