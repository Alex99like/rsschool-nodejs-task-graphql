import {FastifyInstance} from "fastify";
import {PostEntity} from "../../utils/DB/entities/DBPosts";

export const checkFieldsToCreatePost = async (fastify: FastifyInstance, input: Omit<PostEntity, 'id'>): Promise<PostEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })

  if (!user) throw fastify.httpErrors.badRequest('User by id not Found')

  const post = await fastify.db.posts.create(input)
  if (post) return post
  else throw fastify.httpErrors.badRequest('Body is not valid')
}

export const checkFieldsToUpdatePost = async (fastify: FastifyInstance, input: Omit<PostEntity, 'userId'>): Promise<PostEntity> => {
  const checkPost = await fastify.db.posts.findOne({ key: 'id', equals: input.id })

  if (!checkPost) throw fastify.httpErrors.notFound('Post by id not Found')

  const post = await fastify.db.posts.change(input.id, input)
  if (post) return post
  else throw fastify.httpErrors.badRequest('Body is not valid')
}