import { matchesString } from '../../../src'

describe('matchesString function', () => {
  test('should match strings correctly', () => {
    const matchHello = matchesString('Hello')
    expect(matchHello('Hello World')).toBe(true)
    expect(matchHello('Hi there')).toBe(false)
  })

  test('should handle case sensitivity', () => {
    const matchHelloCaseSensitive = matchesString('hello', {
      caseSensitive: true,
    })
    expect(matchHelloCaseSensitive('Hello')).toBe(false)
    expect(matchHelloCaseSensitive('hello')).toBe(true)
  })

  test('should match full strings if specified', () => {
    const matchFullString = matchesString('Hello', { matchFull: true })
    expect(matchFullString('Hello World')).toBe(false)
    expect(matchFullString('Hello')).toBe(true)
  })

  // Additional tests for edge cases can be added here
})
