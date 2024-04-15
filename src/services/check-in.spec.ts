import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { FakeCheckInsRepository } from '@/repositories/fakes/fake-check-ins-repository'
import { CheckInService } from './check-in'
import { FakeGymsRepository } from '@/repositories/fakes/fake-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: FakeCheckInsRepository
let gymsRepository: FakeGymsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new FakeCheckInsRepository()
    gymsRepository = new FakeGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      latitude: -3.8731776,
      longitude: -38.6138112,
      phone: '85981214026',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8731776,
      userLongitude: -38.6138112,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // red, green, refactor

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8731776,
      userLongitude: -38.6138112,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.8731776,
        userLongitude: -38.6138112,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8731776,
      userLongitude: -38.6138112,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8731776,
      userLongitude: -38.6138112,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(-3.7809496),
      longitude: new Decimal(-38.632246),
      phone: '85981214026',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -3.8731776,
        userLongitude: -38.6138112,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
