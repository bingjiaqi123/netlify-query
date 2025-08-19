export interface Achievement {
  id: string;
  name: string;
  coin: number; // 铜币奖励
  diamond: number; // 钻石奖励
}

export const achievements: Achievement[] = [
  { id: '00', name: '普通话一乙', coin: 50000, diamond: 2000 },
  { id: '01', name: '计算机Office二级', coin: 50000, diamond: 2000 },
  { id: '02', name: '计算机Python二级', coin: 100000, diamond: 5000 },
  { id: '03', name: '英语笔译三级', coin: 1000000, diamond: 10000 },
  { id: '04', name: '英语口译三级', coin: 800000, diamond: 8000 },
  { id: '05', name: '日语N1', coin: 200000, diamond: 3000 },
  { id: '06', name: '日语N2', coin: 150000, diamond: 2000 },
  { id: '07', name: '韩语TOPIK6', coin: 180000, diamond: 2500 },
  { id: '08', name: '韩语TOPIK5', coin: 120000, diamond: 1500 },
  { id: '09', name: '法语DELF B2', coin: 100000, diamond: 1200 },
  { id: '0a', name: '德语TestDaF', coin: 120000, diamond: 1500 },
  { id: '0b', name: '西班牙语DELE B2', coin: 90000, diamond: 1000 },
  { id: '0c', name: '意大利语CELI B2', coin: 80000, diamond: 900 },
  { id: '0d', name: '俄语ТРКИ B2', coin: 110000, diamond: 1300 },
  { id: '0e', name: '阿拉伯语HSK', coin: 150000, diamond: 2000 },
  { id: '0f', name: '葡萄牙语CAPLE B2', coin: 70000, diamond: 800 },
  { id: '0g', name: '荷兰语NT2', coin: 60000, diamond: 700 },
  { id: '0h', name: '瑞典语SFI', coin: 50000, diamond: 600 },
  { id: '0i', name: '挪威语Bergenstesten', coin: 55000, diamond: 650 },
  { id: '0j', name: '丹麦语Studieprøven', coin: 52000, diamond: 620 },
  { id: '0k', name: '芬兰语YKI', coin: 58000, diamond: 680 },
  { id: '0l', name: '冰岛语Íslenskupróf', coin: 45000, diamond: 550 },
  { id: '0m', name: '波兰语B2', coin: 65000, diamond: 750 },
  { id: '0n', name: '捷克语B2', coin: 62000, diamond: 720 },
  { id: '0o', name: '斯洛伐克语B2', coin: 60000, diamond: 700 },
  { id: '0p', name: '匈牙利语B2', coin: 68000, diamond: 780 },
  { id: '0q', name: '罗马尼亚语B2', coin: 55000, diamond: 650 },
  { id: '0r', name: '保加利亚语B2', coin: 58000, diamond: 680 },
  { id: '0s', name: '塞尔维亚语B2', coin: 62000, diamond: 720 },
  { id: '0t', name: '克罗地亚语B2', coin: 60000, diamond: 700 },
  { id: '0u', name: '斯洛文尼亚语B2', coin: 52000, diamond: 620 },
  { id: '0v', name: '爱沙尼亚语B2', coin: 48000, diamond: 580 },
  { id: '0w', name: '拉脱维亚语B2', coin: 50000, diamond: 600 },
  { id: '0x', name: '立陶宛语B2', coin: 52000, diamond: 620 },
  { id: '0y', name: '乌克兰语B2', coin: 70000, diamond: 800 },
  { id: '0z', name: '白俄罗斯语B2', coin: 45000, diamond: 550 },
  { id: '0A', name: '摩尔多瓦语B2', coin: 40000, diamond: 500 },
  { id: '0B', name: '格鲁吉亚语B2', coin: 75000, diamond: 850 },
  { id: '0C', name: '亚美尼亚语B2', coin: 65000, diamond: 750 },
  { id: '0D', name: '阿塞拜疆语B2', coin: 60000, diamond: 700 },
  { id: '0E', name: '哈萨克语B2', coin: 55000, diamond: 650 },
  { id: '0F', name: '乌兹别克语B2', coin: 50000, diamond: 600 },
  { id: '0G', name: '吉尔吉斯语B2', coin: 45000, diamond: 550 },
  { id: '0H', name: '塔吉克语B2', coin: 42000, diamond: 520 },
  { id: '0I', name: '土库曼语B2', coin: 40000, diamond: 500 },
  { id: '0J', name: '蒙古语B2', coin: 60000, diamond: 700 },
  { id: '0K', name: '藏语B2', coin: 80000, diamond: 900 },
  { id: '0L', name: '维吾尔语B2', coin: 70000, diamond: 800 },
  { id: '0M', name: '哈萨克语B2', coin: 55000, diamond: 650 },
  { id: '0N', name: '柯尔克孜语B2', coin: 48000, diamond: 580 },
  { id: '0O', name: '锡伯语B2', coin: 35000, diamond: 450 },
  { id: '0P', name: '达斡尔语B2', coin: 32000, diamond: 420 },
  { id: '0Q', name: '鄂伦春语B2', coin: 30000, diamond: 400 },
  { id: '0R', name: '鄂温克语B2', coin: 28000, diamond: 380 },
  { id: '0S', name: '赫哲语B2', coin: 25000, diamond: 350 },
  { id: '0T', name: '满语B2', coin: 40000, diamond: 500 },
  { id: '0U', name: '朝鲜语B2', coin: 65000, diamond: 750 },
  { id: '0V', name: '壮语B2', coin: 35000, diamond: 450 },
  { id: '0W', name: '布依语B2', coin: 32000, diamond: 420 },
  { id: '0X', name: '侗语B2', coin: 30000, diamond: 400 },
  { id: '0Y', name: '瑶语B2', coin: 28000, diamond: 380 },
  { id: '0Z', name: '白语B2', coin: 25000, diamond: 350 },
  { id: '10', name: '土家语B2', coin: 22000, diamond: 320 },
  { id: '11', name: '哈尼语B2', coin: 20000, diamond: 300 },
  { id: '12', name: '傣语B2', coin: 18000, diamond: 280 },
  { id: '13', name: '黎语B2', coin: 16000, diamond: 260 },
  { id: '14', name: '傈僳语B2', coin: 14000, diamond: 240 },
  { id: '15', name: '佤语B2', coin: 12000, diamond: 220 },
  { id: '16', name: '畲语B2', coin: 10000, diamond: 200 },
  { id: '17', name: '高山语B2', coin: 8000, diamond: 180 },
  { id: '18', name: '拉祜语B2', coin: 6000, diamond: 160 },
  { id: '19', name: '水语B2', coin: 4000, diamond: 140 },
  { id: '1a', name: '东乡语B2', coin: 2000, diamond: 120 },
  { id: '1b', name: '纳西语B2', coin: 1500, diamond: 100 },
  { id: '1c', name: '景颇语B2', coin: 1000, diamond: 80 },
  { id: '1d', name: '柯尔克孜语B2', coin: 800, diamond: 60 },
  { id: '1e', name: '土语B2', coin: 600, diamond: 40 },
  { id: '1f', name: '达斡尔语B2', coin: 400, diamond: 20 },
  { id: '1g', name: '仫佬语B2', coin: 200, diamond: 10 },
  { id: '1h', name: '羌语B2', coin: 100, diamond: 5 },
  { id: '1i', name: '布朗语B2', coin: 50, diamond: 2 },
  { id: '1j', name: '撒拉语B2', coin: 25, diamond: 1 },
  { id: '1k', name: '毛南语B2', coin: 20, diamond: 1 },
  { id: '1l', name: '仡佬语B2', coin: 15, diamond: 1 },
  { id: '1m', name: '锡伯语B2', coin: 10, diamond: 1 },
  { id: '1n', name: '阿昌语B2', coin: 8, diamond: 1 },
  { id: '1o', name: '普米语B2', coin: 6, diamond: 1 },
  { id: '1p', name: '塔吉克语B2', coin: 4, diamond: 1 },
  { id: '1q', name: '怒语B2', coin: 2, diamond: 1 },
  { id: '1r', name: '乌孜别克语B2', coin: 1, diamond: 1 },
  { id: '1s', name: '俄罗斯语B2', coin: 80000, diamond: 900 },
  { id: '1t', name: '鄂温克语B2', coin: 28000, diamond: 380 },
  { id: '1u', name: '德昂语B2', coin: 12000, diamond: 220 },
  { id: '1v', name: '保安语B2', coin: 8000, diamond: 180 },
  { id: '1w', name: '裕固语B2', coin: 6000, diamond: 160 },
  { id: '1x', name: '京语B2', coin: 4000, diamond: 140 },
  { id: '1y', name: '塔塔尔语B2', coin: 2000, diamond: 120 },
  { id: '1z', name: '独龙语B2', coin: 1000, diamond: 100 },
  { id: '1A', name: '鄂伦春语B2', coin: 30000, diamond: 400 },
  { id: '1B', name: '赫哲语B2', coin: 25000, diamond: 350 },
  { id: '1C', name: '门巴语B2', coin: 18000, diamond: 280 },
  { id: '1D', name: '珞巴语B2', coin: 16000, diamond: 260 },
  { id: '1E', name: '基诺语B2', coin: 14000, diamond: 240 },
  { id: '1F', name: '计算机C++二级', coin: 120000, diamond: 3000 },
  { id: '1G', name: '计算机Java二级', coin: 110000, diamond: 2800 },
  { id: '1H', name: '计算机C#二级', coin: 100000, diamond: 2500 },
  { id: '1I', name: '计算机JavaScript二级', coin: 90000, diamond: 2200 },
  { id: '1J', name: '计算机TypeScript二级', coin: 95000, diamond: 2300 },
  { id: '1K', name: '计算机Go二级', coin: 130000, diamond: 3200 },
  { id: '1L', name: '计算机Rust二级', coin: 150000, diamond: 3500 },
  { id: '1M', name: '计算机Swift二级', coin: 140000, diamond: 3300 },
  { id: '1N', name: '计算机Kotlin二级', coin: 120000, diamond: 2900 },
  { id: '1O', name: '计算机Dart二级', coin: 80000, diamond: 2000 },
  { id: '1P', name: '计算机PHP二级', coin: 70000, diamond: 1800 },
  { id: '1Q', name: '计算机Ruby二级', coin: 85000, diamond: 2100 },
  { id: '1R', name: '计算机Scala二级', coin: 160000, diamond: 3800 },
  { id: '1S', name: '计算机Haskell二级', coin: 200000, diamond: 4500 },
  { id: '1T', name: '计算机Clojure二级', coin: 180000, diamond: 4200 },
  { id: '1U', name: '计算机Erlang二级', coin: 170000, diamond: 4000 },
  { id: '1V', name: '计算机Elixir二级', coin: 160000, diamond: 3800 },
  { id: '1W', name: '计算机F#二级', coin: 140000, diamond: 3300 },
  { id: '1X', name: '计算机OCaml二级', coin: 190000, diamond: 4300 },
  { id: '1Y', name: '计算机Lisp二级', coin: 220000, diamond: 4800 },
  { id: '1Z', name: '计算机Prolog二级', coin: 250000, diamond: 5200 },
];

export class AchievementManager {
  private achievements: Achievement[];

  constructor() {
    this.achievements = [...achievements];
  }

  // 获取所有成就
  getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  // 根据ID获取成就
  getAchievementById(achievementId: string): Achievement | undefined {
    return this.achievements.find(achievement => achievement.id === achievementId);
  }

  // 根据名称搜索成就
  searchByName(name: string): Achievement[] {
    return this.achievements.filter(achievement => achievement.name.includes(name));
  }

  // 获取总奖励统计
  getTotalRewards(): { coin: number; diamond: number } {
    return this.achievements.reduce((total, achievement) => {
      total.coin += achievement.coin;
      total.diamond += achievement.diamond;
      return total;
    }, { coin: 0, diamond: 0 });
  }

  // 获取高奖励成就
  getHighRewardAchievements(threshold: number = 100000): Achievement[] {
    return this.achievements.filter(achievement => achievement.coin >= threshold || achievement.diamond >= threshold);
  }
} 