// utils/recipe-loader.ts

export interface RecipeIngredient {
  name: string
  amount: string
  required: string
}

export interface RecipeSeasoning {
  name: string
  amount: string
}

export interface Recipe {
  name: string
  category: string  // 一级分类：汤、粥
  subcategory: string  // 二级分类：蔬菌汤、肉蛋汤、水产汤、药膳汤、蔬豆粥、肉粥、水产粥、药膳粥
  tags: string[]
  taste: string
  ingredients: RecipeIngredient[]
  seasonings: RecipeSeasoning[]
  steps: string[]
}

// 导入所有食谱
import lianyutoudoudou from '../data/recipes/lianyutoudoudou'
import fanqieyuwandoufutang from '../data/recipes/fanqieyuwandoufutang'
import qingtangyuwan from '../data/recipes/qingtangyuwan'
import suantangliyu from '../data/recipes/suantangliyu'
import yirenlvdulaoyatang from '../data/recipes/yirenlvdulaoyatang'

// 获取所有食谱
export function getAllRecipes(): Recipe[] {
  return [
    lianyutoudoudou,
    fanqieyuwandoufutang,
    qingtangyuwan,
    suantangliyu,
    yirenlvdulaoyatang
  ]
} 