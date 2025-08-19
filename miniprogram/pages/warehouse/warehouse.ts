// pages/warehouse/warehouse.ts

Page({
  data: {
    showColdModal: false,
    showFrozenModal: false,
    showDryModal: false,
    coldStorageItems: [] as any[],
    frozenStorageItems: [] as any[],
    dryStorageItems: [] as any[]
  },

  onLoad() {
    this.initStorageData()
  },

  // 初始化仓库数据
  initStorageData() {
    // 测试数据
    const coldStorageItems = [
      { name: '鲜番茄', amount: '250克' },
      { name: '豆腐', amount: '100克' },
      { name: '青蒜', amount: '100克' },
      { name: '黄豆芽', amount: '100克' }
    ]

    const frozenStorageItems = [
      { name: '鱼丸', amount: '100克' },
      { name: '鲢鱼头', amount: '300克' },
      { name: '鲤鱼', amount: '1条' },
      { name: '泡番茄', amount: '2罐' },
      { name: '老鸭', amount: '1只' }
    ]

    const dryStorageItems = [
      { name: '青菜心', amount: '250克' },
      { name: '水发香菇', amount: '300克' },
      { name: '水发黑木耳', amount: '100克' },
      { name: '薏仁', amount: '100克' },
      { name: '绿豆', amount: '100克' }
    ]

    this.setData({
      coldStorageItems,
      frozenStorageItems,
      dryStorageItems
    })
  },

  // 显示冷藏窗口
  showColdStorage() {
    this.setData({ showColdModal: true })
  },

  // 显示冷冻窗口
  showFrozenStorage() {
    this.setData({ showFrozenModal: true })
  },

  // 显示储存窗口
  showDryStorage() {
    this.setData({ showDryModal: true })
  },

  // 关闭所有窗口
  closeModal() {
    this.setData({
      showColdModal: false,
      showFrozenModal: false,
      showDryModal: false
    })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  }
}) 