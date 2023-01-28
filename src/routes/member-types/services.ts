import {FastifyInstance} from "fastify";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";

export const MemberTypeService = {
  getAll: async (fastify: FastifyInstance) => {
    return await fastify.db.memberTypes.findMany()
  },
  getById: async (fastify: FastifyInstance, memberId: string) => {
    const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberId })
    if (!memberType) {
      throw fastify.httpErrors.notFound('Not a MemberType with this id')
    }

    return memberType
  },
  update: async (fastify: FastifyInstance, input: Partial<MemberTypeEntity>) => {
    const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.id || '' })
    if (!memberType) {
      throw fastify.httpErrors.badRequest('Not a MemberType with this id')
    }

    return await fastify.db.memberTypes.change(memberType.id, input)
  }
}
