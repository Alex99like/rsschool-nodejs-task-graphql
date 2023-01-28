import {FastifyInstance} from "fastify";
import {UserEntity} from "../../utils/DB/entities/DBUsers";

export const UserService = {
  getAll: async (fastify: FastifyInstance): Promise<UserEntity[]> => {
    return await fastify.db.users.findMany()
  },
  getById: async (fastify: FastifyInstance, id: string): Promise<UserEntity> => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: id })
    if (!user) {
      throw fastify.httpErrors.notFound('User Not Found')
    }

    return user
  },
  create: async (fastify: FastifyInstance, input: Omit<UserEntity, 'subscribedToUserIds' | 'id'>): Promise<UserEntity> => {
    return fastify.db.users.create(input)
  },
  update: async (fastify: FastifyInstance, input: Partial<Omit<UserEntity, 'subscribedToUserIds'>>): Promise<UserEntity> => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: input.id || '' })
    if (!user) {
      throw fastify.httpErrors.badRequest('User by id not Found')
    }

    return await fastify.db.users.change(user.id, input)
  },
  delete: async (fastify: FastifyInstance, userId: string): Promise<UserEntity> => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: userId })
    if (!user) {
      throw fastify.httpErrors.badRequest('Invalid request body')
    }

    const profile = (await fastify.db.profiles.findMany()).find(el => el.userId === user.id)
    const posts = (await fastify.db.posts.findMany()).filter(post => post.userId === user.id)
    const users = (await fastify.db.users.findMany()).filter(el => el.subscribedToUserIds.includes(user.id))

    if (profile) await fastify.db.profiles.delete(profile.id)

    if (posts.length > 0) {
      for await (const post of posts) {
        await fastify.db.posts.delete(post.id)
      }
    }

    if (users.length > 0) {
      for await (const userEl of users) {
        userEl.subscribedToUserIds = userEl.subscribedToUserIds.filter(id => id !== user.id)
        await fastify.db.users.change(userEl.id, userEl)
      }
    }

    return await fastify.db.users.delete(userId)
  },
  subscribeUser: async (fastify: FastifyInstance, input: { id: string, userId: string }) => {
    const subscribeUser= await fastify.db.users.findOne({ key: 'id', equals: input.id })
    const thisUser  = await fastify.db.users.findOne({ key: 'id', equals: input.userId })

    if (subscribeUser && thisUser) {
      if (!thisUser.subscribedToUserIds.find(el => el === subscribeUser.id)) {
        thisUser.subscribedToUserIds.push(subscribeUser.id)
        await fastify.db.users.change(thisUser.id, thisUser)

        return subscribeUser
      }
    }

    throw fastify.httpErrors.badRequest('Invalid body request or id')
  },
  unSubscribeUser: async (fastify: FastifyInstance, input: { id: string, userId: string }) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })
    const subscribeUser = await fastify.db.users.findOne({ key: 'id', equals: input.id })

    if (!subscribeUser || !user || !user.subscribedToUserIds.includes(input.id)) {
      throw fastify.httpErrors.badRequest('Invalid body request or id')
    }

    user.subscribedToUserIds = user.subscribedToUserIds.filter(id => id !== input.id)
    return await fastify.db.users.change(user.id, user)
  }
}