import { Recipe } from "../../utils/recipe-loader"

const hongshaorou: Recipe = {
    name: '红烧肉',
    category: '主菜',
    subcategory: '本帮菜',
    tags: ['经典菜','宴客菜'],
    taste: '咸甜酥糯',
    ingredients: [
      { name: '带皮五花肉', amount: '500克', required: '500克' }
    ],
    seasonings: [
      { name: '冰糖', amount: '30克' },
      { name: '生抽', amount: '3勺' },
      { name: '老抽', amount: '1勺' },
      { name: '葱段', amount: '20克' },
      { name: '姜片', amount: '10克' },
      { name: '蒜瓣', amount: '5瓣' },
      { name: '料酒', amount: '2勺' },
      { name: '香叶', amount: '2片' },
      { name: '桂皮', amount: '1块' },
      { name: '八角', amount: '2颗' },
      { name: '蚝油', amount: '1勺' }
    ],
    steps: [
      '五花肉切3厘米见方块，冷水下锅焯烫3分钟捞出',
      '冷锅冷油放冰糖，小火炒至琥珀色（约160℃）',
      '立即倒入肉块翻炒上糖色，加葱姜蒜爆香',
      '沿锅边淋入料酒，加生抽、老抽、蚝油翻炒均匀',
      '加开水没过肉面2厘米，放入香叶、桂皮、八角',
      '大火煮沸转小火焖40分钟',
      '开盖转大火收汁至浓稠'
    ]
  }

export default hongshaorou 