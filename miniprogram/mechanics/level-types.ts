// 关卡类型管理
export interface LevelConfig {
  type: string
  name: string
  reward: number // 关卡奖励金币
}

// 关卡类型配置
export const LEVEL_TYPES: { [key: string]: LevelConfig } = {
  'small-blind': {
    type: 'small-blind',
    name: '小盲注',
    reward: 3
  },
  'big-blind': {
    type: 'big-blind',
    name: '大盲注',
    reward: 4
  },
  'boss-battle': {
    type: 'boss-battle',
    name: 'Boss战',
    reward: 5
  }
}

// 固定配置
export const FIXED_CONFIG = {
  playCount: 4,
  discardCount: 3,
  handLimit: 7,
  initialGold: 4
}

// 获取关卡配置
export function getLevelConfig(type: string): LevelConfig {
  return LEVEL_TYPES[type]
}

// 获取所有关卡类型
export function getAllLevelTypes(): string[] {
  return Object.keys(LEVEL_TYPES)
}

// 获取关卡显示名称
export function getLevelDisplayName(type: string): string {
  const config = getLevelConfig(type)
  return config.name
} 