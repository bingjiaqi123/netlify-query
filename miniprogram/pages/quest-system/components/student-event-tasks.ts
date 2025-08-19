// 学生端活动任务组件
export class StudentEventTasks {
  // 显示活动任务列表
  static renderTasks(tasks: any, activeSub: 'available' | 'ongoing') {
    if (activeSub === 'available') {
      return (tasks.event?.available || []).map((task: any) => ({
        ...task,
        isPending: false
      }))
    } else {
      return (tasks.event?.ongoing || []).map((task: any) => ({
        ...task,
        isPending: task.status === 'pending-review',
        acceptTimeText: this.formatTime(task.acceptTime)
      }))
    }
  }

  // 接取活动任务
  static acceptTask(taskId: string, tasks: any) {
    const avail = tasks.event?.available || []
    const idx = avail.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = { ...avail[idx], status: 'ongoing', acceptTime: Date.now() }
    avail.splice(idx, 1)
    if (!tasks.event.ongoing) tasks.event.ongoing = []
    tasks.event.ongoing.unshift(task)
    return true
  }

  // 放弃活动任务
  static abandonTask(taskId: string, tasks: any) {
    const ongoing = tasks.event?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = { ...ongoing[idx] }
    delete task.status
    delete task.reviewNote
    delete task.acceptTime
    ongoing.splice(idx, 1)
    if (!tasks.event.available) tasks.event.available = []
    tasks.event.available.unshift(task)
    return true
  }

  // 提交活动任务
  static submitTask(taskId: string, tasks: any) {
    const ongoing = tasks.event?.ongoing || []
    const idx = ongoing.findIndex((t: any) => t.id === taskId)
    if (idx < 0) return false
    
    const task = { ...ongoing[idx], status: 'pending-review', submitTime: Date.now() }
    ongoing.splice(idx, 1)
    ongoing.unshift(task)
    return true
  }

  // 格式化时间
  private static formatTime(timestamp: number): string {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
} 