import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const isAdmin = true

    const { token } = await createAndAuthenticateUser(app, isAdmin)

    const response = await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        latitude: -3.8731776,
        longitude: -38.6138112,
        phone: '85981214026',
      })

    expect(response.statusCode).toEqual(201)
  })
})
