import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsService } from './search-gyms'
import { FakeGymsRepository } from '@/repositories/fakes/fake-gyms-repository'

let gymsRepository: FakeGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new FakeGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: '',
      latitude: -3.8731776,
      longitude: -38.6138112,
      phone: '85981214026',
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      latitude: -3.8731776,
      longitude: -38.6138112,
      phone: '85981214026',
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated search gym', async () => {
    for (let i = 1; i <= 44; i++) {
      if (i % 2 === 0) {
        await gymsRepository.create({
          title: `JavaScript Gym ${i}`,
          description: '',
          latitude: -3.8731776,
          longitude: -38.6138112,
          phone: '85981214026',
        })
      } else {
        await gymsRepository.create({
          title: `TypeScript Gym ${i}`,
          description: '',
          latitude: -3.8731776,
          longitude: -38.6138112,
          phone: '85981214026',
        })
      }
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 42' }),
      expect.objectContaining({ title: 'JavaScript Gym 44' }),
    ])
  })
})
