Page({
  data: {
    userStats: {
      coin: 0,
      diamond: 0
    }
  },

  onLoad() {
    this.loadUserStats()
  },

  onShow() {
    this.loadUserStats()
  },

  // 加载用户统计数据
  loadUserStats() {
    const gameData = wx.getStorageSync('gameData') || {}
    const userStats = gameData.userStats || { coin: 0, diamond: 0 }
    this.setData({ userStats })
  },

  // 购买大心愿卡
  buyBigLove(e: any) {
    const currency = e.currentTarget.dataset.currency
    const price = currency === 'coin' ? 100000 : 5000
    const currencyName = currency === 'coin' ? '铜币' : '钻石'
    
    this.checkAndBuy('大心愿卡', currency, price, currencyName)
  },

  // 购买小心愿卡
  buyTinyLove(e: any) {
    const currency = e.currentTarget.dataset.currency
    const price = currency === 'coin' ? 10000 : 500
    const currencyName = currency === 'coin' ? '铜币' : '钻石'
    
    this.checkAndBuy('小心愿卡', currency, price, currencyName)
  },

  // 检查货币并购买
  checkAndBuy(productName: string, currency: string, price: number, currencyName: string) {
    const { userStats } = this.data
    const currentAmount = currency === 'coin' ? userStats.coin : userStats.diamond
    
    if (currentAmount < price) {
      wx.showToast({
        title: `${currencyName}不足`,
        icon: 'error',
        duration: 2000
      })
      return
    }

    // 显示确认购买弹窗
    wx.showModal({
      title: '确认购买',
      content: `确定要购买${productName}吗？\n需要消耗${price}${currencyName}`,
      confirmText: '确认购买',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.processPurchase(productName, currency, price, currencyName)
        }
      }
    })
  },

  // 处理购买
  processPurchase(productName: string, currency: string, price: number, currencyName: string) {
    try {
      // 更新用户统计数据
      const gameData = wx.getStorageSync('gameData') || {}
      const userStats = gameData.userStats || { coin: 0, diamond: 0 }
      
      if (currency === 'coin') {
        userStats.coin -= price
      } else {
        userStats.diamond -= price
      }
      
      gameData.userStats = userStats
      wx.setStorageSync('gameData', gameData)
      
      // 更新页面数据
      this.setData({ userStats })
      
      // 记录购买历史
      this.recordPurchaseHistory(productName, currency, price, currencyName)
      
      // 显示购买成功提示
      wx.showToast({
        title: '购买成功！',
        icon: 'success',
        duration: 2000
      })
      
    } catch (error) {
      console.error('购买失败:', error)
      wx.showToast({
        title: '购买失败，请重试',
        icon: 'error',
        duration: 2000
      })
    }
  },

  // 记录购买历史
  recordPurchaseHistory(productName: string, currency: string, price: number, currencyName: string) {
    try {
      const historyStore = wx.getStorageSync('historyStore') || []
      
      const purchaseRecord = {
        id: Date.now().toString(),
        type: 'purchase',
        productName,
        currency,
        price,
        currencyName,
        purchaseTime: new Date().toISOString(),
        timestamp: Date.now()
      }
      
      historyStore.unshift(purchaseRecord)
      wx.setStorageSync('historyStore', historyStore)
      
    } catch (error) {
      console.error('记录购买历史失败:', error)
    }
  }
}) 