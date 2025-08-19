// pages/cooking/cooking.ts

import { getAllRecipes } from '../../utils/recipe-loader'
import { compareQuantities } from '../../utils/quantity-comparator'
import { IngredientManager } from '../../utils/ingredient-manager'

Page({
  data: {
    currentRecipe: null as any,
    canCook: false,
    availableRecipes: [] as any[],
    currentRecipeIndex: 0,
    recipes: [] as any[],
    // 筛选设置
    noShuichan: false,
    noSpicy: false
  },

  onLoad() {
    this.initRecipesFromFiles()
    this.checkAvailableRecipes()
    this.showRandomRecipe()
  },

  // 从文件加载食谱
  initRecipesFromFiles() {
    try {
      const recipes = getAllRecipes()
      this.setData({ recipes })
    } catch (error) {
      console.error('加载食谱失败:', error)
      this.setData({ recipes: [] })
    }
  },

  // 检查可用的食谱
  checkAvailableRecipes() {
    const { recipes, noShuichan, noSpicy } = this.data
    const availableRecipes: any[] = []

    // 获取仓库中的原料
    const warehouseIngredients = this.getWarehouseIngredients()

    recipes.forEach((recipe: any) => {
      // 检查是否不吃水产
      if (noShuichan) {
        const hasShuichan = IngredientManager.hasShuichan(recipe.ingredients)
        if (hasShuichan) {
          return // 跳过这道菜
        }
      }

      // 检查是否不吃辣
      if (noSpicy) {
        if (recipe.taste.includes('辣')) {
          return // 跳过这道菜
        }
      }

      let canMake = true
      const ingredientsWithAvailability: any[] = []

      recipe.ingredients.forEach((ingredient: any) => {
        const warehouseItem = warehouseIngredients.find(item => 
          item.name === ingredient.name
        )
        
        let available = false
        
        if (warehouseItem) {
          available = compareQuantities(warehouseItem.amount, ingredient.required)
        }
        
        ingredientsWithAvailability.push({
          ...ingredient,
          available
        })

        if (!available) {
          canMake = false
        }
      })

      if (canMake) {
        availableRecipes.push({
          ...recipe,
          ingredients: ingredientsWithAvailability
        })
      }
    })

    this.setData({ availableRecipes })
  },

  // 获取仓库中的原料
  getWarehouseIngredients() {
    // 测试数据 - 与仓库页面保持一致
    return [
      { name: '鲜番茄', amount: '250克' },
      { name: '豆腐', amount: '100克' },
      { name: '青蒜', amount: '100克' },
      { name: '鱼丸', amount: '100克' },
      { name: '鲢鱼头', amount: '300克' },
      { name: '青菜心', amount: '250克' },
      { name: '水发香菇', amount: '300克' },
      { name: '鲤鱼', amount: '1条' },
      { name: '泡番茄', amount: '2罐' },
      { name: '黄豆芽', amount: '100克' },
      { name: '水发黑木耳', amount: '100克' },
      { name: '薏仁', amount: '100克' },
      { name: '绿豆', amount: '100克' },
      { name: '老鸭', amount: '1只' }
    ]
  },

  // 显示随机食谱
  showRandomRecipe() {
    const { availableRecipes } = this.data
    
    if (availableRecipes.length === 0) {
      this.setData({ 
        currentRecipe: null,
        canCook: false 
      })
      return
    }

    // 随机选择一个可用食谱
    const randomIndex = Math.floor(Math.random() * availableRecipes.length)
    const selectedRecipe = availableRecipes[randomIndex]

    this.setData({
      currentRecipe: selectedRecipe,
      canCook: true,
      currentRecipeIndex: randomIndex
    })
  },

  // 显示下一个食谱
  nextRecipe() {
    const { availableRecipes, currentRecipeIndex } = this.data
    
    if (availableRecipes.length === 0) {
      this.showRandomRecipe()
      return
    }

    // 循环显示下一个食谱
    const nextIndex = (currentRecipeIndex + 1) % availableRecipes.length
    const nextRecipe = availableRecipes[nextIndex]

    this.setData({
      currentRecipe: nextRecipe,
      canCook: true,
      currentRecipeIndex: nextIndex
    })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 显示食谱大全
  showRecipeBook() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 显示口味筛选
  showTasteFilter() {
    const { noShuichan, noSpicy } = this.data
    
    wx.showActionSheet({
      itemList: [
        `不吃水产 ${noShuichan ? '✓' : ''}`,
        `不吃辣 ${noSpicy ? '✓' : ''}`
      ],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 切换不吃水产
          this.setData({ noShuichan: !noShuichan })
        } else if (res.tapIndex === 1) {
          // 切换不吃辣
          this.setData({ noSpicy: !noSpicy })
        }
        
        // 重新检查可用食谱
        this.checkAvailableRecipes()
        this.showRandomRecipe()
      }
    })
  },

  // 开始烹饪
  startCooking() {
    const { currentRecipe } = this.data
    
    if (!currentRecipe || !this.data.canCook) {
      return
    }

    wx.showModal({
      title: '开始烹饪',
      content: `确定要开始制作"${currentRecipe.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          // 这里可以添加消耗原料的逻辑
          wx.showToast({
            title: '烹饪完成！',
            icon: 'success'
          })
          
          // 显示下一个食谱
          setTimeout(() => {
            this.nextRecipe()
          }, 1500)
        }
      }
    })
  }
}) 