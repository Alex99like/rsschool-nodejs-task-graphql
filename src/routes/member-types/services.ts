import {FastifyInstance} from "fastify";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";

export const checkFieldsToUpdateMemberTypes = async (fastify: FastifyInstance, input: MemberTypeEntity): Promise<MemberTypeEntity> => {
  const checkMember = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.id })

  if (!checkMember) throw fastify.httpErrors.notFound('MemberType by id not Found')

  const member = await fastify.db.memberTypes.change(input.id, input)
  if (member) return member
  else throw fastify.httpErrors.badRequest('Body is not valid')
}