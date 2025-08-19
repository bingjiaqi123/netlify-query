// utils/generals/index.ts

// 导出类型和枚举
export * from './types'

// 导出所有武将相关的功能
export { sortGenerals } from './general-sorter'
export { calculateFragmentsNeeded, canUpgrade, upgradeGeneral, canBreakthrough, breakthroughGeneral } from './general-upgrader'
export { canAwaken, awakenGeneral } from './general-awakener' 