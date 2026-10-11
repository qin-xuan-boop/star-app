/** 健康检查：进程存活 + 数据库可读写 */
export default defineEventHandler(() => {
  return { ok: true, db: dbPing(), time: Date.now() }
})
