// pages/backup/backup.ts
Page({
  data: {
    exportResult: '',
    exportLength: 0,
    importInput: '',
    importLength: 0,
  },

  onLoad() {},

  // Base52编码（用于分数60-100）
  base52Encode(num: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    if (num < 60 || num > 100) return '0'
    return chars[num - 60]
  },

  // Base62编码（用于时间码）
  base62Encode(num: number): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    if (num === 0) return '0'
    
    let result = ''
    let n = num
    
    while (n > 0) {
      const remainder = n % 62
      result = chars[remainder] + result
      n = Math.floor(n / 62)
    }
    
    return result
  },

  // 计算时间唯一数
  calculateTimeUnique(timestamp: number): number {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    
    return (month - 1) * 31 * 24 * 60 + (day - 1) * 24 * 60 + hour * 60 + minute
  },

  // 获取两位数ID
  getTwoDigitId(task: any, type: string): string {
    if (type === 'daily' && task.dailyTaskId) {
      return task.dailyTaskId.toString().trim()
    }
    if (type === 'weekly' && task.weeklyTaskId) {
      return task.weeklyTaskId.toString().trim()
    }
    if (type === 'achieve' && task.achievementId) {
      return task.achievementId.toString().trim()
    }
    if (type === 'event' && task.activityId) {
      return task.activityId.toString().trim()
    }
    // 如果没有特定ID，尝试使用taskId
    if (task.taskId) {
      return task.taskId.toString().trim()
    }
    return ''
  },

  // 导出历史记录
  exportHistory() {
    const questData = wx.getStorageSync('questData') || {}
    const allRecords: any[] = []
    
    // 收集所有已完成/通过的任务与成就
    for (const tab of ['daily','weekly','achieve','event']){
      if (!questData[tab]) continue
      const ongoing = questData[tab].ongoing || []
      const available = questData[tab].available || []
      const completed = questData[tab].completed || []
      
      const collect = (task:any) => {
        if (task.status === 'approved' && task.submitTime) {
          const twoDigitId = this.getTwoDigitId(task, tab)
          allRecords.push({
            id: task.id,
            twoDigitId: twoDigitId,
            type: tab,
            title: task.title,
            desc: task.desc,
            submitTime: task.submitTime,
            score: task.score || 100
          })
        }
      }
      
      ongoing.forEach(collect)
      available.forEach(collect)
      completed.forEach(collect)
    }
    
    if (allRecords.length === 0) {
      wx.showToast({ title: '暂无记录可导出', icon: 'none' })
      return
    }

    // 找到最早的提交时间
    let earliestTime = Infinity
    allRecords.forEach(record => {
      if (record.submitTime && record.submitTime < earliestTime) {
        earliestTime = record.submitTime
      }
    })

    if (earliestTime === Infinity) {
      wx.showToast({ title: '没有有效的提交时间', icon: 'none' })
      return
    }

    // 获取年份后两位
    const earliestYear = new Date(earliestTime).getFullYear() % 100
    const yearStr = earliestYear.toString().padStart(2, '0')

    // 分离任务和成就记录
    const tasks = allRecords.filter(r => r.type !== 'achieve').sort((a, b) => a.submitTime - b.submitTime)
    const achievements = allRecords.filter(r => r.type === 'achieve').sort((a, b) => a.submitTime - b.submitTime)

    // 构建任务记录字符串
    const taskStrings = tasks.map(task => {
      const id = task.twoDigitId || '00'
      const score = this.base52Encode(task.score)
      const timeUnique = this.calculateTimeUnique(task.submitTime)
      const timeCode = this.base62Encode(timeUnique)
      return `${id}${score}${timeCode}`
    })

    // 构建成就记录字符串
    const achievementStrings = achievements.map(achievement => {
      const id = achievement.twoDigitId || '00'
      const score = this.base52Encode(achievement.score)
      const timeUnique = this.calculateTimeUnique(achievement.submitTime)
      const timeCode = this.base62Encode(timeUnique)
      return `${id}${score}${timeCode}`
    })

    // 组装最终导出字符串
    const exportString = `${yearStr};${taskStrings.join(',')};${achievementStrings.join(',')}`

    // 显示结果
    this.setData({
      exportResult: exportString,
      exportLength: exportString.length
    })

    // 复制到剪贴板
    wx.setClipboardData({
      data: exportString,
      success: () => {
        wx.showToast({ 
          title: '导出成功，已复制到剪贴板', 
          icon: 'success' 
        })
        console.log('导出字符串:', exportString)
      },
      fail: () => {
        wx.showToast({ 
          title: '导出失败', 
          icon: 'none' 
        })
      }
    })
  },

  // 判断是否为闰年
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  },

  // 获取月份天数
  getMonthDays(year: number, month: number): number {
    const monthDays = this.isLeapYear(year) 
      ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]  // 闰年
      : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]  // 非闰年
    return monthDays[month - 1]
  },

  // 从时间唯一数反推时间
  decodeTimeUnique(timeUnique: number, baseYear: number): { year: number, month: number, day: number, hour: number, minute: number } {
    let remaining = timeUnique
    let year = baseYear
    
    // 计算月份
    let month = 1
    while (remaining >= 31 * 24 * 60) {
      const monthDays = this.getMonthDays(year, month)
      if (remaining >= monthDays * 24 * 60) {
        remaining -= monthDays * 24 * 60
        month++
        if (month > 12) {
          month = 1
          year++
        }
      } else {
        break
      }
    }
    
    // 计算天数
    const day = Math.floor(remaining / (24 * 60)) + 1
    remaining = remaining % (24 * 60)
    
    // 计算小时和分钟
    const hour = Math.floor(remaining / 60)
    const minute = remaining % 60
    
    return { year, month, day, hour, minute }
  },

  // 从Base52解码分数
  base52Decode(char: string): number {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const index = chars.indexOf(char)
    return index >= 0 ? index + 60 : 100
  },

  // 从Base62解码时间码
  base62Decode(str: string): number {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let result = 0
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      const value = chars.indexOf(char)
      if (value === -1) return 0
      result = result * 62 + value
    }
    return result
  },

  // 导入历史记录
  importHistory() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { 
      wx.showToast({ title: '请先粘贴导入编码', icon: 'none' })
      return 
    }

    try {
      const parts = text.split(';')
      if (parts.length !== 3) {
        wx.showToast({ title: '导入格式错误', icon: 'none' })
        return
      }

      const [yearStr, taskStr, achievementStr] = parts
      const baseYear = 2000 + parseInt(yearStr)
      
      // 获取任务库和成就库
      let dailyTaskMap: Record<string, any> = {}
      let weeklyTaskMap: Record<string, any> = {}
      let achievementMap: Record<string, any> = {}
      
      try {
        // 加载每日任务库
        const { DailyTaskManager } = require('../../data/daily-tasks.js')
        const dm = new DailyTaskManager()
        dm.getAllTasks().forEach((t: any) => { dailyTaskMap[t.id] = t })
      } catch (e) {}
      
      try {
        // 加载每周任务库
        const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
        const wm = new WeeklyTaskManager()
        wm.getAllTasks().forEach((t: any) => { weeklyTaskMap[t.id] = t })
      } catch (e) {}
      
      try {
        // 加载成就库
        const { AchievementManager } = require('../../data/achievements.js')
        const am = new AchievementManager()
        am.getAllAchievements().forEach((a: any) => { achievementMap[a.id] = a })
      } catch (e) {}
      
      // 解析任务记录
      const tasks: any[] = []
      if (taskStr) {
        const taskRecords = taskStr.split(',').filter(Boolean)
        let lastTimeUnique = -1
        
        taskRecords.forEach((record, index) => {
          if (record.length < 3) return
          
          const id = record.slice(0, 2)
          const scoreChar = record[2]
          const timeCode = record.slice(3)
          
          const score = this.base52Decode(scoreChar)
          const timeUnique = this.base62Decode(timeCode)
          
          // 判断是否跨年
          let currentYear = baseYear
          if (index > 0 && timeUnique < lastTimeUnique) {
            currentYear++
          }
          lastTimeUnique = timeUnique
          
          const timeInfo = this.decodeTimeUnique(timeUnique, currentYear)
          const submitTime = new Date(timeInfo.year, timeInfo.month - 1, timeInfo.day, timeInfo.hour, timeInfo.minute).getTime()
          
          // 匹配任务库获取预设奖励
          const taskTemplate = dailyTaskMap[id] || weeklyTaskMap[id]
          const presetCoin = taskTemplate?.coin || 0
          const presetDiamond = taskTemplate?.diamond || 0
          const hasCoin = !!(taskTemplate && taskTemplate.coin > 0)
          const hasDiamond = !!(taskTemplate && taskTemplate.diamond > 0)
          
          // 根据分数计算实际奖励
          const actualCoin = hasCoin ? Math.round(presetCoin * (score / 100)) : 0
          const actualDiamond = hasDiamond ? Math.round(presetDiamond * (score / 100)) : 0
          
          tasks.push({
            id: `import_task_${Date.now()}_${Math.random()}`,
            twoDigitId: id,
            dailyTaskId: id,
            weeklyTaskId: id,
            type: 'daily', // 默认为每日任务，可以根据需要调整
            title: taskTemplate?.name || `导入任务${id}`,
            desc: '',
            submitTime: submitTime,
            score: score,
            status: 'approved',
            // 预设奖励
            coin: presetCoin,
            diamond: presetDiamond,
            hasCoin: hasCoin,
            hasDiamond: hasDiamond,
            hasCustom: false,
            custom: '',
            // 实际奖励
            rewards: {
              coin: actualCoin,
              diamond: actualDiamond,
              custom: ''
            },
            // 添加其他必要字段
            reviewTime: submitTime, // 审核时间设为提交时间
            publishTime: submitTime // 发布时间设为提交时间
          })
        })
      }
      
      // 解析成就记录
      const achievements: any[] = []
      if (achievementStr) {
        const achievementRecords = achievementStr.split(',').filter(Boolean)
        let lastTimeUnique = -1
        
        achievementRecords.forEach((record, index) => {
          if (record.length < 3) return
          
          const id = record.slice(0, 2)
          const scoreChar = record[2]
          const timeCode = record.slice(3)
          
          const score = this.base52Decode(scoreChar)
          const timeUnique = this.base62Decode(timeCode)
          
          // 判断是否跨年
          let currentYear = baseYear
          if (index > 0 && timeUnique < lastTimeUnique) {
            currentYear++
          }
          lastTimeUnique = timeUnique
          
          const timeInfo = this.decodeTimeUnique(timeUnique, currentYear)
          const submitTime = new Date(timeInfo.year, timeInfo.month - 1, timeInfo.day, timeInfo.hour, timeInfo.minute).getTime()
          
          // 匹配成就库获取预设奖励
          const achievementTemplate = achievementMap[id]
          const presetCoin = achievementTemplate?.coin || 0
          const presetDiamond = achievementTemplate?.diamond || 0
          const hasCoin = !!(achievementTemplate && achievementTemplate.coin > 0)
          const hasDiamond = !!(achievementTemplate && achievementTemplate.diamond > 0)
          
          // 根据分数计算实际奖励
          const actualCoin = hasCoin ? Math.round(presetCoin * (score / 100)) : 0
          const actualDiamond = hasDiamond ? Math.round(presetDiamond * (score / 100)) : 0
          
          achievements.push({
            id: `import_achievement_${Date.now()}_${Math.random()}`,
            twoDigitId: id,
            achievementId: id,
            type: 'achieve',
            title: achievementTemplate?.name || `导入成就${id}`,
            desc: '',
            submitTime: submitTime,
            score: score,
            status: 'approved',
            // 预设奖励
            coin: presetCoin,
            diamond: presetDiamond,
            hasCoin: hasCoin,
            hasDiamond: hasDiamond,
            hasCustom: false,
            custom: '',
            // 实际奖励
            rewards: {
              coin: actualCoin,
              diamond: actualDiamond,
              custom: ''
            },
            // 添加其他必要字段
            reviewTime: submitTime, // 审核时间设为提交时间
            publishTime: submitTime // 发布时间设为提交时间
          })
        })
      }
      
      // 保存到存储
      const questData = wx.getStorageSync('questData') || {}
      
      // 保存任务记录
      if (tasks.length > 0) {
        if (!questData.daily) questData.daily = { ongoing: [] }
        if (!questData.daily.ongoing) questData.daily.ongoing = []
        questData.daily.ongoing.push(...tasks)
      }
      
      // 保存成就记录
      if (achievements.length > 0) {
        if (!questData.achieve) questData.achieve = { ongoing: [], completed: [] }
        if (!questData.achieve.ongoing) questData.achieve.ongoing = []
        if (!questData.achieve.completed) questData.achieve.completed = []
        // 把导入的成就放到completed列表中，这样学生端"已达成"子页面就能显示
        questData.achieve.completed.push(...achievements)
      }
      
      wx.setStorageSync('questData', questData)
      
      wx.showToast({ 
        title: `导入成功：${tasks.length}个任务，${achievements.length}个成就`, 
        icon: 'success' 
      })
      
      console.log('导入的任务:', tasks)
      console.log('导入的成就:', achievements)
      
      // 刷新成就页面（如果当前在成就页面）
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.route === 'pages/achievement/achievement') {
        if (typeof currentPage.refreshVisible === 'function') {
          currentPage.refreshVisible()
        }
      }
      
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 一键导入（顺序：每日常驻;每日随机;每周常驻;每周随机;活动常驻）
  importAll() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      const parts = text.split(';')
      const [dPerm, dRand, wPerm, wRand, actPerm] = [parts[0]||'', parts[1]||'', parts[2]||'', parts[3]||'', parts[4]||'']
      if (dPerm) this.applyPermanentImport('daily', dPerm)
      if (dRand) this.applyImportCode('daily', dRand)
      if (wPerm) this.applyPermanentImport('weekly', wPerm)
      if (wRand) this.applyImportCode('weekly', wRand)
      if (actPerm) this.applyActivityPermanentImport(actPerm)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 一键导出（顺序：每日常驻;每日随机;每周常驻;每周随机;活动常驻）
  exportAll() {
    const dPerm = this.generatePermanentExport('daily')
    const dRand = this.generateExportCode('daily')
    const wPerm = this.generatePermanentExport('weekly')
    const wRand = this.generateExportCode('weekly')
    const actPerm = this.generateActivityPermanentExport()
    const all = [dPerm, dRand, wPerm, wRand, actPerm].join(';')
    this.showAndCopy(all)
  },

  // 成就导入：已达成在分号前，未达成在分号后
  importAchievements() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      const [achievedPart = '', unachievedPart = ''] = text.split(';')
      const achievedIds: string[] = []
      const unachievedIds: string[] = []
      const pack = (s: string, to: string[]) => {
        const seq = (s || '').replace(/\s+/g, '')
        for (let i = 0; i + 1 < seq.length; i += 2) to.push(seq.slice(i, i + 2))
      }
      pack(achievedPart, achievedIds)
      pack(unachievedPart, unachievedIds)

      // 构造数据
      const questData = wx.getStorageSync('questData') || {}
      if (!questData.achieve) questData.achieve = { available: [], ongoing: [] }
      const available: any[] = []
      const ongoing: any[] = []

      // 成就库
      let mapById: Record<string, any> = {}
      try {
        const { AchievementManager } = require('../../data/achievements.js')
        const am = new AchievementManager()
        am.getAllAchievements().forEach((a: any) => { mapById[a.id] = a })
      } catch (e) {}

      // 已达成：放 ongoing（无评分）
      achievedIds.forEach(id => {
        const a = mapById[id]
        ongoing.push({
          id: `achieve_${Date.now()}_${Math.random()}`,
          achievementId: id,
          title: a?.name || `成就${id}`,
          desc: '',
          coin: a?.coin || 0,
          diamond: a?.diamond || 0,
          hasCoin: !!(a && a.coin > 0),
          hasDiamond: !!(a && a.diamond > 0),
          hasCustom: false,
          status: 'approved',
          reviewTime: Date.now()
        })
      })

      // 未达成：放 available
      unachievedIds.forEach(id => {
        const a = mapById[id]
        available.push({
          id: `achieve_${Date.now()}_${Math.random()}`,
          achievementId: id,
          title: a?.name || `成就${id}`,
          desc: '',
          coin: a?.coin || 0,
          diamond: a?.diamond || 0,
          hasCoin: !!(a && a.coin > 0),
          hasDiamond: !!(a && a.diamond > 0),
          hasCustom: false
        })
      })

      questData.achieve.available = available
      questData.achieve.ongoing = ongoing
      wx.setStorageSync('questData', questData)

      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 成就导出：已达成;未达成
  exportAchievements() {
    const questData = wx.getStorageSync('questData') || {}
    const achieve = questData?.achieve || { available: [], ongoing: [] }
    const achieved = (achieve.ongoing || []).filter((t: any) => t.status === 'approved')
    const unachieved = (achieve.available || [])

    const pickId = (t: any): string => {
      const a = (t?.achievementId || '').toString().trim()
      const d = (t?.id || '').toString().trim()
      if (a && a.length === 2) return a
      try {
        const { AchievementManager } = require('../../data/achievements.js')
        const am = new AchievementManager()
        const byName = am.getAllAchievements().find((x: any) => x.name === t?.title)
        if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
      } catch (e) {}
      if (d && d.length === 2) return d
      return ''
    }

    const achievedCode = achieved.map(pickId).filter((x: string) => x).join('')
    const unachievedCode = unachieved.map(pickId).filter((x: string) => x).join('')
    const code = `${achievedCode};${unachievedCode}`
    this.showAndCopy(code)
  },

  // 导入每日随机（使用输入框内容）
  importDaily() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      this.applyImportCode('daily', text)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 导入每周随机（使用输入框内容）
  importWeekly() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      this.applyImportCode('weekly', text)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 导入每日常驻
  importDailyPermanent() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      this.applyPermanentImport('daily', text)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 导入每周常驻
  importWeeklyPermanent() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      this.applyPermanentImport('weekly', text)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 导出每日随机
  exportDaily() {
    const code = this.generateExportCode('daily')
    this.showAndCopy(code)
  },

  // 导出每周随机
  exportWeekly() {
    const code = this.generateExportCode('weekly')
    this.showAndCopy(code)
  },

  // 导出每日常驻
  exportDailyPermanent() {
    const code = this.generatePermanentExport('daily')
    this.showAndCopy(code)
  },

  // 导出每周常驻
  exportWeeklyPermanent() {
    const code = this.generatePermanentExport('weekly')
    this.showAndCopy(code)
  },

  // 活动任务：导入常驻（活动池）
  importActivityPermanent() {
    const text = (this.data.importInput || '').toString().trim()
    if (!text) { wx.showToast({ title: '请先粘贴导入编码', icon: 'none' }); return }
    try {
      this.applyActivityPermanentImport(text)
      wx.showToast({ title: '导入成功', icon: 'success' })
    } catch (e) {
      console.error('导入失败:', e)
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  },

  // 活动任务：导出常驻（活动池）
  exportActivityPermanent() {
    const code = this.generateActivityPermanentExport()
    this.showAndCopy(code)
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 绑定导入输入
  onImportInput(e: any) {
    const val = e.detail.value || ''
    this.setData({ importInput: val, importLength: val.length })
  },

  // 解析并写入随机池
  applyImportCode(tab: 'daily' | 'weekly', code: string) {
    const groups = code.split(',').map(s => s.trim()).filter(Boolean)

    // 准备任务库和组库
    let taskById: Record<string, any> = {}
    try {
      if (tab === 'daily') {
        const { DailyTaskManager } = require('../../data/daily-tasks.js')
        const dm = new DailyTaskManager()
        dm.getAllTasks().forEach((t: any) => { taskById[t.id] = t })
      } else {
        const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
        const wm = new WeeklyTaskManager()
        wm.getAllTasks().forEach((t: any) => { taskById[t.id] = t })
      }
    } catch (e) {}

    // 解析编码 -> 组对象数组
    const parsedGroups: any[] = []
    groups.forEach(g => {
      if (g.length < 2) return
      const gid = g[0]
      const draw = parseInt(g[1], 10)
      const taskSeq = g.slice(2)
      const taskIds: string[] = []
      for (let i = 0; i + 1 < taskSeq.length; i += 2) {
        taskIds.push(taskSeq.slice(i, i + 2))
      }

      // 根据 gid 找组名
      let groupName = ''
      try {
        const { TaskGroupManager } = require('../../data/task-groups.js')
        const gm = new TaskGroupManager()
        const groupMeta = gm.getGroupById(gid)
        groupName = groupMeta?.name || (gid === 'y' ? '默认' : gid)
      } catch (e) {
        groupName = gid === 'y' ? '默认' : gid
      }

      // 构造任务（仅保留必要字段和两位ID）
      const tasks = taskIds.map((tid) => {
        const lib = taskById[tid]
        return {
          id: lib ? `import_${tab}_${tid}_${Date.now()}_${Math.random()}` : `import_${tab}_${tid}`,
          taskId: tid,
          [tab === 'daily' ? 'dailyTaskId' : 'weeklyTaskId']: tid,
          title: lib?.name || `任务${tid}`,
          desc: '',
          coin: lib?.coin || 0,
          diamond: lib?.diamond || 0,
          custom: '',
          hasCoin: !!(lib && lib.coin > 0),
          hasDiamond: !!(lib && lib.diamond > 0),
          hasCustom: false,
          isPermanent: false
        }
      })

      parsedGroups.push({ id: gid, name: groupName, drawCount: isNaN(draw) ? 0 : draw, tasks })
    })

    // 写入到存储（替换现有随机组）
    const pools = wx.getStorageSync('questPools') || {}
    if (!pools[tab]) pools[tab] = { permanent: [], random: { groups: [] } }
    if (!pools[tab].random) pools[tab].random = { groups: [] }
    pools[tab].random.groups = parsedGroups
    wx.setStorageSync('questPools', pools)

    // 导入完成，不刷新导出框
  },

  // 解析常驻导入
  applyPermanentImport(tab: 'daily' | 'weekly', code: string) {
    const seq = code.replace(/\s+/g, '')
    const taskIds: string[] = []
    for (let i = 0; i + 1 < seq.length; i += 2) {
      taskIds.push(seq.slice(i, i + 2))
    }

    // 准备任务库
    let taskById: Record<string, any> = {}
    try {
      if (tab === 'daily') {
        const { DailyTaskManager } = require('../../data/daily-tasks.js')
        const dm = new DailyTaskManager()
        dm.getAllTasks().forEach((t: any) => { taskById[t.id] = t })
      } else {
        const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
        const wm = new WeeklyTaskManager()
        wm.getAllTasks().forEach((t: any) => { taskById[t.id] = t })
      }
    } catch (e) {}

    const tasks = taskIds.map(tid => {
      const lib = taskById[tid]
      return {
        id: lib ? `import_${tab}_perm_${tid}_${Date.now()}_${Math.random()}` : `import_${tab}_perm_${tid}`,
        taskId: tid,
        [tab === 'daily' ? 'dailyTaskId' : 'weeklyTaskId']: tid,
        title: lib?.name || `任务${tid}`,
        desc: '',
        coin: lib?.coin || 0,
        diamond: lib?.diamond || 0,
        custom: '',
        hasCoin: !!(lib && lib.coin > 0),
        hasDiamond: !!(lib && lib.diamond > 0),
        hasCustom: false,
        isPermanent: true
      }
    })

    const pools = wx.getStorageSync('questPools') || {}
    if (!pools[tab]) pools[tab] = { permanent: [], random: { groups: [] } }
    pools[tab].permanent = tasks
    wx.setStorageSync('questPools', pools)

    // 导入完成，不刷新导出框
  },

  // 活动任务：解析常驻导入（活动池）
  applyActivityPermanentImport(code: string) {
    const seq = code.replace(/\s+/g, '')
    const taskIds: string[] = []
    for (let i = 0; i + 1 < seq.length; i += 2) {
      taskIds.push(seq.slice(i, i + 2))
    }

    // 活动任务库
    let taskById: Record<string, any> = {}
    try {
      const { ActivityTaskManager } = require('../../data/activity-tasks.js')
      const am = new ActivityTaskManager()
      am.getAllTasks().forEach((t: any) => { taskById[t.id] = t })
    } catch (e) {}

    const tasks = taskIds.map(tid => {
      const lib = taskById[tid]
      return {
        id: lib ? `event_${Date.now()}_${Math.random()}` : `event_import_${tid}`,
        taskId: tid,
        activityTaskId: tid,
        title: lib?.name || `活动任务${tid}`,
        desc: '',
        coin: lib?.coin || 0,
        diamond: lib?.diamond || 0,
        custom: '',
        hasCoin: !!(lib && lib.coin > 0),
        hasDiamond: !!(lib && lib.diamond > 0),
        hasCustom: false
      }
    })

    // 写入到 questData.event.available（活动任务不走池）
    const questData = wx.getStorageSync('questData') || {}
    if (!questData.event) questData.event = { available: [], ongoing: [] }
    questData.event.available = tasks
    wx.setStorageSync('questData', questData)

    // 导入完成，不刷新导出框
  },

  // 导出常驻编码
  generatePermanentExport(tab: 'daily' | 'weekly'): string {
    const pools = wx.getStorageSync('questPools') || {}
    const perm = pools?.[tab]?.permanent || []
    const ids = perm
      .map((t: any) => {
        const a = (t?.taskId || '').toString().trim()
        const b = (t?.dailyTaskId || '').toString().trim()
        const c = (t?.weeklyTaskId || '').toString().trim()
        const d = (t?.id || '').toString().trim()
        if (a && a.length === 2) return a
        if (tab === 'daily' && b && b.length === 2) return b
        if (tab === 'weekly' && c && c.length === 2) return c
        if (d && d.length === 2) return d
        try {
          if (tab === 'daily') {
            const { DailyTaskManager } = require('../../data/daily-tasks.js')
            const dm = new DailyTaskManager()
            const byName = dm.getAllTasks().find((x: any) => x.name === t?.title)
            if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
          } else {
            const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
            const wm = new WeeklyTaskManager()
            const byName = wm.getAllTasks().find((x: any) => x.name === t?.title)
            if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
          }
        } catch (e) {}
        return ''
      })
      .filter((id: string) => id && id.length === 2)
      .join('')
    return ids
  },

  // 活动任务：导出常驻编码（活动池）
  generateActivityPermanentExport(): string {
    const questData = wx.getStorageSync('questData') || {}
    const source = questData?.event?.available || []

    const ids = source
      .map((t: any) => {
        const a = (t?.taskId || '').toString().trim()
        const b = (t?.activityTaskId || '').toString().trim()
        const d = (t?.id || '').toString().trim()
        if (a && a.length === 2) return a
        if (b && b.length === 2) return b
        if (d && d.length === 2) return d
        try {
          const { ActivityTaskManager } = require('../../data/activity-tasks.js')
          const am = new ActivityTaskManager()
          const byName = am.getAllTasks().find((x: any) => x.name === t?.title)
          if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
        } catch (e) {}
        return ''
      })
      .filter((id: string) => id && id.length === 2)
      .join('')
    return ids
  },

  // 生成导出编码（取任务两位ID：taskId/dailyTaskId/weeklyTaskId/id，最后尝试按标题匹配）
  generateExportCode(tab: 'daily' | 'weekly'): string {
    const pools = wx.getStorageSync('questPools') || {}
    const groups = pools?.[tab]?.random?.groups || []

    const codeList: string[] = []

    const getTwoCharId = (task: any): string => {
      const a = (task?.taskId || '').toString().trim()
      const b = (task?.dailyTaskId || '').toString().trim()
      const c = (task?.weeklyTaskId || '').toString().trim()
      const d = (task?.id || '').toString().trim()
      if (a && a.length === 2) return a
      if (tab === 'daily' && b && b.length === 2) return b
      if (tab === 'weekly' && c && c.length === 2) return c
      if (d && d.length === 2) return d
      try {
        if (tab === 'daily') {
          const { DailyTaskManager } = require('../../data/daily-tasks.js')
          const dm = new DailyTaskManager()
          const byName = dm.getAllTasks().find((t: any) => t.name === task?.title)
          if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
        } else if (tab === 'weekly') {
          const { WeeklyTaskManager } = require('../../data/weekly-tasks.js')
          const wm = new WeeklyTaskManager()
          const byName = wm.getAllTasks().find((t: any) => t.name === task?.title)
          if (byName && typeof byName.id === 'string' && byName.id.length === 2) return byName.id
        }
      } catch (e) {}
      return ''
    }

    groups.forEach((group: any) => {
      const gid = this.resolveGroupId(group)
      if (!gid || typeof gid !== 'string' || gid.length !== 1) return

      let drawCount = parseInt(group?.drawCount, 10)
      if (isNaN(drawCount) || drawCount < 0) drawCount = 0
      if (drawCount > 9) drawCount = 9

      const taskIds: string[] = (Array.isArray(group?.tasks) ? group.tasks : [])
        .map((t: any) => getTwoCharId(t))
        .filter((id: string) => id && id.length === 2)

      const groupCode = `${gid}${drawCount}${taskIds.join('')}`
      codeList.push(groupCode)
    })

    return codeList.join(',')
  },

  // 解析组ID：优先使用组自带id；否则尝试根据名称推断（默认组推断为 y）
  resolveGroupId(group: any): string | null {
    const id = (group?.id || '').toString()
    if (id && id.length === 1) return id

    const name = (group?.name || '').toString()
    if (!name) return null

    // 默认组名 -> y
    if (name === '默认') return 'y'

    // 尝试从 task-groups 表推断
    try {
      const { TaskGroupManager } = require('../../data/task-groups.js')
      const manager = new TaskGroupManager()
      const matched = manager.getAllGroups().find((g: any) => g.name === name)
      if (matched && typeof matched.id === 'string' && matched.id.length === 1) {
        return matched.id
      }
    } catch (e) {
      // ignore fallback errors
    }

    return null
  },

  // 展示并复制
  showAndCopy(code: string) {
    this.setData({ exportResult: code, exportLength: code.length })

    if (!code) {
      wx.showToast({ title: '没有可导出的数据', icon: 'none' })
      return
    }

    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '复制失败', icon: 'none' })
      }
    })
  },
}) 