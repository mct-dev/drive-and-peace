import { createId, nowISO } from '../lib/id'
import { todayISO } from '../lib/dates'
import type { AppStorage } from '../types'

export const STORAGE_VERSION = 2

export function createSeedData(): AppStorage {
  const t = nowISO()
  const goal1Id = createId()
  const goal2Id = createId()
  const goal3Id = createId()

  return {
    version: STORAGE_VERSION,
    program: {
      startDate: todayISO(),
    },
    profile: {
      id: createId(),
      name: '',
      why: 'To show people what it means to live fully: to work hard, to care deeply, and to be present.',
      vision:
        'To be a man who lives fully: present with the people he loves, excellent in everything he does, and proof that you don\'t have to choose between drive and peace.',
      legacy:
        'I want to be a father who showed his kids that you can be excellent and driven without sacrificing presence. I want to bring people together, make them feel valued, and prove that meaning comes from connection: to nature, to each other, to the work itself, not from optimization or endless achievement.',
      mission:
        'To live with drive and peace — present with the people I love, excellent in what I do, and proof that you don\'t have to choose between ambition and calm.',
      coreValues: 'Presence, honesty, useful work, connection, courage without self-erasure.',
      personToBecome: 'A man who is fully present, builds useful things, and makes people feel seen.',
      goals1yr: '',
      goals3yr: '',
      goals5yr: '',
      goals10yr: '',
      createdAt: t,
      updatedAt: t,
    },
    goals: [
      {
        id: goal1Id,
        title: 'Create intentional connection',
        description: 'Reach out, listen well, and make people feel seen.',
        why: 'Meaning comes from connection — not optimization.',
        dailyAction: 'One genuine conversation or message that makes someone feel seen.',
        milestones: [],
        quarterStart: todayISO(),
        sortOrder: 1,
        status: 'active',
        createdAt: t,
        updatedAt: t,
      },
      {
        id: goal2Id,
        title: 'Show up fully for family and marriage',
        description: 'Be present, not just physically available.',
        why: 'Presence without self-erasure starts at home.',
        dailyAction: 'One undistracted moment with family — phones away, eyes on.',
        milestones: [],
        quarterStart: todayISO(),
        sortOrder: 2,
        status: 'active',
        createdAt: t,
        updatedAt: t,
      },
      {
        id: goal3Id,
        title: 'Build financial independence by building useful things',
        description: 'Create value through work that matters.',
        why: 'Drive and peace both need a foundation.',
        dailyAction: 'Ship or touch one useful thing — a draft, a call, a small fix.',
        milestones: [],
        quarterStart: todayISO(),
        sortOrder: 3,
        status: 'active',
        createdAt: t,
        updatedAt: t,
      },
    ],
    goalVersions: [],
    dailyEntries: [],
    weeklyReviews: [],
    coachMessages: [],
  }
}
