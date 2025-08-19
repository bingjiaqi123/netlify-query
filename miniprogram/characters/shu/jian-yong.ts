// characters/shu/jian-yong.ts
import { General, Skill, Force, Rarity, RoleType } from '../../utils/generals/types'

// 简雍技能数据
const jianYongSkills: Skill[] = [
  {
    id: 'bu_ju_xiao_jie',
    name: '不拘小节',
    description: '一定概率答题时只计内容分，流畅度不扣分',
    type: 'normal',
    currentLevel: 1, // 初始1级
    levels: [
      { level: 1, effect: '50%的概率发动', probability: 50 },
      { level: 2, effect: '55%的概率发动', probability: 55 },
      { level: 3, effect: '60%的概率发动', probability: 60 },
      { level: 4, effect: '75%的概率发动', probability: 75 },
      { level: 5, effect: '80%的概率发动', probability: 80 },
      { level: 6, effect: '85%的概率发动', probability: 85 },
      { level: 7, effect: '90%的概率发动', probability: 90 },
      { level: 8, effect: '95%的概率发动', probability: 95 },
      { level: 9, effect: '100%的概率发动', probability: 100 }
    ]
  },
  {
    id: 'gui_bian',
    name: '诡辩',
    description: '决斗时每回合有概率无效化一张对方的卡片',
    type: 'awaken',
    currentLevel: 0, // 觉醒前为0级
    levels: [
      { level: 1, effect: '20%的概率发动', probability: 20 },
      { level: 2, effect: '25%的概率发动', probability: 25 },
      { level: 3, effect: '30%的概率发动', probability: 30 },
      { level: 4, effect: '35%的概率发动', probability: 35 },
      { level: 5, effect: '40%的概率发动', probability: 40 },
      { level: 6, effect: '45%的概率发动', probability: 45 },
      { level: 7, effect: '50%的概率发动', probability: 50 }
    ]
  }
]

// 简雍角色数据
export const jianYong: General = {
  id: 'jian_yong',
  name: '简雍',
  force: Force.SHU,
  rarity: Rarity.UR,
  roleType: RoleType.CIVIL,
  level: 0,
  maxLevel: 30, // 当前等级上限
  baseMaxLevel: 30, // 基础等级上限
  exp: 0,
  maxExp: 100,
  hp: 100, // 默认血量上限
  maxHp: 100,
  actionCardSlots: 5, // 默认行动卡槽
  weaponCardSlots: 9,
  skills: jianYongSkills,
  description: '蜀国谋士，刘备的重要幕僚',
  obtainTime: Date.now(),
  
  // 新增字段
  fragments: 0, // 初始碎片数
  fragmentsNeeded: 100, // 升级所需碎片数（SR角色初始值）
  isAwakened: false, // 未觉醒
  awakenLevel: 0 // 觉醒等级
} 