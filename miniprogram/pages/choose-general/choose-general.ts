import { getAllGenerals, getForceName, getForceColor, getRarityColor, getRoleTypeName, getRoleTypeColor } from '../../utils/generals/types'

Page({
  data: {
    generals: [] as any[],
    selectedId: '',
    level: 1,
    force: '', // 添加势力字段
    mode: '' // 添加模式字段
  },

  onLoad(options: any) {
    const level = options.level || 1
    const force = options.force || '' // 从参数中获取势力
    const mode = options.mode || 'story' // 从参数中获取模式
    this.setData({ level, force, mode })
    this.loadGenerals(force)
  },

  loadGenerals(force: string) {
    // 根据势力筛选角色
    const all = getAllGenerals()
    let filtered = all.filter(g => g.level >= 0) // 已拥有角色
    
    // 如果有指定势力，则只显示该势力的角色
    if (force) {
      filtered = filtered.filter(g => g.force === force)
    }
    
    const displayGenerals = filtered.map(g => ({
      ...g,
      forceName: getForceName(g.force),
      forceColor: getForceColor(g.force),
      rarityColor: getRarityColor(g.rarity),
      roleTypeName: getRoleTypeName(g.roleType),
      roleTypeColor: getRoleTypeColor(g.roleType),
      skillDisplay: this.formatSkills(g.skills)
    }))
    this.setData({ generals: displayGenerals })
  },

  formatSkills(skills: any[]) {
    return skills.map(skill => `${skill.name}Lv.${skill.currentLevel}`)
  },

  selectGeneral(e: any) {
    const id = e.currentTarget.dataset.id
    this.setData({ selectedId: id })
  },

  confirmSelect() {
    const { selectedId, generals, level, mode } = this.data
    if (!selectedId) return
    const general = generals.find(g => g.id === selectedId)
    if (!general) return
    
    // 根据模式跳转到不同页面
    if (mode === 'story') {
      wx.navigateTo({
        url: `../balatro/balatro?generalId=${general.id}`
      })
    } else {
      // 其他模式跳转到 game-board
    wx.navigateTo({
      url: `../game-board/game-board?level=${level}&generalId=${general.id}`
    })
    }
  },

  goBack() {
    wx.navigateBack()
  }
}) 