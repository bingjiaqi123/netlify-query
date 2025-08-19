export interface TaskGroup {
  id: string;
  name: string;
  description: string;
}

export const taskGroups: TaskGroup[] = [
  // 数字组 (0-9)
  { id: '0', name: '清零整理', description: '整理、归类' },
  { id: '1', name: '专注', description: '集中注意力' },
  { id: '2', name: '双人', description: '必须双人' },
  { id: '3', name: '三餐', description: '饮食' },
  { id: '4', name: '四季', description: '季节' },
  { id: '5', name: '五官', description: '美容护理' },
  { id: '6', name: '六六大顺', description: '祈福易数' },
  { id: '7', name: '七步成诗', description: '诗词对联' },
  { id: '8', name: '八股', description: '公文撰写' },
  { id: '9', name: '一言九鼎', description: '决策' },

  // 大写字母组 (A-Z)
  { id: 'A', name: 'Art', description: '绘画、建模' },
  { id: 'B', name: 'Ban', description: '不做某事' },
  { id: 'C', name: 'Cook', description: '烹饪' },
  { id: 'D', name: 'Data', description: '数据' },
  { id: 'E', name: 'English', description: '英语' },
  { id: 'F', name: 'Flie', description: '处理文件、归档' },
  { id: 'G', name: 'Game', description: '游戏' },
  { id: 'H', name: 'Hand', description: '手工' },
  { id: 'I', name: 'Investigate', description: '调查、研究' },
  { id: 'J', name: 'Journalism', description: '新闻传播' },
  { id: 'K', name: 'Keeper', description: '照顾、饲养' },
  { id: 'L', name: 'Listen', description: '播客、听写' },
  { id: 'M', name: 'Music', description: '音乐、乐器' },
  { id: 'N', name: 'Note', description: '笔记整理' },
  { id: 'O', name: 'Olympic', description: '锻炼' },
  { id: 'P', name: 'Python', description: '改代码' },
  { id: 'Q', name: 'Question', description: '提问、答疑' },
  { id: 'R', name: 'Read', description: '阅读' },
  { id: 'S', name: 'Speech', description: '口才' },
  { id: 'T', name: 'Travel', description: '旅行' },
  { id: 'U', name: 'Up主', description: '发视频帖子' },
  { id: 'V', name: 'Verify', description: '检查、审核' },
  { id: 'W', name: 'Write', description: '练字、速记' },
  { id: 'X', name: 'eXchange', description: '交流沟通' },
  { id: 'Y', name: 'Youtube', description: '视频' },
  { id: 'Z', name: 'Zipper', description: '剪辑' },

  // 小写字母组 (a-z)
  { id: 'a', name: 'analyse', description: '分析、拆解' },
  { id: 'b', name: 'break', description: '休息' },
  { id: 'c', name: 'celebrate', description: '节日、庆典' },
  { id: 'd', name: 'dance', description: '舞蹈、武术' },
  { id: 'e', name: 'essay', description: '写作' },
  { id: 'f', name: 'fun', description: '娱乐' },
  { id: 'g', name: 'guide', description: '教授、教学' },
  { id: 'h', name: 'household', description: '家务' },
  { id: 'i', name: 'idea', description: '创意' },
  { id: 'j', name: 'jounal', description: '日记、复盘' },
  { id: 'k', name: 'kiss', description: '婚恋' },
  { id: 'l', name: 'lesson', description: '课程' },
  { id: 'm', name: 'manage', description: '管理' },
  { id: 'n', name: 'nature', description: '亲近自然' },
  { id: 'o', name: 'offical', description: '事务' },
  { id: 'p', name: 'plan', description: '计划' },
  { id: 'q', name: 'quiz', description: '测试' },
  { id: 'r', name: 'recite', description: '背诵、记忆' },
  { id: 's', name: 'shop', description: '购物' },
  { id: 't', name: 'translate', description: '翻译' },
  { id: 'u', name: 'update', description: '改稿、修改' },
  { id: 'v', name: 'volunteer', description: '做志愿' },
  { id: 'w', name: 'win', description: '比赛、竞赛' },
  { id: 'x', name: 'explore', description: '探索、尝新' },
  { id: 'y', name: '默认', description: '未分类的杂项任务' },
  { id: 'z', name: 'zzz', description: '睡眠、冥想' }
];

export class TaskGroupManager {
  private groups: TaskGroup[];

  constructor() {
    this.groups = [...taskGroups];
  }

  // 获取所有组
  getAllGroups(): TaskGroup[] {
    return this.groups;
  }

  // 根据ID获取组
  getGroupById(groupId: string): TaskGroup | undefined {
    return this.groups.find(group => group.id === groupId);
  }

  // 搜索组名
  searchByName(name: string): TaskGroup[] {
    return this.groups.filter(group => 
      group.name.toLowerCase().includes(name.toLowerCase()) ||
      group.description.toLowerCase().includes(name.toLowerCase())
    );
  }
} 