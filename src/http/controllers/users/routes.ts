import { FastifyInstance } from 'fastify'

import { register } from '@/http/controllers/users/register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
