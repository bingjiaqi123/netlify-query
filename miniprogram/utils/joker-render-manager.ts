// utils/joker-render-manager.ts

import { MimicManager } from './mimic-manager'

export interface RenderableJoker {
  id: string
  name: string
  rarity: string
  effect: string
  buyPrice: number
  sellPrice: number
  backgroundColor: string
  textColor: string
  category: string
  isBlueprintCopy: boolean
  copiedFrom?: any
  hasLaserShadow: boolean
}

export class JokerRenderManager {
  // 处理小丑牌显示，返回用于渲染的小丑牌数组
  static processBlueprintJokers(jokerCards: any[], abstractJokerBonus: number = 0): RenderableJoker[] {
    const processedJokers: RenderableJoker[] = []
    
    for (let i = 0; i < jokerCards.length; i++) {
      const currentJoker = jokerCards[i]
      if (!currentJoker) { continue }
      
      // 检查是否为模仿者小丑牌，如果是则使用MimicManager处理
      if (currentJoker.id === 'blueprint-joker') {
        if (MimicManager.isMimicActive()) {
          const mimickedJoker = MimicManager.getMimickedJoker()
          if (mimickedJoker) {
            // 完全模仿被模仿的小丑牌，包括ID和效果
            let effect = mimickedJoker.effect
            if (mimickedJoker.id === 'abstract-joker') {
              // 抽象小丑：显示预计算的倍率加成
              if (abstractJokerBonus > 0) {
                effect = `+${abstractJokerBonus}倍率`
              }
            }
            
            processedJokers.push({
              ...mimickedJoker,
              id: mimickedJoker.id, // 完全一样的ID，不加前缀
              name: `${mimickedJoker.name}(模仿)`,
              effect: effect, // 使用更新后的效果描述
              isBlueprintCopy: true,
              copiedFrom: mimickedJoker,
              hasLaserShadow: true
            })
          }
        } else {
          processedJokers.push({
            ...currentJoker,
            isBlueprintCopy: false,
            hasLaserShadow: false
          })
        }
      } else {
        // 普通小丑牌：直接添加，特殊处理抽象小丑牌的效果描述
        let effect = currentJoker.effect
        if (currentJoker.id === 'abstract-joker') {
          // 抽象小丑：显示预计算的倍率加成
          if (abstractJokerBonus > 0) {
            effect = `+${abstractJokerBonus}倍率`
          }
        }
        
        processedJokers.push({
          ...currentJoker,
          effect,
          isBlueprintCopy: false,
          hasLaserShadow: false
        })
      }
    }
    return processedJokers
  }
  
  // 获取小丑牌区的显示名称
  static getJokerDisplayNames(jokerCards: any[]): string[] {
    return jokerCards.map(joker => {
      if (!joker) {
        return ''
      }
      
      // 检查是否为模仿者小丑牌
      if (joker.id === 'blueprint-joker') {
        const { MimicManager } = require('./mimic-manager')
        
        if (MimicManager.isMimicActive()) {
          const mimickedJoker = MimicManager.getMimickedJoker()
          return mimickedJoker ? `${joker.name}→${mimickedJoker.name}` : joker.name
        }
        return joker.name
      }
      
      return joker.name
    })
  }
} 