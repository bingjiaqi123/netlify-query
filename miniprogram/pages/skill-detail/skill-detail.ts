// pages/skill-detail/skill-detail.ts
import { Skill } from '../../utils/generals'

Page({
  data: {
    skill: {} as Skill,
    canUpgrade: false,
    upgradeCost: 0
  },

  onLoad(options: any) {
    const { skillData, generalId, skillIndex } = options
    
    if (skillData) {
      // 从页面参数获取技能数据
      const skill = JSON.parse(decodeURIComponent(skillData))
      this.setData({ skill })
    } else if (generalId && skillIndex) {
      // 从存储中获取技能数据
      this.loadSkillFromStorage(generalId, parseInt(skillIndex))
    }
    
    this.calculateUpgradeCost()
  },

  // 从存储中加载技能数据
  loadSkillFromStorage(generalId: string, skillIndex: number) {
    const generals = wx.getStorageSync('generals') || []
    const general = generals.find((g: any) => g.id === generalId)
    
    if (general && general.skills[skillIndex]) {
      this.setData({ skill: general.skills[skillIndex] })
    }
  },

  // 计算升级消耗
  calculateUpgradeCost() {
    const { skill } = this.data
    if (skill.currentLevel >= skill.levels.length - 1) {
      this.setData({ 
        canUpgrade: false, 
        upgradeCost: 0 
      })
      return
    }

    // 升级消耗 = 基础消耗 * (当前等级 + 1)
    const baseCost = 100
    const cost = baseCost * (skill.currentLevel + 1)
    
    // 检查是否有足够经验
    const userExp = wx.getStorageSync('userExp') || 0
    const canUpgrade = userExp >= cost
    
    this.setData({ 
      canUpgrade, 
      upgradeCost: cost 
    })
  },

  // 升级技能
  upgradeSkill() {
    const { skill, upgradeCost } = this.data
    
    if (!this.data.canUpgrade) {
      wx.showToast({
        title: '经验不足',
        icon: 'error'
      })
      return
    }

    // 确认升级
    wx.showModal({
      title: '确认升级',
      content: `是否消耗 ${upgradeCost} 经验升级技能？`,
      success: (res) => {
        if (res.confirm) {
          this.performUpgrade()
        }
      }
    })
  },

  // 执行升级
  performUpgrade() {
    const { skill, upgradeCost } = this.data
    
    // 扣除经验
    const userExp = wx.getStorageSync('userExp') || 0
    wx.setStorageSync('userExp', userExp - upgradeCost)
    
    // 升级技能
    const newSkill = {
      ...skill,
      currentLevel: skill.currentLevel + 1
    }
    
    this.setData({ skill: newSkill })
    
    // 更新存储中的技能数据
    this.updateSkillInStorage(newSkill)
    
    // 重新计算升级消耗
    this.calculateUpgradeCost()
    
    wx.showToast({
      title: '升级成功',
      icon: 'success'
    })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 更新存储中的技能数据
  updateSkillInStorage(newSkill: Skill) {
    const generals = wx.getStorageSync('generals') || []
    const generalId = wx.getStorageSync('currentGeneralId')
    
    if (generalId) {
      const generalIndex = generals.findIndex((g: any) => g.id === generalId)
      if (generalIndex !== -1) {
        // 找到对应的技能并更新
        const skillIndex = generals[generalIndex].skills.findIndex((s: any) => s.id === newSkill.id)
        if (skillIndex !== -1) {
          generals[generalIndex].skills[skillIndex] = newSkill
          wx.setStorageSync('generals', generals)
        }
      }
    }
  }
}) 