// 回合阶段管理
export enum RoundPhase {
  INIT = 'init',           // 回合开始初始化
  USER_ACTION = 'user_action', // 用户操作阶段
  SCORING = 'scoring',     // 计分阶段
  AUTO_DRAW = 'auto_draw', // 自动发牌阶段
  SETTLEMENT = 'settlement' // 结算阶段
}

export interface RoundState {
  phase: RoundPhase
  currentRound: number
  remainPlay: number
  remainDiscard: number
  roundScore: number
  targetScore: number
  handLimit: number
  currentHandCount: number
  deckRemaining: number
  isGameOver: boolean
  isRoundWin: boolean
}

// 回合配置
export interface RoundConfig {
  basePlayCount: number
  baseDiscardCount: number
  baseHandLimit: number
  autoDrawCount: number
}

// 默认回合配置
export const DEFAULT_ROUND_CONFIG: RoundConfig = {
  basePlayCount: 4,
  baseDiscardCount: 3,
  baseHandLimit: 7,
  autoDrawCount: 1
}

// 初始化回合状态
export function initRoundState(round: number, baseBet: number, config: RoundConfig): RoundState {
  return {
    phase: RoundPhase.INIT,
    currentRound: round,
    remainPlay: config.basePlayCount,
    remainDiscard: config.baseDiscardCount,
    roundScore: 0,
    targetScore: baseBet * 300, // 使用固定倍率300
    handLimit: config.baseHandLimit,
    currentHandCount: 0,
    deckRemaining: 48,
    isGameOver: false,
    isRoundWin: false
  }
}

// 计算自动发牌数量
export function calculateAutoDrawCount(handLimit: number, currentHandCount: number): number {
  // 抽到手牌上限，即抽 手牌上限 - 当前手牌数 张牌
  return Math.max(0, handLimit - currentHandCount)
}

// 检查游戏是否失败
export function checkGameOver(remainPlay: number): boolean {
  return remainPlay <= 0
}

// 检查回合是否胜利
export function checkRoundWin(roundScore: number, targetScore: number): boolean {
  return roundScore >= targetScore
} 