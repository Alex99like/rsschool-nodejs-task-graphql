import {FastifyInstance} from "fastify";
import {PostEntity} from "../../utils/DB/entities/DBPosts";

export const PostService = {
  getAll: async (fastify: FastifyInstance) => {
    return await fastify.db.posts.findMany()
  },
  getById: async (fastify: FastifyInstance, postId: string) => {
    const post = await fastify.db.posts.findOne({ key: 'id', equals: postId })
    if (!post) {
      throw fastify.httpErrors.notFound('Not a Post with this id')
    }

    return  post
  },
  create: async (fastify: FastifyInstance, input: Omit<PostEntity, 'id'>) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })

    if (!user) throw fastify.httpErrors.badRequest('User by id not Found')

    const post = await fastify.db.posts.create(input)
    if (post) return post
    else throw fastify.httpErrors.badRequest('Body is not valid')
  },
  update: async (fastify: FastifyInstance, input: Partial<Omit<PostEntity, 'userId'>>) => {
    const posts = await fastify.db.posts.findOne({ key: 'id', equals: input.id || '' })
    if (!posts) {
      throw fastify.httpErrors.badRequest('Body is not valid')
    }

    return await fastify.db.posts.change(posts.id, input)
  },
  delete: async (fastify: FastifyInstance, postId: string) => {
    const post = await fastify.db.posts.findOne({ key: 'id', equals: postId })

    if (!post) {
      throw fastify.httpErrors.badRequest("Not Post with this id")
    }

    return await fastify.db.posts.delete(postId)
  }
}

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