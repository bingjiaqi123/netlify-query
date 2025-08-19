// utils/upgrade-utils.ts

import type { CardTypeResult } from '../mechanics/card-types'
import { getCanonicalType, UPGRADE_RULES } from '../mechanics/card-types'

export type TypeLevels = Record<string, number>

export function getEffectiveLevel(levels: TypeLevels | undefined, type: string): number {
  const canonical = getCanonicalType(type)
  const lv = levels?.[canonical]
  return typeof lv === 'number' && lv >= 1 ? lv : 1
}

export function applyCardTypeUpgrades(cardTypeInfo: CardTypeResult, levels: TypeLevels | undefined): CardTypeResult {
  const effectiveLevel = getEffectiveLevel(levels, cardTypeInfo.type)
  const extraLevels = Math.max(0, effectiveLevel - 1)
  const canonical = getCanonicalType(cardTypeInfo.type)
  const rule = UPGRADE_RULES[canonical]
  if (!rule || extraLevels === 0) return { ...cardTypeInfo }
  return {
    ...cardTypeInfo,
    chip: cardTypeInfo.chip + extraLevels * rule.chip,
    multiplier: cardTypeInfo.multiplier + extraLevels * rule.multiplier
  }
}

export function incrementLevel(levels: TypeLevels, type: string): TypeLevels {
  const canonical = getCanonicalType(type)
  const current = levels[canonical] ?? 1
  return { ...levels, [canonical]: current + 1 }
} 