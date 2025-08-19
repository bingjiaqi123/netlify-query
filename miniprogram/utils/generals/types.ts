// utils/generals.ts

// 角色稀有度枚举
export enum Rarity {
  N = 'N',
  R = 'R',
  SR = 'SR',
  SSR = 'SSR',
  UR = 'UR'
}

// 势力枚举
export enum Force {
  WEI = 'wei',
  SHU = 'shu',
  WU = 'wu',
  QUN = 'qun'
}

// 角色类型枚举
export enum RoleType {
  LORD = 'lord',    // 主公
  CIVIL = 'civil',  // 文臣
  MILITARY = 'military' // 武将
}

// 技能接口
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'normal' | 'awaken'; // 普通技能或觉醒技能
  currentLevel: number; // 当前等级
  levels: SkillLevel[];
}

// 技能等级接口
export interface SkillLevel {
  level: number;
  effect: string;
  probability?: number; // 概率类技能
  value?: number; // 数值类技能
  title?: string; // 标题类技能（如爵位）
}

// 角色接口
export interface General {
  id: string;
  name: string;
  force: Force;
  rarity: Rarity;
  roleType: RoleType;
  level: number;
  maxLevel: number; // 当前等级上限
  baseMaxLevel: number; // 基础等级上限（30级）
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  actionCardSlots: number; // 行动卡槽数量
  weaponCardSlots: number; // 武器卡槽数量
  skills: Skill[];
  description: string;
  obtainTime: number; // 获取时间戳
  avatar?: string; // 头像路径
  
  // 新增字段
  fragments: number; // 当前碎片数
  fragmentsNeeded: number; // 升级所需碎片数
  isAwakened: boolean; // 是否已觉醒
  awakenLevel: number; // 觉醒等级（0-6，0表示未觉醒）
}



// 获取所有角色
export function getAllGenerals(): General[] {
  const generals = wx.getStorageSync('generals')
  if (generals) {
    return generals
  }
  
  // 如果没有存储数据，导入初始角色数据
  const { allCharacters } = require('../../characters/index')
  return allCharacters
}

// 保存角色数据
export function saveGenerals(generals: General[]) {
  wx.setStorageSync('generals', generals)
}

// 获取稀有度颜色
export function getRarityColor(rarity: Rarity): string {
  const colors = {
    [Rarity.UR]: '#FFD700', // 金色
    [Rarity.SSR]: '#FF6B6B', // 红色
    [Rarity.SR]: '#4ECDC4', // 青色
    [Rarity.R]: '#45B7D1', // 蓝色
    [Rarity.N]: '#96CEB4' // 绿色
  }
  return colors[rarity]
}

// 获取势力颜色
export function getForceColor(force: Force): string {
  const colors = {
    [Force.WEI]: '#3498db', // 蓝色
    [Force.SHU]: '#2ecc71', // 绿色
    [Force.WU]: '#e67e22', // 橙色
    [Force.QUN]: '#9b59b6' // 紫色
  }
  return colors[force]
}

// 获取势力名称
export function getForceName(force: Force): string {
  const names = {
    [Force.WEI]: '魏',
    [Force.SHU]: '蜀',
    [Force.WU]: '吴',
    [Force.QUN]: '群'
  }
  return names[force]
}

// 获取角色类型名称
export function getRoleTypeName(roleType: RoleType): string {
  const names = {
    [RoleType.LORD]: '主公',
    [RoleType.CIVIL]: '文臣',
    [RoleType.MILITARY]: '武将'
  }
  return names[roleType]
}

// 获取角色类型颜色
export function getRoleTypeColor(roleType: RoleType): string {
  const colors = {
    [RoleType.LORD]: '#e74c3c', // 红色
    [RoleType.CIVIL]: '#3498db', // 蓝色
    [RoleType.MILITARY]: '#f39c12' // 橙色
  }
  return colors[roleType]
}