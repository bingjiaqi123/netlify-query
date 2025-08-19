// utils/sort-buttons.ts

export class SortButtons {
  static pageMethods: {
    sortByPoint(this: any): void
    sortBySuit(this: any): void
  } = {
    sortByPoint(this: any) {
      this.setData({ sortMode: 'point' })
      if (this.resortHand) this.resortHand()
    },
    sortBySuit(this: any) {
      this.setData({ sortMode: 'suit' })
      if (this.resortHand) this.resortHand()
    }
  }
} 