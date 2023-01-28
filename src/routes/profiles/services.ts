import {FastifyInstance} from "fastify";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";

export const checkFieldsToCreateProfile = async (fastify: FastifyInstance, input: Omit<ProfileEntity, 'id'>): Promise<ProfileEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })
  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.memberTypeId })
  const checkProfile = (await fastify.db.profiles.findMany()).find(profile => profile.userId === user?.id)

  if (!user || !memberType || checkProfile) {
    throw fastify.httpErrors.badRequest()
  }

  const profile = await fastify.db.profiles.create(input)

  if (profile) return profile
  else throw fastify.httpErrors.badRequest()
}

export const checkFieldsToUpdateProfile = async (fastify: FastifyInstance, input: Omit<ProfileEntity, 'userId'>): Promise<ProfileEntity> => {
  const checkProfile = await fastify.db.profiles.findOne({ key: 'id', equals: input.id })

  if (!checkProfile) {
    throw fastify.httpErrors.badRequest()
  }

  const profile = await fastify.db.profiles.change(input.id, input)

  if (profile) return profile
  else throw fastify.httpErrors.badRequest()
}