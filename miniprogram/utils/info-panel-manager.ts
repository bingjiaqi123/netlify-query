// utils/info-panel-manager.ts
import { getEffectiveLevel, applyCardTypeUpgrades } from './upgrade-utils'
import { TYPE_BASES } from '../mechanics/card-types'

export class InfoPanelManager {
  static pageMethods: {
    showInfo(this: any): void
    closeInfo(this: any): void
    switchInfoTab(this: any, e: any): void
  } = {
    showInfo(this: any) {
      const typeLevels = this.data.typeLevels || {}
      const rows = TYPE_BASES.map((t) => {
        const effectiveLevel = getEffectiveLevel(typeLevels, t.type)
        const upgraded = applyCardTypeUpgrades({ type: t.type, chip: t.chip, multiplier: t.multiplier, count: 0 }, typeLevels)
        return {
          level: effectiveLevel,
          type: t.type,
          chip: upgraded.chip,
          multiplier: upgraded.multiplier,
          playCount: (this.data.cardTypeCounts && this.data.cardTypeCounts[t.type]) || 0
        }
      })
      this.setData({
        showInfoPanel: true,
        infoActiveTab: 'types',
        infoTypeRows: rows
      })
    },
    closeInfo(this: any) {
      this.setData({ showInfoPanel: false })
    },
    switchInfoTab(this: any, e: any) {
      const tab = e.currentTarget.dataset.tab || 'types'
      this.setData({ infoActiveTab: tab })
    }
  }
} 