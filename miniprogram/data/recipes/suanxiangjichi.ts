import { Recipe } from '../../utils/recipe-loader'

const suanxiangjichi: Recipe = {
    name: '蒜香鸡翅',
    category: '主菜',
    subcategory: '禽肉类',
    tags: ['下酒菜', '蒜香风味'],
    taste: '蒜香浓郁，微辣鲜香',
    ingredients: [
      { name: '鸡中翅', amount: '8个', required: '8个' },
      { name: '蒜末', amount: '50克', required: '50克' },
      { name: '小米椒', amount: '3根', required: '3根' },
      { name: '杭椒', amount: '2根', required: '2根' }
    ],
    seasonings: [
      { name: '淀粉', amount: '2勺' },
      { name: '黑胡椒', amount: '1勺' },
      { name: '食用油', amount: '4勺' },
      { name: '生抽', amount: '2勺' },
      { name: '蚝油', amount: '1勺' },
      { name: '料酒', amount: '1勺' },
      { name: '醋', amount: '半勺' },
      { name: '盐', amount: '半勺' }
    ],
    steps: [
      '鸡翅洗净擦干，两面划刀，加料酒、生抽1勺、蚝油、黑胡椒、淀粉抓匀腌制20分钟',
      '小米椒和杭椒切圈，蒜末分两次使用（30克腌料+20克爆香）',
      '热锅加3勺油，鸡翅皮面朝下中小火煎5分钟至金黄，翻面再煎3分钟盛出',
      '补1勺油，爆香剩余蒜末至微黄，加辣椒圈炒香',
      '放回鸡翅，沿锅边淋入剩余1勺生抽和半勺醋',
      '加盐快速翻炒均匀出锅'
    ]
  }

export default suanxiangjichi 