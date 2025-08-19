// characters/wu/cheng-pu.ts
import { General, Skill, Force, Rarity, RoleType } from '../../utils/generals/types'

// 程普技能数据
const chengPuSkills: Skill[] = [
  {
    id: 'yin_chun_zi_zui',
    name: '饮醇自醉',
    description: '对方发动决斗时一定概率转换为致盲卡',
    type: 'normal',
    currentLevel: 1, // 初始1级
    levels: [
      { level: 1, effect: '30%的概率发动', probability: 30 },
      { level: 2, effect: '35%的概率发动', probability: 35 },
      { level: 3, effect: '40%的概率发动', probability: 40 },
      { level: 4, effect: '45%的概率发动', probability: 45 },
      { level: 5, effect: '50%的概率发动', probability: 50 },
      { level: 6, effect: '55%的概率发动', probability: 55 },
      { level: 7, effect: '60%的概率发动', probability: 60 },
      { level: 8, effect: '65%的概率发动', probability: 65 },
      { level: 9, effect: '70%的概率发动', probability: 70 }
    ]
  },
  {
    id: 'jiang_biao_hu_chen',
    name: '江表虎臣',
    description: '进入关卡时获得初始爵位',
    type: 'awaken',
    currentLevel: 0, // 觉醒前为0级
    levels: [
      { level: 1, effect: '伍长', title: '伍长' },
      { level: 2, effect: '屯长', title: '屯长' },
      { level: 3, effect: '军司马', title: '军司马' },
      { level: 4, effect: '校尉', title: '校尉' },
      { level: 5, effect: '中郎将', title: '中郎将' },
      { level: 6, effect: '偏将军', title: '偏将军' },
      { level: 7, effect: '镇军将军', title: '镇军将军' }
    ]
  }
]

// 程普角色数据
export const chengPu: General = {
  id: 'cheng_pu',
  name: '程普',
  force: Force.WU,
  rarity: Rarity.R,
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
  skills: chengPuSkills,
  description: '吴国老将，孙坚的部将',
  obtainTime: Date.now(),
  
  // 新增字段
  fragments: 0, // 初始碎片数
  fragmentsNeeded: 100, // 升级所需碎片数（SR角色初始值）
  isAwakened: false, // 未觉醒
  awakenLevel: 0 // 觉醒等级
} 