// pages/generals/generals.ts
import { 
  getAllGenerals, 
  getRarityColor, 
  getForceColor, 
  getForceName, 
  getRoleTypeName, 
  getRoleTypeColor, 
  General, 
  Skill,
  saveGenerals
} from '../../utils/generals/types'

import { sortGenerals, canBreakthrough, breakthroughGeneral } from '../../utils/generals/index'
import { canUpgrade, upgradeGeneral } from '../../utils/generals/general-upgrader'
import { canAwaken, awakenGeneral } from '../../utils/generals/general-awakener'

Page({
  data: {
    generals: [] as any[]
  },

  onLoad() {
    this.loadGenerals()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadGenerals()
  },

  // 加载角色数据
  loadGenerals() {
    try {
      const generals = getAllGenerals()
      const sortedGenerals = sortGenerals(generals)
      
      // 为每个角色添加显示用的颜色和名称，以及操作状态
      const displayGenerals = sortedGenerals.map(general => ({
        ...general,
        rarityColor: getRarityColor(general.rarity),
        forceColor: getForceColor(general.force),
        forceName: getForceName(general.force),
        roleTypeColor: getRoleTypeColor(general.roleType),
        roleTypeName: getRoleTypeName(general.roleType),
        canUpgrade: canUpgrade(general),
        canBreakthrough: canBreakthrough(general),
        canAwaken: canAwaken(general)
      }))

      this.setData({
        generals: displayGenerals
      })
    } catch (error) {
      console.error('加载角色数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 升级角色
  upgradeGeneral(e: any) {
    const generalId = e.currentTarget.dataset.id
    const generals = getAllGenerals()
    const generalIndex = generals.findIndex(g => g.id === generalId)
    
    if (generalIndex === -1) {
      wx.showToast({
        title: '角色不存在',
        icon: 'error'
      })
      return
    }
    
    const general = generals[generalIndex]
    
    if (!canUpgrade(general)) {
      wx.showToast({
        title: '无法升级',
        icon: 'error'
      })
      return
    }
    
    // 确认升级
    const actionText = canBreakthrough(general) ? '突破' : '升级'
    wx.showModal({
      title: `确认${actionText}`,
      content: `是否消耗 ${general.fragmentsNeeded} 碎片${actionText}${general.name}？`,
      success: (res) => {
        if (res.confirm) {
          if (canBreakthrough(general)) {
            this.performBreakthrough(general, generals)
          } else {
            this.performUpgrade(general, generals)
          }
        }
      }
    })
  },

  // 执行升级
  performUpgrade(general: General, generals: General[]) {
    if (upgradeGeneral(general)) {
      // 保存更新后的数据
      saveGenerals(generals)
      
      // 刷新显示
      this.loadGenerals()
      
      wx.showToast({
        title: '升级成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '升级失败',
        icon: 'error'
      })
    }
  },

  // 执行突破
  performBreakthrough(general: General, generals: General[]) {
    if (breakthroughGeneral(general)) {
      // 保存更新后的数据
      saveGenerals(generals)
      
      // 刷新显示
      this.loadGenerals()
      
      wx.showToast({
        title: '突破成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '突破失败',
        icon: 'error'
      })
    }
  },

  // 觉醒角色
  awakenGeneral(e: any) {
    const generalId = e.currentTarget.dataset.id
    const generals = getAllGenerals()
    const generalIndex = generals.findIndex(g => g.id === generalId)
    
    if (generalIndex === -1) {
      wx.showToast({
        title: '角色不存在',
        icon: 'error'
      })
      return
    }
    
    const general = generals[generalIndex]
    
    if (!canAwaken(general)) {
      wx.showToast({
        title: '无法觉醒',
        icon: 'error'
      })
      return
    }
    
    // 确认觉醒
    wx.showModal({
      title: '确认觉醒',
      content: `是否消耗觉醒资源觉醒${general.name}？`,
      success: (res) => {
        if (res.confirm) {
          this.performAwaken(general, generals)
        }
      }
    })
  },

  // 执行觉醒
  performAwaken(general: General, generals: General[]) {
    if (awakenGeneral(general)) {
      // 保存更新后的数据
      saveGenerals(generals)
      
      // 刷新显示
      this.loadGenerals()
      
      wx.showToast({
        title: '觉醒成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '觉醒失败',
        icon: 'error'
      })
    }
  },

  // 显示技能详情
  showSkillDetail(e: any) {
    const skill = e.currentTarget.dataset.skill as Skill
    const generalName = e.currentTarget.dataset.generalName as string
    
    // 跳转到技能详情页面
    const skillData = encodeURIComponent(JSON.stringify(skill))
    wx.navigateTo({
      url: `../skill-detail/skill-detail?skillData=${skillData}&generalName=${encodeURIComponent(generalName)}`
    })
  }
}) 