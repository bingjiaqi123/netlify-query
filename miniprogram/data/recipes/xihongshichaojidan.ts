import { Recipe } from '../../utils/recipe-loader'


const xihongshichaojidan: Recipe = {
    name: '西红柿炒鸡蛋',
    category: '家常菜',
    subcategory: '蛋类',
    tags: ['下饭菜', '快手菜'],
    taste: '酸甜咸鲜',
    ingredients: [
        { name: '鲜番茄', amount: '3个', required: '3个' },
        { name: '鸡蛋', amount: '4个', required: '4个' }
    ],
    seasonings: [
        { name: '番茄酱', amount: '1勺' },
        { name: '蒜末', amount: '2瓣' },
        { name: '葱花', amount: '10克' },
        { name: '盐', amount: '1勺' },
        { name: '食用油', amount: '3勺' },
        { name: '生抽', amount: '半勺' },
        { name: '白糖', amount: '半勺' }
    ],
    steps: [
        '番茄切滚刀块，鸡蛋加半勺盐打散至起泡',
        '热锅加2勺油，倒入蛋液炒至凝固蓬松，盛出备用',
        '补1勺油爆香蒜末，下番茄中火炒至出汁',
        '加番茄酱、白糖、生抽和剩余半勺盐调味',
        '倒入炒好的鸡蛋翻炒均匀',
        '出锅前撒葱花装盘'
    ]
    }

export default xihongshichaojidan
