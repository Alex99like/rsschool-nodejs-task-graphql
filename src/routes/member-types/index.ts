import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import {MemberTypeService} from "./services";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await MemberTypeService.getAll(fastify)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      return await MemberTypeService.getById(fastify, request.params.id)
      // const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.params.id })
      // if (!memberType) {
      //   reply.statusCode = 404
      //   throw new Error('Not a MemberType with this id')
      // }
      //
      // return memberType
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      return await MemberTypeService.update(fastify, { ...request.body, id: request.params.id })
      // const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.params.id })
      // if (!memberType) {
      //   reply.statusCode = 400
      //   throw new Error('Not a MemberType with this id')
      // }
      //
      // return await fastify.db.memberTypes.change(request.params.id, request.body)
    }
  );
};

export default plugin;
