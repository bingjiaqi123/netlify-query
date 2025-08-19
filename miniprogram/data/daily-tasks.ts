export interface DailyTask {
  id: string;
  name: string;
  coin: number; // 铜币奖励
  diamond: number; // 钻石奖励
}

export const dailyTasks: DailyTask[] = [
  { id: '00', name: '洗碗', coin: 100, diamond: 0 },
  { id: '01', name: '扫地', coin: 200, diamond: 0 },
  { id: '02', name: '拖地', coin: 300, diamond: 0 },
  { id: '03', name: '吃蔬菜干', coin: 0, diamond: 10 },
  { id: '04', name: '吃水果', coin: 0, diamond: 10 },
  { id: '05', name: '卷腹', coin: 100, diamond: 20 },
  { id: '06', name: '跑圈', coin: 0, diamond: 20 },
  { id: '07', name: '吊环', coin: 100, diamond: 30 },
  { id: '08', name: '看精品书', coin: 300, diamond: 30 },
  { id: '09', name: '看垃圾书', coin: 500, diamond: 0 },
  { id: '0a', name: '学本地课程', coin: 300, diamond: 30 },
  { id: '0b', name: '学网盘课程', coin: 300, diamond: 30 },
  { id: '0c', name: '学已购课程', coin: 200, diamond: 40 },
  { id: '0d', name: '用护眼仪', coin: 0, diamond: 10 },
  { id: '0e', name: '剪视频', coin: 600, diamond: 10 },
  { id: '0f', name: '整理床铺', coin: 100, diamond: 10 },
  { id: '0g', name: '整理桌面', coin: 200, diamond: 10 },
  { id: '0h', name: '整理屋子', coin: 400, diamond: 20 },
  { id: '0i', name: '整理笔记', coin: 400, diamond: 0 },
  { id: '0j', name: '整理食谱', coin: 300, diamond: 10 },
  { id: '0k', name: '背单词', coin: 500, diamond: 20 },
  { id: '0l', name: '练听写', coin: 400, diamond: 40 },
  { id: '0m', name: '洗澡', coin: 300, diamond: 10 },
  { id: '0n', name: '洗头', coin: 300, diamond: 10 },
  { id: '0o', name: '刷牙', coin: 50, diamond: 5 },
  { id: '0p', name: '洗脸', coin: 50, diamond: 5 },
  { id: '0q', name: '梳头', coin: 30, diamond: 3 },
  { id: '0r', name: '涂护肤品', coin: 100, diamond: 15 },
  { id: '0s', name: '喝水', coin: 20, diamond: 2 },
  { id: '0t', name: '吃早餐', coin: 150, diamond: 15 },
  { id: '0u', name: '吃午餐', coin: 150, diamond: 15 },
  { id: '0v', name: '吃晚餐', coin: 150, diamond: 15 },
  { id: '0w', name: '做运动', coin: 200, diamond: 25 },
  { id: '0x', name: '拉伸', coin: 80, diamond: 8 },
  { id: '0y', name: '冥想', coin: 120, diamond: 12 },
  { id: '0z', name: '听音乐', coin: 60, diamond: 6 },
  { id: '0A', name: '看新闻', coin: 100, diamond: 10 },
  { id: '0B', name: '看视频', coin: 80, diamond: 8 },
  { id: '0C', name: '玩游戏', coin: 50, diamond: 5 },
  { id: '0D', name: '聊天', coin: 40, diamond: 4 },
  { id: '0E', name: '打电话', coin: 60, diamond: 6 },
  { id: '0F', name: '发消息', coin: 30, diamond: 3 },
  { id: '0G', name: '购物', coin: 200, diamond: 20 },
  { id: '0H', name: '理财', coin: 300, diamond: 30 },
  { id: '0I', name: '记账', coin: 100, diamond: 10 },
  { id: '0J', name: '计划', coin: 150, diamond: 15 },
  { id: '0K', name: '总结', coin: 200, diamond: 20 },
  { id: '0L', name: '反思', coin: 120, diamond: 12 },
  { id: '0M', name: '学习', coin: 250, diamond: 25 },
  { id: '0N', name: '复习', coin: 180, diamond: 18 },
  { id: '0O', name: '练习', coin: 160, diamond: 16 },
  { id: '0P', name: '创作', coin: 400, diamond: 40 },
  { id: '0Q', name: '写作', coin: 350, diamond: 35 },
  { id: '0R', name: '画画', coin: 300, diamond: 30 },
  { id: '0S', name: '拍照', coin: 120, diamond: 12 },
  { id: '0T', name: '录像', coin: 200, diamond: 20 },
  { id: '0U', name: '编辑', coin: 250, diamond: 25 },
  { id: '0V', name: '分享', coin: 80, diamond: 8 },
  { id: '0W', name: '收藏', coin: 40, diamond: 4 },
  { id: '0X', name: '点赞', coin: 20, diamond: 2 },
  { id: '0Y', name: '评论', coin: 60, diamond: 6 },
  { id: '0Z', name: '转发', coin: 70, diamond: 7 },
  { id: '10', name: '关注', coin: 30, diamond: 3 },
  { id: '11', name: '取消关注', coin: 20, diamond: 2 },
  { id: '12', name: '举报', coin: 50, diamond: 5 },
  { id: '13', name: '屏蔽', coin: 40, diamond: 4 },
  { id: '14', name: '删除', coin: 30, diamond: 3 },
  { id: '15', name: '恢复', coin: 60, diamond: 6 },
  { id: '16', name: '备份', coin: 150, diamond: 15 },
  { id: '17', name: '同步', coin: 100, diamond: 10 },
  { id: '18', name: '更新', coin: 120, diamond: 12 },
  { id: '19', name: '升级', coin: 200, diamond: 20 },
  { id: '1a', name: '降级', coin: 50, diamond: 5 },
  { id: '1b', name: '重置', coin: 80, diamond: 8 },
  { id: '1c', name: '重启', coin: 90, diamond: 9 },
  { id: '1d', name: '关机', coin: 40, diamond: 4 },
  { id: '1e', name: '开机', coin: 40, diamond: 4 },
  { id: '1f', name: '充电', coin: 60, diamond: 6 },
  { id: '1g', name: '放电', coin: 30, diamond: 3 },
  { id: '1h', name: '清理', coin: 180, diamond: 18 },
  { id: '1i', name: '优化', coin: 220, diamond: 22 },
  { id: '1j', name: '修复', coin: 250, diamond: 25 },
  { id: '1k', name: '检查', coin: 100, diamond: 10 },
  { id: '1l', name: '测试', coin: 120, diamond: 12 },
  { id: '1m', name: '调试', coin: 200, diamond: 20 },
  { id: '1n', name: '部署', coin: 300, diamond: 30 },
  { id: '1o', name: '发布', coin: 350, diamond: 35 },
  { id: '1p', name: '上线', coin: 400, diamond: 40 },
  { id: '1q', name: '下线', coin: 100, diamond: 10 },
  { id: '1r', name: '维护', coin: 280, diamond: 28 },
  { id: '1s', name: '监控', coin: 150, diamond: 15 },
  { id: '1t', name: '报警', coin: 80, diamond: 8 },
  { id: '1u', name: '通知', coin: 70, diamond: 7 },
  { id: '1v', name: '提醒', coin: 50, diamond: 5 },
  { id: '1w', name: '预约', coin: 120, diamond: 12 },
  { id: '1x', name: '取消', coin: 40, diamond: 4 },
  { id: '1y', name: '确认', coin: 60, diamond: 6 },
  { id: '1z', name: '拒绝', coin: 30, diamond: 3 },
  { id: '1A', name: '同意', coin: 60, diamond: 6 },
  { id: '1B', name: '反对', coin: 30, diamond: 3 },
  { id: '1C', name: '支持', coin: 80, diamond: 8 },
  { id: '1D', name: '反对', coin: 30, diamond: 3 },
  { id: '1E', name: '中立', coin: 40, diamond: 4 },
  { id: '1F', name: '积极', coin: 100, diamond: 10 },
  { id: '1G', name: '消极', coin: 20, diamond: 2 },
  { id: '1H', name: '乐观', coin: 90, diamond: 9 },
  { id: '1I', name: '悲观', coin: 25, diamond: 2 },
  { id: '1J', name: '理性', coin: 110, diamond: 11 },
  { id: '1K', name: '感性', coin: 70, diamond: 7 },
  { id: '1L', name: '客观', coin: 120, diamond: 12 },
  { id: '1M', name: '主观', coin: 60, diamond: 6 },
  { id: '1N', name: '公平', coin: 130, diamond: 13 },
  { id: '1O', name: '公正', coin: 140, diamond: 14 },
  { id: '1P', name: '公开', coin: 90, diamond: 9 },
  { id: '1Q', name: '私密', coin: 50, diamond: 5 },
  { id: '1R', name: '透明', coin: 100, diamond: 10 },
  { id: '1S', name: '保密', coin: 60, diamond: 6 },
  { id: '1T', name: '开放', coin: 110, diamond: 11 },
  { id: '1U', name: '封闭', coin: 45, diamond: 4 },
  { id: '1V', name: '自由', coin: 160, diamond: 16 },
  { id: '1W', name: '约束', coin: 35, diamond: 3 },
  { id: '1X', name: '独立', coin: 180, diamond: 18 },
  { id: '1Y', name: '依赖', coin: 40, diamond: 4 },
  { id: '1Z', name: '自主', coin: 200, diamond: 20 },
];

export class DailyTaskManager {
  private tasks: DailyTask[];

  constructor() {
    this.tasks = [...dailyTasks];
  }

  // 获取所有任务
  getAllTasks(): DailyTask[] {
    return this.tasks;
  }

  // 根据ID获取任务
  getTaskById(taskId: string): DailyTask | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  // 根据名称搜索任务
  searchByName(name: string): DailyTask[] {
    return this.tasks.filter(task => task.name.includes(name));
  }

  // 获取总奖励统计
  getTotalRewards(): { coin: number; diamond: number } {
    return this.tasks.reduce((total, task) => {
      total.coin += task.coin;
      total.diamond += task.diamond;
      return total;
    }, { coin: 0, diamond: 0 });
  }

  // 获取高奖励任务
  getHighRewardTasks(threshold: number = 300): DailyTask[] {
    return this.tasks.filter(task => task.coin >= threshold || task.diamond >= threshold);
  }
} 