// mechanics/dice.ts
// 骰子机制

// 骰子图片映射
export const diceImages = {
  0: '../../images/dice0.png',
  1: '../../images/dice1.png',
  2: '../../images/dice2.png',
  3: '../../images/dice3.png',
  4: '../../images/dice4.png',
  5: '../../images/dice5.png',
  6: '../../images/dice6.png'
}

// 投掷单个骰子
export function rollSingleDice(): {
  value: number
  image: string
} {
  const value = Math.floor(Math.random() * 6) + 1
  return {
    value,
    image: diceImages[value as keyof typeof diceImages] || diceImages[0]
  }
}

// 生成骰子动画序列
export function generateDiceSequence(): {
  sequence: number[]
  finalValue: number
} {
  const numbers = [1, 2, 3, 4, 5, 6]
  const sequence = []
  
  // 随机选择5个数字作为动画序列
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length)
    sequence.push(numbers[randomIndex])
  }
  
  // 最后一个数字是最终结果
  const finalValue = Math.floor(Math.random() * 6) + 1
  sequence.push(finalValue)
  
  return {
    sequence,
    finalValue
  }
}

// 获取骰子图片
export function getDiceImage(value: number): string {
  return diceImages[value as keyof typeof diceImages] || diceImages[0]
} 