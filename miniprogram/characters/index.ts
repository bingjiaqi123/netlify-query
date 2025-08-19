// characters/index.ts
import { xiahouDun } from './wei/xiahou-dun'
import { jianYong } from './shu/jian-yong'
import { chengPu } from './wu/cheng-pu'
import { gaoShun } from './qun/gao-shun'
import { General } from '../utils/generals/types'

// 所有角色列表
export const allCharacters: General[] = [
  xiahouDun,
  jianYong,
  chengPu,
  gaoShun
]

// 按势力分组导出
export const weiCharacters = [xiahouDun]
export const shuCharacters = [jianYong]
export const wuCharacters = [chengPu]
export const qunCharacters = [gaoShun]

// 导出单个角色
export { xiahouDun } from './wei/xiahou-dun'
export { jianYong } from './shu/jian-yong'
export { chengPu } from './wu/cheng-pu'
export { gaoShun } from './qun/gao-shun' 