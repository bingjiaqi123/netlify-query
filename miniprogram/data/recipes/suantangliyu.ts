import { Recipe } from '../../utils/recipe-loader'

const suantangliyu: Recipe = {  
  name: '酸汤鲤鱼',  
  category: '汤锅',  
  subcategory: '酸汤类',  
  tags: ['贵州风味', '开胃菜'],  
  taste: '酸鲜微辣',  
  ingredients: [  
    { name: '鲤鱼', amount: '1条', required: '1条' },  
    { name: '泡番茄', amount: '100克', required: '100克' },  
    { name: '鲜番茄', amount: '1个', required: '1个' },  
    { name: '黄豆芽', amount: '150克', required: '150克' },  
    { name: '水发黑木耳', amount: '50克', required: '50克' }  
  ],  
  seasonings: [  
    { name: '盐', amount: '2勺' },  
    { name: '味精', amount: '1勺' },  
    { name: '白糖', amount: '1勺' },  
    { name: '醋', amount: '3勺' },  
    { name: '花生油', amount: '3勺' },  
    { name: '胡椒粉', amount: '1勺' },  
    { name: '葱', amount: '1根' },  
    { name: '姜', amount: '5片' },  
    { name: '香菜段', amount: '20克' }  
  ],  
  steps: [  
    '鲤鱼去鳞去内脏，两面改花刀，用1勺盐和姜片腌制10分钟',  
    '泡番茄切碎，鲜番茄切块，黑木耳撕小朵',  
    '热锅加花生油，爆香葱段和姜片，放入泡番茄炒出红油',  
    '加清水800毫升，放入鲤鱼、黄豆芽、黑木耳大火煮沸',  
    '加入鲜番茄块，调入剩余盐、白糖、醋，转中火炖8分钟',  
    '最后撒胡椒粉、味精，出锅前放入香菜段'  
  ]  
}  

export default suantangliyu 