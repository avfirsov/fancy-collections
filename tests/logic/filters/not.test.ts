import { not } from '../../../src'

describe('not function', () => {
  const isEven = (num: number) => num % 2 === 0
  const isNotEven = not(isEven)

  test('should negate a predicate', () => {
    expect(isNotEven(2)).toBe(false)
    expect(isNotEven(3)).toBe(true)
  })
})
