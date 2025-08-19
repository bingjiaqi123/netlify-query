// 激励语句集合
export const motivationalQuotes = [
  "焦虑是因为你的才华撑不起野心",
  "你反复比较的工具，正在消耗你的决策力",
  "你收藏的干货里，躺着99个未启动的梦想",
  "假装合群的时间，够你长出翅膀了",
  "你等待的'有人带'，正是别人甩开你的时机",
  "你在床上追剧时，对手在拆解你的赛道",
  "你关注的成长博主，正在用你的懒惰变现",
  "你期待的'逆袭'，藏在被你浪费的每一个今天",
  "平时总是'差不多'，关键的时候就会'差一点'",
  "平庸不是命运，而是无数个放纵的累积",
  "沉迷短期快感的人，注定错过长期复利",
  "你的焦虑，源于看得太多做得太少",
  "你刷的'五分钟速成'，正在加速你的平庸",
  "不要给敷衍和失败养成肌肉记忆",
  "你反复修改的计划表，正在拖延你的行动",
  "最可惜的不是失败，而是你本可以"
]

// 获取随机激励语句
export function getRandomQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[randomIndex]
}

// 获取指定索引的激励语句（用于保持一致性）
export function getQuoteByIndex(index: number): string {
  return motivationalQuotes[index % motivationalQuotes.length]
} 