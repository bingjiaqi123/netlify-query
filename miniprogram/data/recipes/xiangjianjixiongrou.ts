import { Recipe } from '../../utils/recipe-loader'

const xiangjianjixiongru: Recipe = {
    name: '香煎鸡胸肉',
    category: '主菜',
    subcategory: '禽肉类',
    tags: ['健身餐', '低脂高蛋白'],
    taste: '咸香微辣',
    ingredients: [
      { name: '鸡胸肉', amount: '300克', required: '300克' }
    ],
    seasonings: [
      { name: '生抽', amount: '2勺' },
      { name: '料酒', amount: '1勺' },
      { name: '蚝油', amount: '1勺' },
      { name: '黑胡椒', amount: '1勺' },
      { name: '盐', amount: '半勺' }
    ],
    steps: [
      '鸡胸肉横向片成1厘米厚片，用刀背拍松',
      '混合所有调料制成腌料，均匀涂抹在鸡肉表面',
      '密封冷藏腌制30分钟',
      '平底锅烧热后不放油，放入鸡胸肉中火煎3分钟',
      '翻面再煎2分钟，关火焖1分钟'
    ]
  }

export default xiangjianjixiongru 