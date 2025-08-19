import { Force } from '../../utils/generals'

Page({
  data: {
    selectedMode: '',
    selectedForce: ''
  },

  onLoad(options: any) {
    // 页面加载时的初始化
  },

  selectMode(e: any) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ selectedMode: mode })
  },

  selectForce(e: any) {
    const force = e.currentTarget.dataset.force
    this.setData({ selectedForce: force })
  },

  enterGame() {
    const { selectedMode, selectedForce } = this.data
    if (!selectedMode || !selectedForce) return
    
    // 直接进入游戏，不再选择武将
    wx.navigateTo({
      url: `../balatro/balatro?mode=${selectedMode}&force=${selectedForce}`
    })
  },

  goBack() {
    wx.navigateBack()
  }
}) 