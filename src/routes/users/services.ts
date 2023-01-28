import {FastifyInstance} from "fastify";
import {UserEntity} from "../../utils/DB/entities/DBUsers";

export const checkFieldsToUpdateUser = async (fastify: FastifyInstance, input: Omit<UserEntity, 'subscribedToUserIds'>): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.id })
  if (!user) {
    throw fastify.httpErrors.badRequest('User by id not Found')
  }

  return await fastify.db.users.change(input.id, input)
}

export const subscribeUserService = async (fastify: FastifyInstance, input: { id: string, userId: string }) => {
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
}

export const unSubscribeUserService = async (fastify: FastifyInstance, input: { id: string, userId: string }) => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })
  const subscribeUser = await fastify.db.users.findOne({ key: 'id', equals: input.id })

  if (!subscribeUser || !user || !user.subscribedToUserIds.includes(input.id)) {
    throw fastify.httpErrors.badRequest('Invalid body request or id')
  }

  user.subscribedToUserIds = user.subscribedToUserIds.filter(id => id !== input.id)
  return await fastify.db.users.change(user.id, user)
}