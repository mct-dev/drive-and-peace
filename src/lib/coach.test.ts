import { describe, expect, it } from 'vitest'
import { generateMockCoachResponse } from './coach'
import { createSeedData } from '../data/seed'

describe('mock coach', () => {
  const context = {
    profile: createSeedData().profile,
    goals: createSeedData().goals,
  }

  it('responds to empty input', () => {
    const res = generateMockCoachResponse('', context)
    expect(res).toContain('Core signal')
    expect(res).toContain('1% action')
  })

  it('detects self-erasure themes', () => {
    const res = generateMockCoachResponse('I feel trapped and lost myself', context)
    expect(res.toLowerCase()).toContain('self-erasure')
  })

  it('detects family themes', () => {
    const res = generateMockCoachResponse('my kids and marriage need attention', context)
    expect(res.toLowerCase()).toContain('family')
  })

  it('detects building themes', () => {
    const res = generateMockCoachResponse('need to build income this month', context)
    expect(res.toLowerCase()).toContain('building')
  })

  it('detects stress themes', () => {
    const res = generateMockCoachResponse('anxiety spiral today', context)
    expect(res.toLowerCase()).toContain('spiral')
  })
})
