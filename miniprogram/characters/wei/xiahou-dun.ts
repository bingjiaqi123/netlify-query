// characters/wei/xiahou-dun.ts
import { General, Skill, Force, Rarity, RoleType } from '../../utils/generals/types'

// 夏侯惇技能数据
const xiahouDunSkills: Skill[] = [
  {
    id: 'guan_yun_heng_tong',
    name: '官运亨通',
    description: '决斗失败时升官',
    type: 'normal',
    currentLevel: 1, // 初始1级
    levels: [
      { level: 1, effect: '每决斗失败1次，60%的概率自动升官1级', probability: 60 },
      { level: 2, effect: '每决斗失败1次，65%的概率自动升官1级', probability: 65 },
      { level: 3, effect: '每决斗失败1次，70%的概率自动升官1级', probability: 70 },
      { level: 4, effect: '每决斗失败1次，75%的概率自动升官1级', probability: 75 },
      { level: 5, effect: '每决斗失败1次，80%的概率自动升官1级', probability: 80 },
      { level: 6, effect: '每决斗失败1次，85%的概率自动升官1级', probability: 85 },
      { level: 7, effect: '每决斗失败1次，90%的概率自动升官1级', probability: 90 },
      { level: 8, effect: '每决斗失败1次，95%的概率自动升官1级', probability: 95 },
      { level: 9, effect: '每决斗失败1次，100%的概率自动升官1级', probability: 100 }
    ]
  },
  {
    id: 'gang_lie',
    name: '刚烈',
    description: '被致盲和被暴击时恢复血量',
    type: 'awaken',
    currentLevel: 0, // 觉醒前为0级
    levels: [
      { level: 1, effect: '被致盲和被暴击时，自动恢复6点血量', value: 6 },
      { level: 2, effect: '被致盲和被暴击时，自动恢复12点血量', value: 12 },
      { level: 3, effect: '被致盲和被暴击时，自动恢复18点血量', value: 18 },
      { level: 4, effect: '被致盲和被暴击时，自动恢复24点血量', value: 24 },
      { level: 5, effect: '被致盲和被暴击时，自动恢复32点血量', value: 32 },
      { level: 6, effect: '被致盲和被暴击时，自动恢复40点血量', value: 40 },
      { level: 7, effect: '被致盲和被暴击时，自动恢复50点血量', value: 50 }
    ]
  }
]

// 夏侯惇角色数据
export const xiahouDun: General = {
  id: 'xiahou_dun',
  name: '夏侯惇',
  force: Force.WEI,
  rarity: Rarity.SSR,
  roleType: RoleType.MILITARY,
  level: 0,
  maxLevel: 30, // 当前等级上限
  baseMaxLevel: 30, // 基础等级上限
  exp: 0,
  maxExp: 100,
  hp: 90, // 初始血量上限-10
  maxHp: 90,
  actionCardSlots: 4, // 行动卡槽-1
  weaponCardSlots: 9,
  skills: xiahouDunSkills,
  description: '魏国名将，曹操的堂弟，以勇猛著称',
  obtainTime: Date.now(),
  
  // 新增字段
  fragments: 0, // 初始碎片数  fragments: 0, // 初始碎片数
  fragmentsNeeded: 100, // 升级所需碎片数（SR角色初始值）
  isAwakened: false, // 未觉醒
  awakenLevel: 0 // 觉醒等级
} 