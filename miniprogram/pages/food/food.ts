// pages/food/food.ts

Page({
  data: {
    // 页面数据
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 导航到查看仓库页面
  navigateToWarehouse() {
    wx.navigateTo({
      url: '../warehouse/warehouse'
    })
  },

  // 导航到自己下厨页面
  navigateToCooking() {
    wx.navigateTo({
      url: '../cooking/cooking'
    })
  },

  // 导航到订外卖页面
  navigateToTakeout() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 导航到食堂推荐页面
  navigateToCanteen() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 导航到餐厅堂食页面
  navigateToRestaurant() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
}) 