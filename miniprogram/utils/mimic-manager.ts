// utils/mimic-manager.ts
// 模仿者小丑牌管理器

import { JokerCard } from '../mechanics/joker-categories'

export interface MimicState {
  isActive: boolean
  mimickedJoker: JokerCard | null
  originalMimicJoker: JokerCard | null
}

export class MimicManager {
  private static mimicState: MimicState = {
    isActive: false,
    mimickedJoker: null,
    originalMimicJoker: null
  }

  // 检查是否拥有模仿者小丑牌
  static hasMimicJoker(jokerCards: JokerCard[]): boolean {
    return jokerCards.some(joker => joker.id === 'blueprint-joker')
  }

  // 获取可模仿的小丑牌（排除模仿者本身）
  static getAvailableJokersForMimic(jokerCards: JokerCard[]): JokerCard[] {
    return jokerCards.filter(joker => joker.id !== 'blueprint-joker')
  }

  // 激活模仿状态
  static activateMimic(mimickedJoker: JokerCard, originalMimicJoker: JokerCard): void {
    this.mimicState = {
      isActive: true,
      mimickedJoker: { ...mimickedJoker },
      originalMimicJoker: { ...originalMimicJoker }
    }
  }

  // 获取当前模仿状态
  static getMimicState(): MimicState {
    return { ...this.mimicState }
  }

  // 检查是否处于模仿状态
  static isMimicActive(): boolean {
    return this.mimicState.isActive
  }

  // 获取模仿的小丑牌
  static getMimickedJoker(): JokerCard | null {
    return this.mimicState.mimickedJoker
  }

  // 重置模仿状态（回合胜利后调用）
  static resetMimic(): void {
    this.mimicState = {
      isActive: false,
      mimickedJoker: null,
      originalMimicJoker: null
    }
  }

  // 获取用于显示的小丑牌数组（包含模仿效果）
  static getDisplayJokers(jokerCards: JokerCard[]): JokerCard[] {
    if (!this.mimicState.isActive || !this.mimicState.mimickedJoker) {
      return jokerCards
    }

    return jokerCards.map(joker => {
      if (joker.id === 'blueprint-joker') {
        // 将模仿者替换为被模仿的小丑牌，并添加镭射阴影标识
        return {
          ...this.mimicState.mimickedJoker!,
          id: this.mimicState.mimickedJoker!.id, // 完全一样的ID，不加前缀
          name: `${this.mimicState.mimickedJoker!.name}(模仿)`,
          hasLaserShadow: true,
          isMimicCopy: true,
          originalMimicJoker: this.mimicState.originalMimicJoker
        }
      }
      return joker
    })
  }

  // 检查小丑牌是否为模仿复制
  static isMimicCopy(joker: JokerCard): boolean {
    return joker.isMimicCopy === true
  }

  // 获取原始的小丑牌数组（用于计分等逻辑）
  static getOriginalJokers(jokerCards: JokerCard[]): JokerCard[] {
    return jokerCards.map(joker => {
      if (this.isMimicCopy(joker)) {
        // 如果是模仿复制，返回原始的小丑牌
        return this.mimicState.originalMimicJoker || joker
      }
      return joker
    })
  }
} 