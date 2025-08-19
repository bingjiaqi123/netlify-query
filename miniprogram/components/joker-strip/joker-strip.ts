Component({
  properties: {
    jokers: {
      type: Array,
      value: []
    },
    maxSlots: {
      type: Number,
      value: 14
    },
    abstractJokerBonus: {
      type: Number,
      value: 0
    },
    tapEnabled: {
      type: Boolean,
      value: true
    },
    alignMode: {
      type: String,
      value: 'left' // 'left' 或 'center'
    }
  },
  data: {
    processedJokers: [],
    firstRowBackCount: 7
  },
  observers: {
    'jokers': function(jokers) {
      if (!jokers || jokers.length === 0) {
          this.setData({ 
          processedJokers: [],
          firstRowBackCount: 7
        })
        return
      }

      // 处理小丑牌数据，仅保留前7张用于单行展示
      const processedJokers = jokers.slice(0, 7).map((joker: any) => {
        if (typeof joker === 'string') {
          return { name: joker, backgroundColor: '#ffe082', textColor: '#333' }
        }
        return joker
      })

      // 计算单行需要的背面牌数量（总共7格）
      const firstRowBackCount = Math.max(0, 7 - Math.min(processedJokers.length, 7))

      this.setData({
        processedJokers,
        firstRowBackCount
      })
    }
  },
  methods: {
    onTapJoker(e: any) {
      if (!this.data.tapEnabled) return
      
      const index = e.currentTarget.dataset.index
      this.triggerEvent('tap', { index, joker: this.data.processedJokers[index] })
    },
    
    // 刷新小丑牌显示（用于外部调用，确保抽象小丑牌效果描述实时更新）
    refreshJokers() {
      const jokers = this.data.jokers
      if (Array.isArray(jokers) && jokers.length > 0) {
        const { JokerRenderManager } = require('../../utils/joker-render-manager')
        const processedJokers = JokerRenderManager.processBlueprintJokers(jokers.slice(0, 7))
        this.setData({ processedJokers })
      }
    }
  }
}) 