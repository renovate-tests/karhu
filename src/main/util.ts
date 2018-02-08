import {inspect} from 'util'

export function karhuInspect(obj: any) {
  if (typeof obj === 'string') return obj
  return inspect(obj)
}

export function logLevelsMatch(logLevels1: string[], logLevels2: string[]) {
  const set1 = [...new Set(logLevels1)].sort(),
    set2 = [...new Set(logLevels2)].sort()

  if (set1.length !== set2.length) return false
  for (let i = 0; i < set1.length; ++i) {
    if (set1[i] !== set2[i]) return false
  }
  return true
}
