// utils/ingredient-manager.ts

import hanliangFoods from '../data/ingredients/hanliang'
import wenreFoods from '../data/ingredients/wenre'
import pingxingFoods from '../data/ingredients/pingxing'
import shuichanFoods from '../data/ingredients/shuichan'

// 原料属性管理器
export class IngredientManager {
  // 检查是否为寒凉食物
  static isHanliang(ingredientName: string): boolean {
    return hanliangFoods.includes(ingredientName)
  }

  // 检查是否为温热食物
  static isWenre(ingredientName: string): boolean {
    return wenreFoods.includes(ingredientName)
  }

  // 检查是否为平性食物
  static isPingxing(ingredientName: string): boolean {
    return pingxingFoods.includes(ingredientName)
  }

  // 检查是否为水产食物
  static isShuichan(ingredientName: string): boolean {
    return shuichanFoods.includes(ingredientName)
  }

  // 获取食物的属性
  static getIngredientProperty(ingredientName: string): string {
    if (this.isHanliang(ingredientName)) {
      return '寒凉'
    } else if (this.isWenre(ingredientName)) {
      return '温热'
    } else if (this.isPingxing(ingredientName)) {
      return '平性'
    } else {
      return '未知'
    }
  }

  // 检查食谱是否包含水产
  static hasShuichan(ingredients: any[]): boolean {
    return ingredients.some(ingredient => this.isShuichan(ingredient.name))
  }

  // 检查食谱是否包含寒凉食物
  static hasHanliang(ingredients: any[]): boolean {
    return ingredients.some(ingredient => this.isHanliang(ingredient.name))
  }

  // 检查食谱是否包含温热食物
  static hasWenre(ingredients: any[]): boolean {
    return ingredients.some(ingredient => this.isWenre(ingredient.name))
  }

  // 检查食谱是否包含平性食物
  static hasPingxing(ingredients: any[]): boolean {
    return ingredients.some(ingredient => this.isPingxing(ingredient.name))
  }
}

export default IngredientManager 