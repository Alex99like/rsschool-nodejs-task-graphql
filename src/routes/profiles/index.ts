import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id })
      if (!profile) {
        reply.statusCode = 404
        throw new Error('No profile by id')
      }

      return profile
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const userId = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId })
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId })
      const profile = (await fastify.db.profiles.findMany()).find(profile => profile.userId === userId?.id)

      if (!userId || !memberType || profile) {
        reply.statusCode = 400
        throw new Error('Invalid request body')
      }

      return await fastify.db.profiles.create(request.body)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id })
      if (!profile) {
        reply.statusCode = 400
        throw new Error('No profile by id')
      }

      return await fastify.db.profiles.delete(request.params.id)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id })

      if (!profile) {
        reply.statusCode = 400
        throw new Error('No profile by id')
      }

      return await fastify.db.profiles.change(request.params.id, request.body)
    }
  );
};

export default plugin;
