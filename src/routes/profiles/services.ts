import {FastifyInstance} from "fastify";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";

export const ProfileService = {
  getAll: async (fastify: FastifyInstance): Promise<ProfileEntity[]> => {
    return await fastify.db.profiles.findMany()
  },
  getById: async (fastify: FastifyInstance, profileId: string, key: keyof ProfileEntity = 'id'): Promise<ProfileEntity> => {
    const profile = await fastify.db.profiles.findOne({ key: key, equals: profileId })
    if (!profile) {
      throw fastify.httpErrors.notFound('No profile by id')
    }

    return profile
  },
  create: async (fastify: FastifyInstance, input: Omit<ProfileEntity, 'id'>) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })
    const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.memberTypeId })
    const checkProfile = (await fastify.db.profiles.findMany()).find(profile => profile.userId === user?.id)

    if (!user || !memberType || checkProfile) {
      throw fastify.httpErrors.badRequest()
    }

    const profile = await fastify.db.profiles.create(input)

    if (profile) return profile
    else throw fastify.httpErrors.badRequest()
  },
  update: async (fastify: FastifyInstance, input: Omit<Partial<ProfileEntity>, 'userId'>) => {
    const checkProfile = await fastify.db.profiles.findOne({ key: 'id', equals: input.id || '' })

    if (!checkProfile) {
      throw fastify.httpErrors.badRequest('Profile Not Found')
    }

    const profile = await fastify.db.profiles.change(checkProfile.id, input)

    if (profile) return profile
    else throw fastify.httpErrors.badRequest('No valid Body')
  },
  delete: async (fastify: FastifyInstance, profileId: string) => {
    const profile = await fastify.db.profiles.findOne({ key: 'id', equals: profileId })
    if (!profile) {
      throw fastify.httpErrors.badRequest('No profile by id')
    }

    return await fastify.db.profiles.delete(profileId)
  }
}
