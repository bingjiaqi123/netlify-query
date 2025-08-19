// mechanics/game-modes.ts

export interface GameModeConfig {
  name: string
  description: string
  initialGold: number
  cardsPerRound: number
  discardsPerRound: number
}

export const GAME_MODES: Record<string, GameModeConfig> = {
  classic: {
    name: '经典模式',
    description: '一气呵成',
    initialGold: 6,
    cardsPerRound: 4,
    discardsPerRound: 3
  },
  adventure: {
    name: '破釜沉舟',
    description: '有钱任性',
    initialGold: 9,
    cardsPerRound: 1,
    discardsPerRound: 6
  },
  quick: {
    name: '一气呵成',
    description: '快速通关',
    initialGold: 6,
    cardsPerRound: 6,
    discardsPerRound: 1
  },
  rich: {
    name: '有钱任性',
    description: '金币充足',
    initialGold: 24,
    cardsPerRound: 3,
    discardsPerRound: 2
  }
}

export function getGameModeConfig(mode: string): GameModeConfig {
  return GAME_MODES[mode] || GAME_MODES.classic
} 