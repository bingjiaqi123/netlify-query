import { Recipe } from '../../utils/recipe-loader'

const lianyutoudoudou: Recipe = {  
  name: '鲢鱼头炖豆腐',  
  category: '汤',
  subcategory: '水产汤',
  tags: ['家常菜'],
  taste: '少辣', 
  ingredients: [  
    { name: '鲢鱼头', amount: '1个', required: '1个' },  
    { name: '豆腐', amount: '300克', required: '300克' },  
    { name: '水发香菇', amount: '5朵', required: '5朵' },  
    { name: '青蒜', amount: '2根', required: '2根' }  
  ],  
  seasonings: [  
    { name: '黄酒', amount: '2勺' },  
    { name: '红醋', amount: '1勺' },  
    { name: '香油', amount: '1勺' },  
    { name: '葱', amount: '1根' },  
    { name: '生姜', amount: '3片' },  
    { name: '蒜', amount: '3瓣' },  
    { name: '豆瓣辣酱', amount: '1勺' },  
    { name: '白糖', amount: '1小勺' },  
    { name: '植物油', amount: '2勺' },  
    { name: '盐', amount: '1勺' },  
    { name: '味精', amount: '半勺' }  
  ],  
  steps: [  
    '鲢鱼头洗净，对半切开，用黄酒和少许盐腌制10分钟',  
    '豆腐切块，香菇切片，青蒜切段、葱切段、蒜拍碎、姜切片备用',  
    '热锅倒油，放入鱼头煎至两面金黄，盛出备用',  
    '锅中留底油，爆香葱、姜、蒜和豆瓣辣酱',  
    '加入适量清水，放入鱼头、豆腐、香菇，大火烧开',  
    '调入黄酒、红醋、白糖，转中小火炖煮15分钟',  
    '最后加入青蒜，淋上香油，加盐和味精调味即可'  
  ]  
}  
    
export default lianyutoudoudou 