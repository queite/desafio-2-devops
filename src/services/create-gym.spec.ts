import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from './create-gym'
import { FakeGymsRepository } from '@/repositories/fakes/fake-gyms-repository'

let gymsRepository: FakeGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new FakeGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: '',
      latitude: -3.8731776,
      longitude: -38.6138112,
      phone: '85981214026',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
