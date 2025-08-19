import { Recipe } from '../../utils/recipe-loader'

const fanqieyuwandoufutang: Recipe = {
  name: '番茄鱼丸豆腐汤',
  category: '汤',
  subcategory: '家常汤',
  tags: ['快手菜'],
  taste: '酸甜鲜美',
  ingredients: [
    { name: '鲜番茄', amount: '2个', required: '2个' },
    { name: '嫩豆腐', amount: '200克', required: '200克' },
    { name: '鱼丸', amount: '150克', required: '150克' },
    { name: '青菜心', amount: '100克', required: '100克' }
  ],
  seasonings: [
    { name: '葱花', amount: '10克' },
    { name: '姜丝', amount: '5克' },
    { name: '花椒粉', amount: '1勺' },
    { name: '鸡精', amount: '1勺' },
    { name: '盐', amount: '2勺' },
    { name: '植物油', amount: '2勺' }
  ],
  steps: [
    '番茄去皮切块，豆腐切2厘米方块',
    '热锅加植物油，爆香姜丝后下番茄炒至出沙',
    '加清水800毫升，放入鱼丸煮至浮起',
    '加入豆腐块煮3分钟',
    '放入青菜心煮1分钟',
    '最后加盐、鸡精、花椒粉调味，撒葱花出锅'
  ]
}

export default fanqieyuwandoufutang 