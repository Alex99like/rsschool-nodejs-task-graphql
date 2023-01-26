import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      if (!user) {
        reply.statusCode = 404
        throw new Error('Not User')
      }

      return user
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      if (!user) {
        reply.statusCode = 400
        throw new Error('Invalid request body')
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

      return await fastify.db.users.delete(request.params.id)
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const subscribeUser= await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      const thisUser  = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })

      if (subscribeUser && thisUser) {
        if (!thisUser.subscribedToUserIds.find(el => el === subscribeUser.id)) {
          thisUser.subscribedToUserIds.push(subscribeUser.id)
          return await fastify.db.users.change(thisUser.id, thisUser)
        }
      }

      reply.statusCode = 400
      throw new Error('Invalid body request or id')
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })
      const subscribeUser = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })

      if (!subscribeUser || !user || !user.subscribedToUserIds.includes(request.params.id)) {
        reply.statusCode = 400
        throw new Error()
      }

        user.subscribedToUserIds = user.subscribedToUserIds.filter(id => id !== request.params.id)
        await fastify.db.users.change(user.id, user)
        return user

      // const subscribeUser= await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      // const thisUser  = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })
      //
      // if (subscribeUser && thisUser) {
      //   const checkSubscribersUser = thisUser?.subscribedToUserIds.includes(subscribeUser?.id)
      //
      //   if (checkSubscribersUser) {
      //     thisUser.subscribedToUserIds = subscribeUser.subscribedToUserIds.filter(id => id !== subscribeUser.id)
      //     return  await fastify.db.users.change(thisUser.id, thisUser)
      //   }
      //   reply.statusCode = 400
      //   throw new Error('This no user subscribes')
      // }
      //
      // throw new Error('Invalid body request or id')
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id })
      if (!user) {
        reply.statusCode = 400
        throw new Error('No user by id')
      }

      return await fastify.db.users.change(request.params.id, request.body)
    }
  );
};

export default plugin;
