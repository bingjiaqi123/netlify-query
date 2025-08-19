// utils/scoring-manager.ts
import { calculateCardType } from '../mechanics/card-types'
import { RoundPhase } from '../mechanics/round-phases'
import { getValidCardsForScoring as computeValidCards, getCardPointValue } from './scoring-utils'
import { applyCardTypeUpgrades, getEffectiveLevel } from './upgrade-utils'

export class ScoringManager {
  // 供 Page({...}) 一行展开的方法集合
  static pageMethods: {
    playCard(this: any): void
    startChipScoring(this: any, cards: any[], cardTypeInfo: any): void
  } = {
    playCard(this: any) {
      if (!this.data.hasSelectedCards || this.data.isScoring) return
      if (this.data.remainPlay <= 0) return

      const selectedCardsList = this.getSelectedCards()
      if (selectedCardsList.length === 0) return

      let cardTypeInfo = calculateCardType(selectedCardsList)
      // 应用牌型等级加成（来源于背包使用）
      cardTypeInfo = applyCardTypeUpgrades(cardTypeInfo, this.data.typeLevels)
      const effectiveLevel = getEffectiveLevel(this.data.typeLevels, cardTypeInfo.type)

      // 统计并累加该牌型的出牌次数
      const cardType = cardTypeInfo.type
      const cardTypeCounts = { ...(this.data.cardTypeCounts || {}) }
      const newCountForType = (cardTypeCounts[cardType] || 0) + 1
      cardTypeCounts[cardType] = newCountForType

      this.setData({
        remainPlay: this.data.remainPlay - 1,
        scoreCards: selectedCardsList,
        currentMultiplier: cardTypeInfo.multiplier,
        cardType: cardType,
        cardCount: newCountForType, // 显示为当前牌型累计次数
        cardGrade: effectiveLevel,
        isScoring: true,
        scoreAnim: '',
        cardTypeCounts,
        currentChip: cardTypeInfo.chip
      })

      // 从手牌区移除选中的牌
      this.removeSelectedCardsFromHand()

      // 进入计分阶段
      this.setData({ 'roundState.phase': RoundPhase.SCORING })

      // 开始动态筹码计分
      ScoringManager._startChipScoring(this, selectedCardsList, cardTypeInfo)
    },

    startChipScoring(this: any, cards: any[], cardTypeInfo: any) {
      ScoringManager._startChipScoring(this, cards, cardTypeInfo)
    }
  }

  // 实际的计分实现（接收页面实例）
  private static _startChipScoring(page: any, cards: any[], cardTypeInfo: any) {
    const validCards = computeValidCards(cards, cardTypeInfo)
    const jokerCards = page.data.jokerCards || []
    
    // 预检查阶段：找出有效的点数卡
    const validPointJokers = ScoringManager._checkValidPointJokers(jokerCards, validCards)

    const initialScoreCards = cards.map(card => ({
      ...card,
      isValid: false
    }))

    page.setData({ scoreCards: initialScoreCards })

    let currentChip = cardTypeInfo.chip
    let currentMultiplier = cardTypeInfo.multiplier
    let cardIndex = 0
    let firstValidCardTriggered = false

    const processNextCard = () => {
      if (cardIndex < cards.length) {
        const currentCard = cards[cardIndex]
        
        // 修复有效牌判断逻辑：检查当前牌是否在有效牌数组中
        const isCardValid = validCards.some((validCard: any) => {
          // 优先使用索引比较，如果索引相同则认为是同一张牌
          if (validCard === currentCard) return true
          // 如果索引不同，则比较花色和点数
          return validCard.suit === currentCard.suit && validCard.point === currentCard.point
        })

        if (isCardValid) {
          const pointValue = getCardPointValue(currentCard.point)
          
          // 处理点数卡效果
          ScoringManager._processCardWithPointJokers(page, cardIndex, currentCard, pointValue, validPointJokers, currentChip, currentMultiplier, firstValidCardTriggered, () => {
            // 更新全局状态
            currentChip = page.data.currentChip
            currentMultiplier = page.data.currentMultiplier
            
            if (!firstValidCardTriggered) {
              firstValidCardTriggered = true
            }
            cardIndex++
            processNextCard()
          })
        } else {
          // 无效牌，直接跳过
          // 更新无效牌的状态
          const updatedScoreCards = [...page.data.scoreCards]
          updatedScoreCards[cardIndex] = {
            ...updatedScoreCards[cardIndex],
            isValid: false,
            colorState: 'invalid'
          }
          
          page.setData({ scoreCards: updatedScoreCards })
          
          setTimeout(() => {
            cardIndex++
            processNextCard()
          }, 100)
        }
      } else {
        // 开始小丑牌效果动画（非点数卡）
        // 使用最新的筹码和倍率
        const finalChip = page.data.currentChip
        const finalMultiplier = page.data.currentMultiplier
        ScoringManager._startJokerEffects(page, cards, cardTypeInfo, finalChip, finalMultiplier)
      }
    }

    processNextCard()
  }

  // 开始小丑牌效果动画
  private static _startJokerEffects(page: any, cards: any[], cardTypeInfo: any, currentChip: number, currentMultiplier: number) {
    const jokerCards = page.data.jokerCards || []
    const validJokers = jokerCards.filter((joker: any) => 
      (joker.id === 'flag-joker') || 
      (joker.id === 'half-joker' && cards.length <= 3) ||
      (joker.category === '保底卡') ||
      (joker.id === 'joker-joker') ||
      (joker.id === 'banana-joker') ||
      (joker.id === 'abstract-joker') ||
      (joker.id === 'cavendish-joker') ||
      (joker.id === 'baseball-card-joker') ||
      (joker.category === '顺劈卡') ||
      (joker.id === 'blueprint-joker')
      // 点数卡已在计分阶段处理，这里不再处理
    )
    
    console.log('有效小丑牌：', validJokers.map((j: any) => j.id))
    
    if (validJokers.length === 0) {
      // 没有有效小丑牌，直接计算最终分数
      ScoringManager._calculateFinalScore(page, currentChip, cardTypeInfo.multiplier)
      return
    }
    
        let jokerIndex = 0
    let finalChip = currentChip
    let finalMultiplier = currentMultiplier
    
    const processNextJoker = () => {
      if (jokerIndex < validJokers.length) {
        const currentJoker = validJokers[jokerIndex]
        
        // 为当前小丑牌添加激活状态（边框变黄）
        const updatedJokers = page.data.jokerCards.map((joker: any) => ({
          ...joker,
          isActive: joker.id === currentJoker.id ? true : (joker.isActive || false)
        }))
        
        page.setData({ jokerCards: updatedJokers })
        
        // 应用小丑牌效果
        if (currentJoker.id === 'flag-joker') {
          const remainDiscard = page.data.remainDiscard || 0
          const flagBonus = remainDiscard * 30
          finalChip += flagBonus
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('旗帜触发：剩余弃牌次数 =', remainDiscard, '原筹码 =', currentChip, '新筹码 =', finalChip)
          
        } else if (currentJoker.id === 'half-joker') {
          finalMultiplier += 20
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('半张小丑触发：牌数 =', cards.length, '原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'photo-joker') {
          // 检查是否有第一张人头牌(K、Q、J)
          const firstFaceCard = cards.find((card: any) => 
            card.point === 'K' || card.point === 'Q' || card.point === 'J'
          )
          
          if (firstFaceCard) {
            finalMultiplier *= 2
            
            // 显示动画效果，实时更新筹码和倍率
            page.setData({
              currentChip: finalChip,
              currentMultiplier: finalMultiplier,
              scoreAnim: String(finalChip * finalMultiplier)
            })
            
            console.log('照片触发：第一张人头牌 =', firstFaceCard.point, '原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
          }
        } else if (currentJoker.id === 'joker-joker') {
          finalMultiplier += 4
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('小丑触发：原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'banana-joker') {
          finalMultiplier += 15
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('香蕉触发：原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'abstract-joker') {
          // 抽象小丑：使用预计算的倍率加成
          const abstractBonus = page.data.abstractJokerBonus || 0
          finalMultiplier += abstractBonus
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('抽象小丑触发：倍率加成 =', abstractBonus, '原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'cavendish-joker') {
          finalMultiplier = Math.round(finalMultiplier * 3)
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('卡文迪什触发：原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'baseball-card-joker') {
          const rareJokerCount = jokerCards.filter((j: any) => j.rarity === '稀有').length
          const multiplierBonus = Math.pow(1.5, rareJokerCount)
          finalMultiplier = Math.round(finalMultiplier * multiplierBonus)
          
          // 显示动画效果，实时更新筹码和倍率
          page.setData({
            currentChip: finalChip,
            currentMultiplier: finalMultiplier,
            scoreAnim: String(finalChip * finalMultiplier)
          })
          
          console.log('棒球卡触发：稀有小丑牌数量 =', rareJokerCount, '原倍率 =', cardTypeInfo.multiplier, '新倍率 =', finalMultiplier)
        } else if (currentJoker.id === 'blueprint-joker') {
          // 模仿者：复制一张小丑牌的能力
          const currentJokerIndex = jokerCards.findIndex((j: any) => j.id === currentJoker.id)
          const rightJoker = jokerCards[currentJokerIndex + 1]
          
          if (rightJoker) {
            // 根据一张小丑牌的类型应用效果
            if (rightJoker.id === 'flag-joker') {
              const remainDiscard = page.data.remainDiscard || 0
              const flagBonus = remainDiscard * 30
              finalChip += flagBonus
              console.log('模仿者复制旗帜：剩余弃牌次数 =', remainDiscard, '新筹码 =', finalChip)
            } else if (rightJoker.id === 'half-joker' && cards.length <= 3) {
              finalMultiplier += 20
              console.log('模仿者复制半张小丑：新倍率 =', finalMultiplier)
            } else if (rightJoker.id === 'photo-joker') {
              const firstFaceCard = cards.find((card: any) => 
                card.point === 'K' || card.point === 'Q' || card.point === 'J'
              )
              if (firstFaceCard) {
                finalMultiplier *= 2
                console.log('模仿者复制照片：新倍率 =', finalMultiplier)
              }
            } else if (rightJoker.id === 'unbroken-vote-joker') {
              console.log('模仿者复制未断选票：效果将在点数卡阶段处理')
            } else if (rightJoker.id === 'joker-joker') {
              finalMultiplier += 4
              console.log('模仿者复制小丑：新倍率 =', finalMultiplier)
            } else if (rightJoker.id === 'banana-joker') {
              finalMultiplier += 15
              console.log('模仿者复制香蕉：新倍率 =', finalMultiplier)
            } else if (rightJoker.id === 'abstract-joker') {
              const jokerCount = jokerCards.length
              const bonus = jokerCount * 3
              finalMultiplier += bonus
              console.log('模仿者复制抽象小丑：新倍率 =', finalMultiplier)
            } else if (rightJoker.id === 'cavendish-joker') {
              finalMultiplier = Math.round(finalMultiplier * 3)
              console.log('模仿者复制卡文迪什：新倍率 =', finalMultiplier)
            } else if (rightJoker.id === 'baseball-card-joker') {
              const rareJokerCount = jokerCards.filter((j: any) => j.rarity === '稀有').length
              const multiplierBonus = Math.pow(1.5, rareJokerCount)
              finalMultiplier = Math.round(finalMultiplier * multiplierBonus)
              console.log('模仿者复制棒球卡：新倍率 =', finalMultiplier)
            }
            
            // 显示动画效果，实时更新筹码和倍率
            page.setData({
              currentChip: finalChip,
              currentMultiplier: finalMultiplier,
              scoreAnim: String(finalChip * finalMultiplier)
            })
          }
        }
        
        // 延迟处理下一张小丑牌
        setTimeout(() => {
          jokerIndex++
          processNextJoker()
        }, 800) // 800ms延迟，比有效牌的500ms稍长
        
      } else {
        // 所有小丑牌效果处理完毕，计算最终分数
        ScoringManager._calculateFinalScore(page, finalChip, finalMultiplier)
      }
    }
    
    processNextJoker()
  }
  
  // 计算最终分数
  private static _calculateFinalScore(page: any, finalChip: number, finalMultiplier: number) {
    const finalScore = finalChip * finalMultiplier
        const newRoundScore = page.data.roundScore + finalScore

    // 显示最终分数动画
        page.setData({
          roundScore: newRoundScore,
          scoreAnim: String(finalScore)
        })

    // 延迟后进入下一阶段
    setTimeout(() => {
        if (newRoundScore >= page.data.scoreTarget) {
          page.roundWin()
        } else {
          page.startAutoDraw()
        }
      
      // 重置小丑牌激活状态
      const resetJokers = page.data.jokerCards.map((joker: any) => ({
        ...joker,
        isActive: false,
        colorState: undefined
      }))

        page.setData({
          scoreCards: [],
          cardType: '',
          cardGrade: 0,
          currentMultiplier: 0,
        currentChip: 0,
        jokerCards: resetJokers
        })
    }, 1000) // 1秒延迟，让玩家看到最终分数
  }

  // 预检查有效的点数卡
  private static _checkValidPointJokers(jokerCards: any[], validCards: any[]): any[] {
    const validPointJokers = []
    
    // 按小丑牌区顺序检查
    for (const joker of jokerCards) {
      if (joker.id === 'photo-joker') {
        // 检查是否存在有效的人头牌(K、Q、J)
        const hasFaceCard = validCards.some((card: any) => 
          card.point === 'K' || card.point === 'Q' || card.point === 'J'
        )
        if (hasFaceCard) {
          validPointJokers.push(joker)
        }
      } else if (joker.id === 'unbroken-vote-joker') {
        // 检查是否存在有效牌
        if (validCards.length > 0) {
          validPointJokers.push(joker)
        }
      } else if (joker.id === 'blueprint-joker') {
        // 模仿者：检查右一张小丑牌是否为点数卡
        const currentJokerIndex = jokerCards.findIndex((j: any) => j.id === joker.id)
        const rightJoker = jokerCards[currentJokerIndex + 1]
        
        if (rightJoker) {
          if (rightJoker.id === 'photo-joker') {
            // 检查是否存在有效的人头牌(K、Q、J)
            const hasFaceCard = validCards.some((card: any) => 
              card.point === 'K' || card.point === 'Q' || card.point === 'J'
            )
            if (hasFaceCard) {
              validPointJokers.push({ ...joker, isBlueprintCopy: true, copiedFrom: rightJoker })
            }
          } else if (rightJoker.id === 'unbroken-vote-joker') {
            // 检查是否存在有效牌
            if (validCards.length > 0) {
              validPointJokers.push({ ...joker, isBlueprintCopy: true, copiedFrom: rightJoker })
            }
          }
        }
      }
    }
    
    return validPointJokers
  }

  // 处理卡牌与点数卡效果
  private static _processCardWithPointJokers(page: any, cardIndex: number, currentCard: any, pointValue: number, validPointJokers: any[], currentChip: number, currentMultiplier: number, firstValidCardTriggered: boolean, callback: () => void) {
    let chip = currentChip
    let multiplier = currentMultiplier
    let isFirstValidCard = !firstValidCardTriggered
    
    // 检查是否需要多次触发（未断选票效果）
    let triggerCount = 1
    const hasUnbrokenVote = validPointJokers.some((joker: any) => 
      joker.id === 'unbroken-vote-joker' || 
      (joker.isBlueprintCopy && joker.copiedFrom?.id === 'unbroken-vote-joker')
    )
    if (hasUnbrokenVote && isFirstValidCard) {
      triggerCount = 3
    }
    
    let triggerIndex = 0
    
    const processTrigger = () => {
      if (triggerIndex < triggerCount) {
        // 基础筹码增加
        chip += pointValue
        
        // 更新卡牌状态（颜色变化：黄→橙→红→紫→深蓝→浅蓝→绿→粉→绿→粉...）
        const updatedScoreCards = [...page.data.scoreCards]
        let colorState: string
        if (triggerIndex < 4) {
          const colorStates = ['yellow', 'orange', 'red', 'purple']
          colorState = colorStates[triggerIndex]
        } else if (triggerIndex < 8) {
          const colorStates = ['deep-blue', 'light-blue', 'green', 'pink']
          colorState = colorStates[triggerIndex - 4]
        } else {
          // 第9次起：奇数次绿色，偶数次粉色
          colorState = (triggerIndex % 2 === 0) ? 'green' : 'pink'
        }
        
        updatedScoreCards[cardIndex] = {
          ...updatedScoreCards[cardIndex],
          isValid: true,
          colorState: colorState
        }
        
        // 应用点数卡效果（按小丑牌区顺序）
        for (let i = 0; i < validPointJokers.length; i++) {
          const joker = validPointJokers[i]
          
          if (joker.id === 'photo-joker') {
            // 照片：第一张人头牌倍率×2
            if (isFirstValidCard && (currentCard.point === 'K' || currentCard.point === 'Q' || currentCard.point === 'J')) {
              multiplier *= 2
              console.log('照片触发：第一张人头牌 =', currentCard.point, '新倍率 =', multiplier)
            }
          } else if (joker.isBlueprintCopy && joker.copiedFrom?.id === 'photo-joker') {
            // 模仿者复制照片：第一张人头牌倍率×2
            if (isFirstValidCard && (currentCard.point === 'K' || currentCard.point === 'Q' || currentCard.point === 'J')) {
              multiplier *= 2
              console.log('模仿者复制照片触发：第一张人头牌 =', currentCard.point, '新倍率 =', multiplier)
            }
          }
        }
        
        // 为所有有效点数卡添加激活状态（颜色变化）
        const updatedJokers = page.data.jokerCards.map((j: any) => {
          const isPointJoker = validPointJokers.some((pj: any) => pj.id === j.id)
          return {
            ...j,
            isActive: isPointJoker ? true : (j.isActive || false),
            colorState: isPointJoker ? colorState : (j.colorState || 'normal')
          }
        })
        
        // 更新小丑牌激活状态
        page.setData({ jokerCards: updatedJokers })

        // 更新界面
        page.setData({
          currentChip: chip,
          currentMultiplier: multiplier,
          scoreAnim: String(chip * multiplier),
          scoreCards: updatedScoreCards
        })
        
        triggerIndex++
        
        // 延迟处理下一次触发
        setTimeout(() => {
          processTrigger()
        }, 300)
      } else {
        // 所有触发完成，继续下一张牌
        // 更新全局的筹码和倍率状态
        page.setData({
          currentChip: chip,
          currentMultiplier: multiplier
        })
        
        setTimeout(() => {
          callback()
        }, 500)
      }
    }
    
    processTrigger()
  }
} 