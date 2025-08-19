import { DailyTaskManager, DailyTask } from './daily-tasks.js';
import { ActivityTaskManager, ActivityTask } from './activity-tasks.js';
import { AchievementManager, Achievement } from './achievements.js';

export class TaskSystem {
  private dailyTaskManager: DailyTaskManager;
  private activityTaskManager: ActivityTaskManager;
  private achievementManager: AchievementManager;

  constructor() {
    this.dailyTaskManager = new DailyTaskManager();
    this.activityTaskManager = new ActivityTaskManager();
    this.achievementManager = new AchievementManager();
  }

  // 获取所有管理器
  getDailyTaskManager(): DailyTaskManager {
    return this.dailyTaskManager;
  }

  getActivityTaskManager(): ActivityTaskManager {
    return this.activityTaskManager;
  }

  getAchievementManager(): AchievementManager {
    return this.achievementManager;
  }

  // 获取所有任务和成就
  getAllDailyTasks(): DailyTask[] {
    return this.dailyTaskManager.getAllTasks();
  }

  getAllActivityTasks(): ActivityTask[] {
    return this.activityTaskManager.getAllTasks();
  }

  getAllAchievements(): Achievement[] {
    return this.achievementManager.getAllAchievements();
  }

  // 根据ID获取
  getDailyTaskById(id: string): DailyTask | undefined {
    return this.dailyTaskManager.getTaskById(id);
  }

  getActivityTaskById(id: string): ActivityTask | undefined {
    return this.activityTaskManager.getTaskById(id);
  }

  getAchievementById(id: string): Achievement | undefined {
    return this.achievementManager.getAchievementById(id);
  }

  // 搜索功能
  searchDailyTasks(name: string): DailyTask[] {
    return this.dailyTaskManager.searchByName(name);
  }

  searchActivityTasks(name: string): ActivityTask[] {
    return this.activityTaskManager.searchByName(name);
  }

  searchAchievements(name: string): Achievement[] {
    return this.achievementManager.searchByName(name);
  }

  // 全局搜索
  searchAll(query: string): {
    daily: DailyTask[];
    activity: ActivityTask[];
    achievements: Achievement[];
  } {
    return {
      daily: this.searchDailyTasks(query),
      activity: this.searchActivityTasks(query),
      achievements: this.searchAchievements(query)
    };
  }

  // 获取统计信息
  getStats(): {
    dailyTasks: number;
    activityTasks: number;
    achievements: number;
    total: number;
  } {
    return {
      dailyTasks: this.getAllDailyTasks().length,
      activityTasks: this.getAllActivityTasks().length,
      achievements: this.getAllAchievements().length,
      total: this.getAllDailyTasks().length + this.getAllActivityTasks().length + this.getAllAchievements().length
    };
  }

  // 获取奖励统计
  getRewardStats(): {
    dailyTasks: { coin: number; diamond: number };
    activityTasks: { coin: number; diamond: number };
    achievements: { coin: number; diamond: number };
    total: { coin: number; diamond: number };
  } {
    const dailyRewards = this.dailyTaskManager.getTotalRewards();
    const activityRewards = this.activityTaskManager.getTotalRewards();
    const achievementRewards = this.achievementManager.getTotalRewards();

    return {
      dailyTasks: dailyRewards,
      activityTasks: activityRewards,
      achievements: achievementRewards,
      total: {
        coin: dailyRewards.coin + activityRewards.coin + achievementRewards.coin,
        diamond: dailyRewards.diamond + activityRewards.diamond + achievementRewards.diamond
      }
    };
  }

  // 获取高奖励项目
  getHighRewardItems(): {
    daily: DailyTask[];
    activity: ActivityTask[];
    achievements: Achievement[];
  } {
    return {
      daily: this.dailyTaskManager.getHighRewardTasks(),
      activity: this.activityTaskManager.getHighRewardTasks(),
      achievements: this.achievementManager.getHighRewardAchievements()
    };
  }

  // 根据奖励排序
  getSortedByReward(): {
    daily: DailyTask[];
    activity: ActivityTask[];
    achievements: Achievement[];
  } {
    const dailyTasks = [...this.getAllDailyTasks()].sort((a, b) => {
      const aTotal = a.coin + a.diamond * 100; // 钻石价值更高
      const bTotal = b.coin + b.diamond * 100;
      return bTotal - aTotal;
    });

    const activityTasks = [...this.getAllActivityTasks()].sort((a, b) => {
      const aTotal = a.coin + a.diamond * 100;
      const bTotal = b.coin + b.diamond * 100;
      return bTotal - aTotal;
    });

    const achievements = [...this.getAllAchievements()].sort((a, b) => {
      const aTotal = a.coin + a.diamond * 100;
      const bTotal = b.coin + b.diamond * 100;
      return bTotal - aTotal;
    });

    return {
      daily: dailyTasks,
      activity: activityTasks,
      achievements: achievements
    };
  }
} 