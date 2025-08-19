// 为了向后兼容，保留原有接口
export interface JokerCard {
  id: string;
  name: string;
  rarity: '普通' | '罕见' | '稀有' | '传说';
  effect: string;
  buyPrice: number;
  sellPrice: number;
  backgroundColor: string;
  textColor: string;
  sold?: boolean;
  category?: '张数卡' | '弃牌卡' | '塔罗卡' | '手牌卡' | '点数卡' | '保底卡' | '顺劈卡' | '商店卡';
}

// 导入新的分类系统
import { ALL_JOKERS, getRandomJokerCards as getRandomJokersFromCategories } from './joker-categories'

// 使用新的分类系统
export const JOKER_CARDS: JokerCard[] = ALL_JOKERS;

export const RARITY_ORDER = {
  '传说': 4,
  '稀有': 3,
  '罕见': 2,
  '普通': 1
};

export function getJokerCardById(id: string): JokerCard | undefined {
  return JOKER_CARDS.find(card => card.id === id);
}

export function getRandomJokerCards(count: number): JokerCard[] {
  return getRandomJokersFromCategories(count, []);
}

export function getRandomJokerCardsExcluding(count: number, excludeIds: string[]): JokerCard[] {
  return getRandomJokersFromCategories(count, excludeIds || []);
} 