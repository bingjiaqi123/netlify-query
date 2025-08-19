// utils/page-loader.ts
import { getAllGenerals } from './generals/types'

// 页面布局加载器
export class PageLoader {
  
  // 开局清空背包并初始化牌型等级（每局初始化调用）
  static resetBagOnGameStart() {
    try {
      wx.removeStorageSync('bagPlanetCards')
      // 初始化所有牌型等级为1
      const initialTypeLevels = {
        '高牌': 1,
        '对子': 1,
        '两对': 1,
        '三条': 1,
        '顺子': 1,
        '同花': 1,
        '葫芦': 1,
        '四条': 1,
        '同花顺': 1,
        '五条': 1,
        '同花葫芦': 1,
        '皇家葫芦': 1,
        '皇家同花顺': 1
      }
      wx.setStorageSync('typeLevels', initialTypeLevels)
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if ((currentPage as any)?.setData) {
        ;(currentPage as any).setData({ 
          bagItems: [], 
          selectedMap: [], 
          selectedBagIndex: -1, 
          selectedCount: 0,
          typeLevels: initialTypeLevels
        })
      }
    } catch (_) {}
  }
  
  // 加载角色技能
  static loadGeneralSkills(generalId: string) {
    console.log('=== 开始加载角色技能 ===')
    console.log('角色ID:', generalId)
    
    if (!generalId) {
      console.log('没有角色ID，跳过技能加载')
      return {
        selectedGeneralSkills: [],
        selectedGeneralSkillData: []
      }
    }
    
    try {
      // 使用getAllGenerals获取角色数据
      const allGenerals = getAllGenerals()
      console.log('所有角色:', allGenerals)
      
      const general = allGenerals.find((g: any) => g.id === generalId)
      console.log('找到的角色:', general)
      
      if (general && general.skills) {
        console.log('角色技能:', general.skills)
        // 过滤掉等级为0的技能
        const activeSkills = general.skills.filter((skill: any) => skill.currentLevel > 0)
        console.log('激活的技能:', activeSkills)
        const skillDisplay = activeSkills.map((skill: any) => `${skill.name}Lv.${skill.currentLevel}`)
        console.log('技能显示:', skillDisplay)
        console.log('技能已设置到data')
        
        return {
          selectedGeneralSkills: skillDisplay,
          selectedGeneralSkillData: activeSkills
        }
      } else {
        console.log('未找到角色或角色没有技能')
        return {
          selectedGeneralSkills: [],
          selectedGeneralSkillData: []
        }
      }
    } catch (error) {
      console.error('加载角色技能失败:', error)
      return {
        selectedGeneralSkills: [],
        selectedGeneralSkillData: []
      }
    }
  }
  
  // 显示技能效果
  static showSkillEffect(skillIndex: number, selectedGeneralSkillData: any[]) {
    const skillData = selectedGeneralSkillData[skillIndex]
    
    if (skillData) {
      // 获取当前等级的技能效果
      const currentLevel = skillData.currentLevel
      const levelData = skillData.levels.find((level: any) => level.level === currentLevel)
      
      if (levelData) {
        const effectData = {
          showingSkillEffect: true,
          currentSkillEffect: levelData.effect
        }
        
        // 获取当前页面实例并更新数据
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        if (currentPage && (currentPage as any).setData) {
          ;(currentPage as any).setData(effectData)
          
          // 2秒后恢复显示技能名
          setTimeout(() => {
            const hideData = {
              showingSkillEffect: false,
              currentSkillEffect: ''
            }
            ;(currentPage as any).setData(hideData)
          }, 2000)
        }
      }
    }
  }

  static pageMethods: {
    showSkillEffect(this: any, e: any): void
  } = {
    showSkillEffect(this: any, e: any) {
      const skillIndex = e.currentTarget.dataset.skillIndex
      PageLoader.showSkillEffect(skillIndex, this.data.selectedGeneralSkillData)
    }
  }
} 