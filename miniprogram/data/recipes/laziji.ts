import { Recipe } from '../../utils/recipe-loader'

const laziji: Recipe = {
    name: '辣子鸡',
    category: '主菜',
    subcategory: '川菜',
    tags: ['麻辣', '下酒菜'],
    taste: '麻辣鲜香',
    ingredients: [
      { name: '鸡腿肉', amount: '500克', required: '500克' },
      { name: '干辣椒', amount: '50克', required: '50克' },
      { name: '花椒', amount: '10克', required: '10克' }
    ],
    seasonings: [
      { name: '葱段', amount: '20克' },
      { name: '姜片', amount: '10克' },
      { name: '蒜瓣', amount: '8瓣' },
      { name: '生抽', amount: '2勺' },
      { name: '老抽', amount: '半勺' },
      { name: '料酒', amount: '2勺' },
      { name: '蚝油', amount: '1勺' },
      { name: '盐', amount: '1勺' },
      { name: '淀粉', amount: '2勺' },
      { name: '食用油', amount: '50毫升' }
    ],
    steps: [
      '鸡腿肉去骨切2厘米见方块，加1勺料酒、1勺生抽、半勺盐、2勺淀粉抓匀腌制20分钟',
      '干辣椒剪成1厘米段，蒜瓣拍扁，葱切3厘米段',
      '油温六成热（180℃）下鸡块炸至金黄捞出，升高油温至200℃复炸30秒',
      '留底油30毫升，爆香花椒、干辣椒段，放入姜蒜炒香',
      '倒入鸡块，加剩余调料大火翻炒1分钟',
      '最后撒葱段翻匀出锅'
    ]
  }

  export default laziji 