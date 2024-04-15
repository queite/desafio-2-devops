import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { FakeCheckInsRepository } from '@/repositories/fakes/fake-check-ins-repository'
import { GetUserMetricsService } from './get-user.metrics'

let checkInsRepository: FakeCheckInsRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkInsRepository = new FakeCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
