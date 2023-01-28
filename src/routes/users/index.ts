import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import {subscribeUserService, unSubscribeUserService} from "./services";

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
      return await subscribeUserService(fastify, { userId: request.body.userId, id: request.params.id })
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
      return await unSubscribeUserService(fastify, { userId: request.body.userId, id: request.params.id })
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
