import { Recipe } from '../../utils/recipe-loader'

const yirenlvdulaoyatang: Recipe = {
  name: '薏仁绿豆老鸭汤',
  category: '汤',
  subcategory: '药膳汤',
  tags: ['夏季养生', '祛湿'],
  taste: '清香甘甜',
  ingredients: [
    { name: '薏仁', amount: '50克', required: '50克' },
    { name: '绿豆', amount: '50克', required: '50克' },
    { name: '老鸭', amount: '1只', required: '1只' },
    { name: '陈皮', amount: '5克', required: '5克' }
  ],
  seasonings: [
    { name: '盐', amount: '2勺' }
  ],
  steps: [
    '薏仁和绿豆提前浸泡2小时',
    '老鸭洗净斩块，焯水去血沫',
    '锅中加清水2000毫升，放入鸭块、薏仁、绿豆和陈皮',
    '大火煮沸后转小火慢炖2小时',
    '最后加盐调味即可'
  ]
}
export default yirenlvdulaoyatang 