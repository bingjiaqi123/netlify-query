import { Recipe } from "../../utils/recipe-loader"

const tangcuguobaorou: Recipe = {
    name: '糖醋锅包肉',
    category: '主菜',
    subcategory: '东北菜',
    tags: ['经典菜','酸甜口'],
    taste: '外酥里嫩，酸甜适口',
    ingredients: [
      { name: '猪里脊', amount: '300克', required: '300克' },
      { name: '胡萝卜', amount: '50克', required: '50克' },
      { name: '姜丝', amount: '10克', required: '10克' },
      { name: '葱丝', amount: '10克', required: '10克' },
      { name: '香菜段', amount: '10克', required: '10克' }
    ],
    seasonings: [
      { name: '土豆淀粉', amount: '100克' },
      { name: '盐', amount: '1勺' },
      { name: '白糖', amount: '50克' },
      { name: '白醋', amount: '30毫升' },
      { name: '生抽', amount: '1勺' },
      { name: '蚝油', amount: '1勺' },
      { name: '食用油', amount: '50毫升' }
    ],
    steps: [
      '里脊肉切5毫米厚片，用刀背拍松，加盐和生抽腌制10分钟',
      '土豆淀粉加100毫升水调成稠糊，静置10分钟后倒掉表层清水',
      '肉片裹上淀粉糊，六成油温（180℃）炸至定型捞出',
      '升高油温至200℃复炸30秒至金黄酥脆',
      '锅中留底油10毫升，炒香姜丝和胡萝卜丝',
      '加白糖、白醋、蚝油和30毫升清水熬至粘稠',
      '倒入炸好的肉片快速翻炒裹汁',
      '最后加葱丝和香菜段翻匀出锅'
    ]
  }

export default tangcuguobaorou 