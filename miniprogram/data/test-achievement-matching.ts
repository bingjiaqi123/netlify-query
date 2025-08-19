// 测试成就匹配功能
import { AchievementManager } from './achievements.js'

export function testAchievementMatching() {
  console.log('=== 测试成就匹配功能 ===')
  
  const manager = new AchievementManager()
  
  // 测试1: 根据ID查找成就
  console.log('\n1. 测试根据ID查找成就:')
  const achievement00 = manager.getAchievementById('00')
  console.log('ID "00":', achievement00 ? achievement00.name : '未找到')
  
  const achievement01 = manager.getAchievementById('01')
  console.log('ID "01":', achievement01 ? achievement01.name : '未找到')
  
  const achievementInvalid = manager.getAchievementById('XX')
  console.log('ID "XX":', achievementInvalid ? achievementInvalid.name : '未找到')
  
  // 测试2: 根据名称搜索
  console.log('\n2. 测试根据名称搜索:')
  const officeResults = manager.searchByName('Office')
  console.log('搜索 "Office":', officeResults.map(a => `${a.id}: ${a.name}`))
  
  const pythonResults = manager.searchByName('Python')
  console.log('搜索 "Python":', pythonResults.map(a => `${a.id}: ${a.name}`))
  
  // 测试3: 奖励统计
  console.log('\n3. 测试奖励统计:')
  const totalRewards = manager.getTotalRewards()
  console.log('总奖励:', totalRewards)
  
  // 测试4: 高奖励成就
  console.log('\n4. 测试高奖励成就:')
  const highRewardAchievements = manager.getHighRewardAchievements(100000)
  console.log('高奖励成就 (≥100000铜币):', highRewardAchievements.map(a => `${a.id}: ${a.name} (${a.coin}铜币, ${a.diamond}钻石)`))
  
  // 测试5: 模拟页面数据更新
  console.log('\n5. 模拟页面数据更新:')
  const testId = '02'
  const testAchievement = manager.getAchievementById(testId)
  
  if (testAchievement) {
    console.log(`输入ID "${testId}" 后，应该自动填充:`)
    console.log(`- 标题: ${testAchievement.name}`)
    console.log(`- 铜币: ${testAchievement.coin}`)
    console.log(`- 钻石: ${testAchievement.diamond}`)
    console.log(`- hasCoin: ${testAchievement.coin > 0}`)
    console.log(`- hasDiamond: ${testAchievement.diamond > 0}`)
  }
  
  console.log('\n=== 测试完成 ===')
}

// 导出测试函数供外部使用
export default testAchievementMatching 