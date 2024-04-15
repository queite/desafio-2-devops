import { GetUserMetricsService } from '../get-user.metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsService() {
  const checkInRepository = new PrismaCheckInsRepository()

  const service = new GetUserMetricsService(checkInRepository)

  return service
}
