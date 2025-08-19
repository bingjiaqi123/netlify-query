Component({
  methods:{
    onBack(){
      if (getCurrentPages().length > 1){
        wx.navigateBack({delta:1})
      } else {
        wx.switchTab({url:'/pages/home/home'})
      }
    }
  }
}) 