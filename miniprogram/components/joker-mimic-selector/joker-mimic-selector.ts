// components/joker-mimic-selector/joker-mimic-selector.ts

import { JokerCard } from '../../mechanics/joker-categories'

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    availableJokers: {
      type: Array,
      value: []
    }
  },

  data: {
    selectedJokerId: ''
  },

  methods: {
    selectJoker(e: any) {
      const jokerId = e.currentTarget.dataset.jokerId
      this.setData({
        selectedJokerId: jokerId
      })
    },

    confirmSelection() {
      if (!this.data.selectedJokerId) {
        return
      }

      const selectedJoker = this.data.availableJokers.find(
        (joker: JokerCard) => joker.id === this.data.selectedJokerId
      )

      if (selectedJoker) {
        // 触发事件，通知父组件选择的模仿目标
        this.triggerEvent('jokerSelected', {
          joker: selectedJoker
        })
      }
    },

    cancelSelection() {
      this.setData({
        selectedJokerId: ''
      })
      this.triggerEvent('cancel')
    }
  }
}) 