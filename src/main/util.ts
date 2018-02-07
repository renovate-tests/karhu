import {inspect} from 'util'

export function karhuInspect(obj: any) {
  if (typeof obj === 'string') return obj
  return inspect(obj)
}
