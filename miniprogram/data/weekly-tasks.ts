export interface WeeklyTask {
  id: string;
  name: string;
  coin: number; // 铜币奖励
  diamond: number; // 钻石奖励
}

export const weeklyTasks: WeeklyTask[] = [
  { id: '00', name: '完成一周的每日任务', coin: 1000, diamond: 100 },
  { id: '01', name: '阅读一本书', coin: 500, diamond: 50 },
  { id: '02', name: '学习新技能', coin: 800, diamond: 80 },
  { id: '03', name: '完成一个项目', coin: 1200, diamond: 120 },
  { id: '04', name: '锻炼身体', coin: 300, diamond: 30 },
  { id: '05', name: '整理房间', coin: 200, diamond: 20 },
  { id: '06', name: '学习语言', coin: 600, diamond: 60 },
  { id: '07', name: '写周记', coin: 150, diamond: 15 },
  { id: '08', name: '帮助他人', coin: 400, diamond: 40 },
  { id: '09', name: '尝试新食物', coin: 100, diamond: 10 },
  { id: '0a', name: '学习编程', coin: 900, diamond: 90 },
  { id: '0b', name: '练习绘画', coin: 350, diamond: 35 },
  { id: '0c', name: '学习音乐', coin: 450, diamond: 45 },
  { id: '0d', name: '完成拼图', coin: 250, diamond: 25 },
  { id: '0e', name: '学习烹饪', coin: 400, diamond: 40 },
  { id: '0f', name: '整理照片', coin: 200, diamond: 20 },
  { id: '0g', name: '学习摄影', coin: 500, diamond: 50 },
  { id: '0h', name: '练习书法', coin: 300, diamond: 30 },
  { id: '0i', name: '学习园艺', coin: 350, diamond: 35 },
  { id: '0j', name: '完成手工', coin: 250, diamond: 25 },
  { id: '0k', name: '学习舞蹈', coin: 400, diamond: 40 },
  { id: '0l', name: '练习瑜伽', coin: 300, diamond: 30 },
  { id: '0m', name: '学习冥想', coin: 200, diamond: 20 },
  { id: '0n', name: '完成游戏', coin: 150, diamond: 15 },
  { id: '0o', name: '学习魔术', coin: 500, diamond: 50 },
  { id: '0p', name: '练习口才', coin: 400, diamond: 40 },
  { id: '0q', name: '学习写作', coin: 450, diamond: 45 },
  { id: '0r', name: '完成翻译', coin: 600, diamond: 60 },
  { id: '0s', name: '学习设计', coin: 700, diamond: 70 },
  { id: '0t', name: '练习建模', coin: 800, diamond: 80 },
  { id: '0u', name: '学习动画', coin: 900, diamond: 90 },
  { id: '0v', name: '完成视频', coin: 1000, diamond: 100 },
  { id: '0w', name: '学习剪辑', coin: 750, diamond: 75 },
  { id: '0x', name: '练习配音', coin: 400, diamond: 40 },
  { id: '0y', name: '学习作曲', coin: 600, diamond: 60 },
  { id: '0z', name: '完成录音', coin: 350, diamond: 35 },
  { id: '0A', name: '学习混音', coin: 500, diamond: 50 },
  { id: '0B', name: '练习演奏', coin: 450, diamond: 45 },
  { id: '0C', name: '学习编曲', coin: 700, diamond: 70 },
  { id: '0D', name: '完成演出', coin: 1200, diamond: 120 },
  { id: '0E', name: '学习指挥', coin: 800, diamond: 80 },
  { id: '0F', name: '练习合唱', coin: 300, diamond: 30 },
  { id: '0G', name: '学习独唱', coin: 400, diamond: 40 },
  { id: '0H', name: '完成独奏', coin: 600, diamond: 60 },
  { id: '0I', name: '学习合奏', coin: 500, diamond: 50 },
  { id: '0J', name: '练习重奏', coin: 450, diamond: 45 },
  { id: '0K', name: '学习协奏', coin: 900, diamond: 90 },
  { id: '0L', name: '完成交响', coin: 1500, diamond: 150 },
  { id: '0M', name: '学习歌剧', coin: 1200, diamond: 120 },
  { id: '0N', name: '练习芭蕾', coin: 800, diamond: 80 },
  { id: '0O', name: '学习现代舞', coin: 600, diamond: 60 },
  { id: '0P', name: '完成街舞', coin: 500, diamond: 50 },
  { id: '0Q', name: '学习民族舞', coin: 400, diamond: 40 },
  { id: '0R', name: '练习古典舞', coin: 700, diamond: 70 },
  { id: '0S', name: '学习爵士舞', coin: 550, diamond: 55 },
  { id: '0T', name: '完成拉丁舞', coin: 450, diamond: 45 },
  { id: '0U', name: '学习踢踏舞', coin: 600, diamond: 60 },
  { id: '0V', name: '练习肚皮舞', coin: 400, diamond: 40 },
  { id: '0W', name: '学习钢管舞', coin: 800, diamond: 80 },
  { id: '0X', name: '完成空中舞', coin: 1000, diamond: 100 },
  { id: '0Y', name: '学习冰上舞', coin: 1200, diamond: 120 },
  { id: '0Z', name: '练习水中舞', coin: 900, diamond: 90 },
  { id: '10', name: '学习火舞', coin: 1500, diamond: 150 },
  { id: '11', name: '完成光舞', coin: 800, diamond: 80 },
  { id: '12', name: '学习影舞', coin: 600, diamond: 60 },
  { id: '13', name: '练习声舞', coin: 500, diamond: 50 },
  { id: '14', name: '学习气舞', coin: 700, diamond: 70 },
  { id: '15', name: '完成神舞', coin: 2000, diamond: 200 },
  { id: '16', name: '学习仙舞', coin: 1800, diamond: 180 },
  { id: '17', name: '练习魔舞', coin: 1600, diamond: 160 },
  { id: '18', name: '学习圣舞', coin: 2200, diamond: 220 },
  { id: '19', name: '完成天舞', coin: 2500, diamond: 250 },
  { id: '1a', name: '学习地舞', coin: 1800, diamond: 180 },
  { id: '1b', name: '练习人舞', coin: 1200, diamond: 120 },
  { id: '1c', name: '学习鬼舞', coin: 1400, diamond: 140 },
  { id: '1d', name: '完成神舞', coin: 3000, diamond: 300 },
  { id: '1e', name: '学习仙舞', coin: 2800, diamond: 280 },
  { id: '1f', name: '练习魔舞', coin: 2600, diamond: 260 },
  { id: '1g', name: '学习圣舞', coin: 3200, diamond: 320 },
  { id: '1h', name: '完成天舞', coin: 3500, diamond: 350 },
  { id: '1i', name: '学习地舞', coin: 2800, diamond: 280 },
  { id: '1j', name: '练习人舞', coin: 2200, diamond: 220 },
  { id: '1k', name: '学习鬼舞', coin: 2400, diamond: 240 },
  { id: '1l', name: '完成神舞', coin: 4000, diamond: 400 },
  { id: '1m', name: '学习仙舞', coin: 3800, diamond: 380 },
  { id: '1n', name: '练习魔舞', coin: 3600, diamond: 360 },
  { id: '1o', name: '学习圣舞', coin: 4200, diamond: 420 },
  { id: '1p', name: '完成天舞', coin: 4500, diamond: 450 },
  { id: '1q', name: '学习地舞', coin: 3800, diamond: 380 },
  { id: '1r', name: '练习人舞', coin: 3200, diamond: 320 },
  { id: '1s', name: '学习鬼舞', coin: 3400, diamond: 340 },
  { id: '1t', name: '完成神舞', coin: 5000, diamond: 500 },
  { id: '1u', name: '学习仙舞', coin: 4800, diamond: 480 },
  { id: '1v', name: '练习魔舞', coin: 4600, diamond: 460 },
  { id: '1w', name: '学习圣舞', coin: 5200, diamond: 520 },
  { id: '1x', name: '完成天舞', coin: 5500, diamond: 550 },
  { id: '1y', name: '学习地舞', coin: 4800, diamond: 480 },
  { id: '1z', name: '练习人舞', coin: 4200, diamond: 420 },
  { id: '1A', name: '学习鬼舞', coin: 4400, diamond: 440 },
  { id: '1B', name: '完成神舞', coin: 6000, diamond: 600 },
  { id: '1C', name: '学习仙舞', coin: 5800, diamond: 580 },
  { id: '1D', name: '练习魔舞', coin: 5600, diamond: 560 },
  { id: '1E', name: '学习圣舞', coin: 6200, diamond: 620 },
  { id: '1F', name: '完成天舞', coin: 6500, diamond: 650 },
  { id: '1G', name: '学习地舞', coin: 5800, diamond: 580 },
  { id: '1H', name: '练习人舞', coin: 5200, diamond: 520 },
  { id: '1I', name: '学习鬼舞', coin: 5400, diamond: 540 },
  { id: '1J', name: '完成神舞', coin: 7000, diamond: 700 },
  { id: '1K', name: '学习仙舞', coin: 6800, diamond: 680 },
  { id: '1L', name: '练习魔舞', coin: 6600, diamond: 660 },
  { id: '1M', name: '学习圣舞', coin: 7200, diamond: 720 },
  { id: '1N', name: '完成天舞', coin: 7500, diamond: 750 },
  { id: '1O', name: '学习地舞', coin: 6800, diamond: 680 },
  { id: '1P', name: '练习人舞', coin: 6200, diamond: 620 },
  { id: '1Q', name: '学习鬼舞', coin: 6400, diamond: 640 },
  { id: '1R', name: '完成神舞', coin: 8000, diamond: 800 },
  { id: '1S', name: '学习仙舞', coin: 7800, diamond: 780 },
  { id: '1T', name: '练习魔舞', coin: 7600, diamond: 760 },
  { id: '1U', name: '学习圣舞', coin: 8200, diamond: 820 },
  { id: '1V', name: '完成天舞', coin: 8500, diamond: 850 },
  { id: '1W', name: '学习地舞', coin: 7800, diamond: 780 },
  { id: '1X', name: '练习人舞', coin: 7200, diamond: 720 },
  { id: '1Y', name: '学习鬼舞', coin: 7400, diamond: 740 },
  { id: '1Z', name: '完成神舞', coin: 9000, diamond: 900 },
];

export class WeeklyTaskManager {
  private tasks: WeeklyTask[];

  constructor() {
    this.tasks = [...weeklyTasks];
  }

  // 获取所有任务
  getAllTasks(): WeeklyTask[] {
    return this.tasks;
  }

  // 根据ID获取任务
  getTaskById(taskId: string): WeeklyTask | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  // 根据名称搜索任务
  searchByName(name: string): WeeklyTask[] {
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
  getHighRewardTasks(threshold: number = 1000): WeeklyTask[] {
    return this.tasks.filter(task => task.coin >= threshold || task.diamond >= threshold);
  }
} 