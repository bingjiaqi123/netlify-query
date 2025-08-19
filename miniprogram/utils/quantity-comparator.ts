// miniprogram/utils/quantity-comparator.ts

// 量词转换表（转换为克为单位进行比较）
const unitConversion: Record<string, number> = {
  '克': 1,
  '千克': 1000,
  '斤': 500,
  '两': 50,
  '条': 500,  // 假设一条鱼约500克
  '只': 300,  // 假设一只鸡约300克
  '个': 100,  // 假设一个苹果约100克
  '罐': 400,  // 假设一罐约400克
  '瓶': 500,  // 假设一瓶约500克
  '包': 100,  // 假设一包约100克
  '袋': 200,  // 假设一袋约200克
  '盒': 150,  // 假设一盒约150克
  '碗': 200,  // 假设一碗约200克
  '杯': 250,  // 假设一杯约250克
  '勺': 15,   // 假设一勺约15克
  '小勺': 5,  // 假设一小勺约5克
  '大勺': 20, // 假设一大勺约20克
  '撮': 2,    // 假设一撮约2克
  '片': 10,   // 假设一片约10克
  '块': 50,   // 假设一块约50克
  '根': 30,   // 假设一根约30克
  '瓣': 5,    // 假设一瓣约5克
  '粒': 1,    // 假设一粒约1克
  '颗': 5,    // 假设一颗约5克
  '把': 20,   // 假设一把约20克
  '束': 30,   // 假设一束约30克
  '串': 100,  // 假设一串约100克
  '盘': 300,  // 假设一盘约300克
  '碟': 150,  // 假设一碟约150克
  '份': 200,  // 假设一份约200克
  '份量': 200 // 假设一份量约200克
}

// 解析数量和单位
function parseQuantity(quantityStr: string): { value: number; unit: string } {
  const match = quantityStr.match(/^(\d+(?:\.\d+)?)(.+)$/)
  if (!match) {
    return { value: 0, unit: '克' }
  }
  
  const value = parseFloat(match[1])
  const unit = match[2]
  
  return { value, unit }
}

// 比较两个数量字符串
export function compareQuantities(available: string, required: string): boolean {
  const availableParsed = parseQuantity(available)
  const requiredParsed = parseQuantity(required)
  
  // 如果单位相同，直接比较数值
  if (availableParsed.unit === requiredParsed.unit) {
    return availableParsed.value >= requiredParsed.value
  }
  
  // 转换为克进行比较
  const availableGrams = availableParsed.value * (unitConversion[availableParsed.unit] || 1)
  const requiredGrams = requiredParsed.value * (unitConversion[requiredParsed.unit] || 1)
  
  return availableGrams >= requiredGrams
}

// 获取比较结果描述
export function getComparisonDescription(available: string, required: string): string {
  const availableParsed = parseQuantity(available)
  const requiredParsed = parseQuantity(required)
  
  if (availableParsed.unit === requiredParsed.unit) {
    if (availableParsed.value > requiredParsed.value) {
      return `${available} > ${required}`
    } else if (availableParsed.value === requiredParsed.value) {
      return `${available} = ${required}`
    } else {
      return `${available} < ${required}`
    }
  }
  
  // 转换为克进行比较
  const availableGrams = availableParsed.value * (unitConversion[availableParsed.unit] || 1)
  const requiredGrams = requiredParsed.value * (unitConversion[requiredParsed.unit] || 1)
  
  if (availableGrams > requiredGrams) {
    return `${available} > ${required}`
  } else if (availableGrams === requiredGrams) {
    return `${available} = ${required}`
  } else {
    return `${available} < ${required}`
  }
} 