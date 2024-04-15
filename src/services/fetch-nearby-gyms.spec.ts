import { beforeEach, describe, expect, it } from 'vitest'
import { FakeGymsRepository } from '@/repositories/fakes/fake-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: FakeGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new FakeGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      latitude: -3.8731776,
      longitude: -38.6138112,
      phone: '85981214026',
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      latitude: -3.7197632,
      longitude: -38.5020635,
      phone: '85981214026',
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.8731776,
      userLongitude: -38.6138112,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
