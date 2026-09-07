export function raceToSuccess<T>(tasks: Promise<T>[], cleanup?: () => void) {
  return new Promise<T>((resolve, reject) => {
    if (!tasks.length) {
      reject(new Error('no tasks to race'))
      return
    }
    let failures = 0
    let settled = false
    const reasons: unknown[] = []
    tasks.forEach(task => {
      task.then(
        value => {
          if (settled) return
          settled = true
          cleanup?.()
          resolve(value)
        },
        reason => {
          if (settled) return
          reasons.push(reason)
          failures += 1
          if (failures === tasks.length) {
            reject(new AggregateError(reasons, 'all tasks failed'))
          }
        }
      )
    })
  })
}
