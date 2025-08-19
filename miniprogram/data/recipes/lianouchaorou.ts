import { Recipe } from "../../utils/recipe-loader"

const lianouchaorou: Recipe = {
    name: '莲藕炒肉',
    category: '热菜',
    subcategory: '家常小炒',
    tags: ['下饭菜','快手菜'],
    taste: '咸鲜脆嫩',
    ingredients: [
      { name: '五花肉', amount: '200克', required: '200克' },
      { name: '莲藕', amount: '300克', required: '300克' },
      { name: '蒜苗', amount: '50克', required: '50克' },
      { name: '青椒', amount: '1个', required: '1个' }
    ],
    seasonings: [
      { name: '蒜片', amount: '3瓣' },
      { name: '小米辣', amount: '2根' },
      { name: '盐', amount: '1勺' },
      { name: '白醋', amount: '1勺' },
      { name: '生抽', amount: '2勺' },
      { name: '老抽', amount: '半勺' },
      { name: '食用油', amount: '2勺' }
    ],
    steps: [
      '五花肉切3毫米薄片，莲藕去皮切5毫米薄片泡水加1勺白醋防氧化',
      '青椒切菱形片，蒜苗切3厘米段，小米辣斜刀切段',
      '热锅加1勺油煸炒五花肉至出油，加半勺老抽上色盛出',
      '补1勺油爆香蒜片和小米辣，下莲藕片大火翻炒2分钟',
      '加生抽、盐和1勺清水翻炒均匀',
      '放回肉片和青椒翻炒30秒',
      '最后加蒜苗翻炒10秒出锅'
    ]
  }

export default lianouchaorou