import { Recipe } from '../../utils/recipe-loader'

const qingtangyuwan: Recipe = {
  name: '清汤鱼丸',
  category: '汤',
  subcategory: '水产汤',
  tags: ['清淡'],
  taste: '鲜香清爽',
  ingredients: [
    { name: '鱼丸', amount: '200克', required: '200克' },
    { name: '火腿', amount: '30克', required: '30克' },
    { name: '青菜心', amount: '50克', required: '50克' },
    { name: '香菇', amount: '4朵', required: '4朵' },
    { name: '猪大油', amount: '10克', required: '10克' }
  ],
  seasonings: [
    { name: '葱姜水', amount: '2勺' },
    { name: '盐', amount: '1勺' },
    { name: '味精', amount: '半勺' },
    { name: '料酒', amount: '1勺' },
    { name: '醋', amount: '半勺' },
    { name: '胡椒粉', amount: '半勺' },
    { name: '香油', amount: '1勺' }
  ],
  steps: [
    '火腿切薄片，香菇去蒂切片，青菜心洗净对半切开',
    '锅中加清水烧开，放入鱼丸小火煮至浮起',
    '加入火腿片、香菇片和猪大油，煮出香味',
    '调入葱姜水、料酒、盐、胡椒粉，保持汤面微沸',
    '最后放入青菜心烫熟，淋醋和香油，加味精调味即可'
  ]
}

export default qingtangyuwan 