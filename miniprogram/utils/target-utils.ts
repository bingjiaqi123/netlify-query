// utils/target-utils.ts

export function getScoreTargetByBet(bet: number, levelType?: string): number {
  const smallBlindTargets: { [key: number]: number } = {
    1: 300,
    2: 800,
    3: 2000,
    4: 5000,
    5: 11000,
    6: 20000,
    7: 35000
  }
  const baseTarget = smallBlindTargets[bet] || 300

  if (levelType === 'big-blind') return Math.floor(baseTarget * 1.5)
  if (levelType === 'boss-battle') return baseTarget * 2
  return baseTarget
} 