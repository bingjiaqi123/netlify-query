export interface ActivityTask {
  id: string;
  name: string;
  coin: number; // 铜币奖励
  diamond: number; // 钻石奖励
}

export const activityTasks: ActivityTask[] = [
  { id: '00', name: '整理人脸部件', coin: 300, diamond: 30 },
  { id: '01', name: '练手写速记', coin: 0, diamond: 100 },
  { id: '02', name: '脱毛仪', coin: 500, diamond: 30 },
  { id: '03', name: '学Blender建模', coin: 500, diamond: 20 },
  { id: '04', name: '学Photoshop', coin: 400, diamond: 25 },
  { id: '05', name: '学Premiere', coin: 450, diamond: 30 },
  { id: '06', name: '学After Effects', coin: 500, diamond: 35 },
  { id: '07', name: '学Illustrator', coin: 350, diamond: 20 },
  { id: '08', name: '学InDesign', coin: 300, diamond: 15 },
  { id: '09', name: '学Lightroom', coin: 250, diamond: 12 },
  { id: '0a', name: '学Cinema 4D', coin: 600, diamond: 40 },
  { id: '0b', name: '学Maya', coin: 700, diamond: 50 },
  { id: '0c', name: '学3ds Max', coin: 650, diamond: 45 },
  { id: '0d', name: '学Unity', coin: 550, diamond: 35 },
  { id: '0e', name: '学Unreal Engine', coin: 800, diamond: 60 },
  { id: '0f', name: '学C++', coin: 600, diamond: 40 },
  { id: '0g', name: '学Java', coin: 500, diamond: 30 },
  { id: '0h', name: '学C#', coin: 450, diamond: 25 },
  { id: '0i', name: '学JavaScript', coin: 300, diamond: 20 },
  { id: '0j', name: '学TypeScript', coin: 350, diamond: 22 },
  { id: '0k', name: '学Python', coin: 400, diamond: 25 },
  { id: '0l', name: '学Go', coin: 500, diamond: 30 },
  { id: '0m', name: '学Rust', coin: 700, diamond: 45 },
  { id: '0n', name: '学Swift', coin: 550, diamond: 35 },
  { id: '0o', name: '学Kotlin', coin: 450, diamond: 25 },
  { id: '0p', name: '学Dart', coin: 350, diamond: 20 },
  { id: '0q', name: '学PHP', coin: 250, diamond: 15 },
  { id: '0r', name: '学Ruby', coin: 300, diamond: 18 },
  { id: '0s', name: '学Scala', coin: 600, diamond: 40 },
  { id: '0t', name: '学Haskell', coin: 800, diamond: 60 },
  { id: '0u', name: '学Clojure', coin: 700, diamond: 50 },
  { id: '0v', name: '学Erlang', coin: 650, diamond: 45 },
  { id: '0w', name: '学Elixir', coin: 600, diamond: 40 },
  { id: '0x', name: '学F#', coin: 550, diamond: 35 },
  { id: '0y', name: '学OCaml', coin: 700, diamond: 50 },
  { id: '0z', name: '学Lisp', coin: 750, diamond: 55 },
  { id: '0A', name: '学Prolog', coin: 800, diamond: 60 },
  { id: '0B', name: '学Assembly', coin: 900, diamond: 70 },
  { id: '0C', name: '学Machine Learning', coin: 1000, diamond: 80 },
  { id: '0D', name: '学Deep Learning', coin: 1200, diamond: 100 },
  { id: '0E', name: '学Data Science', coin: 800, diamond: 60 },
  { id: '0F', name: '学Statistics', coin: 600, diamond: 40 },
  { id: '0G', name: '学Linear Algebra', coin: 500, diamond: 30 },
  { id: '0H', name: '学Calculus', coin: 550, diamond: 35 },
  { id: '0I', name: '学Discrete Math', coin: 450, diamond: 25 },
  { id: '0J', name: '学Graph Theory', coin: 600, diamond: 40 },
  { id: '0K', name: '学Number Theory', coin: 700, diamond: 50 },
  { id: '0L', name: '学Combinatorics', coin: 550, diamond: 35 },
  { id: '0M', name: '学Topology', coin: 800, diamond: 60 },
  { id: '0N', name: '学Analysis', coin: 650, diamond: 45 },
  { id: '0O', name: '学Algebra', coin: 500, diamond: 30 },
  { id: '0P', name: '学Geometry', coin: 400, diamond: 25 },
  { id: '0Q', name: '学Trigonometry', coin: 300, diamond: 20 },
  { id: '0R', name: '学Probability', coin: 450, diamond: 30 },
  { id: '0S', name: '学Optimization', coin: 600, diamond: 40 },
  { id: '0T', name: '学Game Theory', coin: 550, diamond: 35 },
  { id: '0U', name: '学Cryptography', coin: 700, diamond: 50 },
  { id: '0V', name: '学Computer Vision', coin: 800, diamond: 60 },
  { id: '0W', name: '学Natural Language Processing', coin: 900, diamond: 70 },
  { id: '0X', name: '学Speech Recognition', coin: 750, diamond: 55 },
  { id: '0Y', name: '学Robotics', coin: 1000, diamond: 80 },
  { id: '0Z', name: '学IoT', coin: 600, diamond: 40 },
  { id: '10', name: '学Blockchain', coin: 1200, diamond: 100 },
  { id: '11', name: '学Web3', coin: 1000, diamond: 80 },
  { id: '12', name: '学DeFi', coin: 1100, diamond: 90 },
  { id: '13', name: '学NFT', coin: 800, diamond: 60 },
  { id: '14', name: '学Smart Contracts', coin: 1300, diamond: 110 },
  { id: '15', name: '学Solidity', coin: 1200, diamond: 100 },
  { id: '16', name: '学Rust for Blockchain', coin: 1400, diamond: 120 },
  { id: '17', name: '学Move', coin: 1100, diamond: 90 },
  { id: '18', name: '学Vyper', coin: 900, diamond: 70 },
  { id: '19', name: '学Cadence', coin: 1000, diamond: 80 },
  { id: '1a', name: '学Michelson', coin: 1200, diamond: 100 },
  { id: '1b', name: '学Plutus', coin: 1300, diamond: 110 },
  { id: '1c', name: '学Scilla', coin: 1100, diamond: 90 },
  { id: '1d', name: '学Simplicity', coin: 1000, diamond: 80 },
  { id: '1e', name: '学Bitcoin Script', coin: 800, diamond: 60 },
  { id: '1f', name: '学Lightning Network', coin: 900, diamond: 70 },
  { id: '1g', name: '学Ethereum', coin: 1000, diamond: 80 },
  { id: '1h', name: '学Polkadot', coin: 1100, diamond: 90 },
  { id: '1i', name: '学Cosmos', coin: 1000, diamond: 80 },
  { id: '1j', name: '学Solana', coin: 1200, diamond: 100 },
  { id: '1k', name: '学Cardano', coin: 1100, diamond: 90 },
  { id: '1l', name: '学Avalanche', coin: 900, diamond: 70 },
  { id: '1m', name: '学Polygon', coin: 800, diamond: 60 },
  { id: '1n', name: '学Arbitrum', coin: 900, diamond: 70 },
  { id: '1o', name: '学Optimism', coin: 900, diamond: 70 },
  { id: '1p', name: '学zkSync', coin: 1000, diamond: 80 },
  { id: '1q', name: '学StarkNet', coin: 1200, diamond: 100 },
  { id: '1r', name: '学Polygon zkEVM', coin: 1100, diamond: 90 },
  { id: '1s', name: '学Scroll', coin: 1000, diamond: 80 },
  { id: '1t', name: '学Base', coin: 800, diamond: 60 },
  { id: '1u', name: '学Linea', coin: 900, diamond: 70 },
  { id: '1v', name: '学Mantle', coin: 800, diamond: 60 },
  { id: '1w', name: '学Manta', coin: 900, diamond: 70 },
  { id: '1x', name: '学Taiko', coin: 1000, diamond: 80 },
  { id: '1y', name: '学Kroma', coin: 900, diamond: 70 },
  { id: '1z', name: '学OP Stack', coin: 1100, diamond: 90 },
  { id: '1A', name: '学ZK Stack', coin: 1200, diamond: 100 },
  { id: '1B', name: '学Superchain', coin: 1000, diamond: 80 },
  { id: '1C', name: '学Modular Blockchain', coin: 1300, diamond: 110 },
  { id: '1D', name: '学Layer 2', coin: 900, diamond: 70 },
  { id: '1E', name: '学Layer 3', coin: 1000, diamond: 80 },
  { id: '1F', name: '学Appchain', coin: 1100, diamond: 90 },
  { id: '1G', name: '学Rollup', coin: 1000, diamond: 80 },
  { id: '1H', name: '学Validium', coin: 900, diamond: 70 },
  { id: '1I', name: '学Plasma', coin: 800, diamond: 60 },
  { id: '1J', name: '学State Channels', coin: 700, diamond: 50 },
  { id: '1K', name: '学Payment Channels', coin: 600, diamond: 40 },
  { id: '1L', name: '学Sidechains', coin: 500, diamond: 30 },
  { id: '1M', name: '学Cross-chain', coin: 1000, diamond: 80 },
  { id: '1N', name: '学Bridges', coin: 800, diamond: 60 },
  { id: '1O', name: '学Oracles', coin: 700, diamond: 50 },
  { id: '1P', name: '学Indexers', coin: 600, diamond: 40 },
  { id: '1Q', name: '学RPC', coin: 500, diamond: 30 },
  { id: '1R', name: '学APIs', coin: 400, diamond: 25 },
  { id: '1S', name: '学SDKs', coin: 450, diamond: 28 },
  { id: '1T', name: '学Wallets', coin: 600, diamond: 40 },
  { id: '1U', name: '学DEX', coin: 800, diamond: 60 },
  { id: '1V', name: '学CEX', coin: 700, diamond: 50 },
  { id: '1W', name: '学AMM', coin: 900, diamond: 70 },
  { id: '1X', name: '学Order Book', coin: 750, diamond: 55 },
  { id: '1Y', name: '学Liquidity Pools', coin: 800, diamond: 60 },
  { id: '1Z', name: '学Yield Farming', coin: 1000, diamond: 80 },
];

export class ActivityTaskManager {
  private tasks: ActivityTask[];

  constructor() {
    this.tasks = [...activityTasks];
  }

  // 获取所有任务
  getAllTasks(): ActivityTask[] {
    return this.tasks;
  }

  // 根据ID获取任务
  getTaskById(taskId: string): ActivityTask | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  // 根据名称搜索任务
  searchByName(name: string): ActivityTask[] {
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
  getHighRewardTasks(threshold: number = 500): ActivityTask[] {
    return this.tasks.filter(task => task.coin >= threshold || task.diamond >= threshold);
  }
} 