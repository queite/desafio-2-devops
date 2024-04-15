import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from '@/http/controllers/gyms/search'
import { nearby } from '@/http/controllers/gyms/nearby'
import { create } from '@/http/controllers/gyms/create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms/create', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
