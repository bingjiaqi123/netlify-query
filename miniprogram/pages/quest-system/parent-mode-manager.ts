// 家长模式管理器
export class ParentModeManager {
  // 发布任务
  static publishTask(
    draft: any,
    tab: 'daily'|'weekly'|'achieve'|'event',
    tasks: any,
    pools?: any
  ) {
    const title = (draft.title||'').trim()
    const desc = (draft.desc||'').trim()
    if (!title) { 
      wx.showToast({title:'请输入标题',icon:'none'})
      return null
    }

    // 对于每日/每周：发布到任务池；其他仍进入任务列表
    if ((tab === 'daily' || tab === 'weekly') && pools) {
      const poolType = draft.isPermanent ? 'permanent' : 'random'
      const id = `${tab}_pool_${poolType}_${Date.now()}`
      const shortId = (tab === 'daily' ? (draft.dailyTaskId || '') : (tab === 'weekly' ? (draft.weeklyTaskId || '') : '')).toString().trim()
      const task = {
        id,
        taskId: shortId, // 两位任务ID（用于导出编码）
        dailyTaskId: tab === 'daily' ? shortId : '',
        weeklyTaskId: tab === 'weekly' ? shortId : '',
        title,
        desc,
        coin: draft.hasCoin ? draft.coin : 0,
        diamond: draft.hasDiamond ? draft.diamond : 0,
        custom: draft.hasCustom ? draft.custom : '',
        hasCoin: draft.hasCoin,
        hasDiamond: draft.hasDiamond,
        hasCustom: draft.hasCustom,
        isPermanent: draft.isPermanent,
        template: true,
        poolType
      }
      if (poolType==='permanent'){
        pools[tab].permanent.unshift(task)
      } else {
        if (!pools[tab].random || !pools[tab].random.groups){ pools[tab].random = { groups: [] } }
        const groups = pools[tab].random.groups
        let def = groups.find((g:any)=>g.name==='默认')
        if (!def){ def = { name:'默认', drawCount:0, tasks:[] }; groups.push(def) }
        def.tasks.unshift(task)
      }
      return task
    }

    // 其他：直接进入任务列表
    const id = `${tab}_${Date.now()}`
    const task = { 
      id, 
      title, 
      desc, 
      coin: draft.hasCoin ? draft.coin : 0,
      diamond: draft.hasDiamond ? draft.diamond : 0,
      custom: draft.hasCustom ? draft.custom : '',
      hasCoin: draft.hasCoin,
      hasDiamond: draft.hasDiamond,
      hasCustom: draft.hasCustom,
      isPermanent: draft.isPermanent,
      publishTime: Date.now() 
    }
    
    // 确保tasks[tab]存在
    if (!tasks[tab]) {
      tasks[tab] = { available: [], ongoing: [], pending: [], completed: [] }
    }
    if (!tasks[tab].available) {
      tasks[tab].available = []
    }
    
    tasks[tab].available.unshift(task)
    return task
  }





  // 删除任务：优先在池中删除，否则在任务列表中删除
  static deleteTask(id: string, tasks: any, pools?: any) {
    console.log('ParentModeManager.deleteTask - id:', id)
    console.log('ParentModeManager.deleteTask - tasks:', tasks)
    
    // 检查是否是活动任务ID（以event_开头）
    const isEventTask = id.startsWith('event_')
    
    if (pools && !isEventTask) {
      for (const tab of ['daily','weekly']){
        // permanent
        const beforePerm = (pools[tab].permanent||[]).length
        pools[tab].permanent = (pools[tab].permanent||[]).filter((t:any)=>t.id!==id)
        if (pools[tab].permanent.length < beforePerm) {
          console.log('从池中删除了任务:', id)
          return true
        }
        // random groups
        const groups = pools[tab].random?.groups || []
        for (const g of groups){
          const before = (g.tasks||[]).length
          g.tasks = (g.tasks||[]).filter((t:any)=>t.id!==id && !t.isPresetTask)
          if (g.tasks.length < before) {
            console.log('从随机组中删除了任务:', id)
            return true
          }
        }
      }
    }
    
    for (const tab of ['daily','weekly','event']){
      if (!tasks[tab]) continue
      console.log(`检查 ${tab} 标签页`)
      
      const beforeA = (tasks[tab].available||[]).length
      const beforeO = (tasks[tab].ongoing||[]).length
      const beforeP = (tasks[tab].pending||[]).length
      const beforeC = (tasks[tab].completed||[]).length
      
      console.log(`${tab} 删除前 - available: ${beforeA}, ongoing: ${beforeO}, pending: ${beforeP}, completed: ${beforeC}`)
      
      tasks[tab].available = (tasks[tab].available||[]).filter((t:any)=>t.id!==id)
      tasks[tab].ongoing = (tasks[tab].ongoing||[]).filter((t:any)=>t.id!==id)
      tasks[tab].pending = (tasks[tab].pending||[]).filter((t:any)=>t.id!==id)
      tasks[tab].completed = (tasks[tab].completed||[]).filter((t:any)=>t.id!==id)
      
      const afterA = (tasks[tab].available||[]).length
      const afterO = (tasks[tab].ongoing||[]).length
      const afterP = (tasks[tab].pending||[]).length
      const afterC = (tasks[tab].completed||[]).length
      
      console.log(`${tab} 删除后 - available: ${afterA}, ongoing: ${afterO}, pending: ${afterP}, completed: ${afterC}`)
      
      if (afterA < beforeA || afterO < beforeO || afterP < beforeP || afterC < beforeC) {
        console.log(`从 ${tab} 中删除了任务:`, id)
        return true
    }
    }
    
    console.log('没有找到要删除的任务:', id)
    return false
  }

  // 审核通过任务
  static approveTask(id: string, tasks: any) {
    for (const tab of ['daily','weekly','event']){
      if (!tasks[tab]) continue
      const ongoing = tasks[tab].ongoing || []
      const idx = ongoing.findIndex((t:any) => t.id === id)
      if (idx >= 0) {
        const task = { ...ongoing[idx], status: 'approved', reviewTime: Date.now() }
        
        // 计算奖励
        const score = task.score || 100
        const rewards = this.calculateRewards(task, score)
        task.rewards = rewards
        
        ongoing.splice(idx, 1)
        // 审核通过的任务不再显示在任务列表中
        return true
      }
    }
    return false
  }

  // 驳回任务（保持不变）
  static rejectTask(id: string, tasks: any) {
    for (const tab of ['daily','weekly','event']){
      if (!tasks[tab]) continue
      const ongoing = tasks[tab].ongoing || []
      const idx = ongoing.findIndex((t:any) => t.id === id)
      if (idx >= 0) {
        const task = { ...ongoing[idx], status: 'rejected', reviewTime: Date.now() }
        ongoing.splice(idx, 1)
        // 驳回的任务重新变为进行中状态，可以重新提交
        delete task.status
        delete task.reviewTime
        task.status = 'ongoing'
        ongoing.unshift(task)
        return true
      }
    }
    return false
  }

  // 刷新管理任务列表：当为每日/每周时，未提交任务显示池中的模板，待审核显示学生端待审核任务
  static refreshManageTasks(tasks: any, activeTab?: string, pools?: any) {
    if (activeTab === 'daily' || activeTab === 'weekly') {
      const pending: any[] = []
      const availableTemplates: any[] = []
      const tab = activeTab

      // 待审核：来自学生端ongoing中的pending-review
      const ongoingList = tasks[tab]?.ongoing || []
      pending.push(...ongoingList.filter((t:any)=>t.status==='pending-review'))

      // 未提交：显示学生端available中的任务（过滤掉已完成的任务）
      const availableList = tasks[tab]?.available || []
      availableTemplates.push(...availableList.filter((t:any)=>t.status !== 'approved'))

      return { pendingReviewTasks: pending, availableTasks: availableTemplates, manageTasks: [] }
    }

    // 其他tab：保持原有行为，但过滤掉已完成的任务
    const allTasks: any[] = []
    if (activeTab && tasks[activeTab]) {
      allTasks.push(...(tasks[activeTab].available || []))
      allTasks.push(...(tasks[activeTab].ongoing || []))
    } else {
      for (const tab of ['daily','weekly','event']){
        if (tasks[tab]) {
          allTasks.push(...(tasks[tab].available || []))
          allTasks.push(...(tasks[tab].ongoing || []))
        }
      }
    }
    // 过滤掉已完成的任务
    const filteredTasks = allTasks.filter((t: any) => t.status !== 'approved')
    const tasksWithStatus = filteredTasks.map(task => ({
      ...task,
      statusText: this.getTaskStatusText(task)
    }))
    return { manageTasks: tasksWithStatus }
  }

  // 获取任务状态文本
  static getTaskStatusText(task: any): string {
    if (task.status === 'pending-review') return '待审核'
    if (task.status === 'approved') return '已通过'
    if (task.status === 'rejected') return '已驳回'
    if (task.status === 'ongoing') return '进行中'
    return '待接取'
  }

  // 计算奖励（根据分数）
  static calculateRewards(task: any, score: number) {
    const rewards: any = {}
    
    // 铜钱奖励：按分数百分比
    if (task.hasCoin && task.coin > 0) {
      rewards.coin = Math.floor(task.coin * score / 100)
    }
    
    // 钻石奖励：去余法到十位百分比（如89→80）
    if (task.hasDiamond && task.diamond > 0) {
      const percentage = Math.floor(score / 10) * 10
      rewards.diamond = Math.floor(task.diamond * percentage / 100)
    }
    
    // 自定义奖励：60分以上获得
    if (task.hasCustom && task.custom && score >= 60) {
      rewards.custom = task.custom
    }
    
    return rewards
  }

  // 重置草稿
  static resetDraft() {
    return { 
      title: '', 
      desc: '', 
      coin: 100, 
      diamond: 0, 
      custom: '', 
      hasCoin: true, 
      hasDiamond: false, 
      hasCustom: false,
      isPermanent: true // 默认常驻
    }
  }
} 