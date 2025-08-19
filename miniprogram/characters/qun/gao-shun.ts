// characters/qun/gao-shun.ts
import { General, Skill, Force, Rarity, RoleType } from '../../utils/generals/types'

// 高顺技能数据
const gaoShunSkills: Skill[] = [
  {
    id: 'xian_zhen_zhi_zhi',
    name: '陷阵之志',
    description: '每回合一定概率升级1张武器卡',
    type: 'normal',
    currentLevel: 1, // 初始1级
    levels: [
      { level: 1, effect: '每回合30%概率升级1张武器卡', probability: 30 },
      { level: 2, effect: '每回合35%概率升级1张武器卡', probability: 35 },
      { level: 3, effect: '每回合40%概率升级1张武器卡', probability: 40 },
      { level: 4, effect: '每回合45%概率升级1张武器卡', probability: 45 },
      { level: 5, effect: '每回合50%概率升级1张武器卡', probability: 50 },
      { level: 6, effect: '每回合55%概率升级1张武器卡', probability: 55 },
      { level: 7, effect: '每回合60%概率升级1张武器卡', probability: 60 },
      { level: 8, effect: '每回合65%概率升级1张武器卡', probability: 65 },
      { level: 9, effect: '每回合70%概率升级1张武器卡', probability: 70 }
    ]
  },
  {
    id: 'xun_xi_zhan_luan',
    name: '迅析斩乱',
    description: '决斗开始时可以扔掉1张行动卡提升防御或攻击',
    type: 'awaken',
    currentLevel: 1, // 觉醒前为0级
    levels: [
      { level: 1, effect: '70%的概率发动', probability: 70 },
      { level: 2, effect: '75%的概率发动', probability: 75 },
      { level: 3, effect: '80%的概率发动', probability: 80 },
      { level: 4, effect: '85%的概率发动', probability: 85 },
      { level: 5, effect: '90%的概率发动', probability: 90 },
      { level: 6, effect: '95%的概率发动', probability: 95 },
      { level: 7, effect: '100%的概率发动', probability: 100 }
    ]
  }
]

// 高顺角色数据
export const gaoShun: General = {
  id: 'gao_shun',
  name: '高顺',
  force: Force.QUN,
  rarity: Rarity.SR,
  roleType: RoleType.MILITARY,
  level: 0,
  maxLevel: 30, // 当前等级上限
  baseMaxLevel: 30, // 基础等级上限
  exp: 0,
  maxExp: 100,
  hp: 100, // 默认血量上限
  maxHp: 100,
  actionCardSlots: 5, // 默认行动卡槽
  weaponCardSlots: 9,
  skills: gaoShunSkills,
  description: '吕布部将，陷阵营统领',
  obtainTime: Date.now(),
  
  fragments: 0, // 初始碎片数
  fragmentsNeeded: 100, // 升级所需碎片数（SR角色初始值）
  isAwakened: true, // 已觉醒
  awakenLevel: 1 // 觉醒等级
} 