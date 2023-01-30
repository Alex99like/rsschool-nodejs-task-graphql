import {FastifyInstance} from "fastify";
import {PostEntity} from "../../utils/DB/entities/DBPosts";
import {ERROR_MESSAGE} from "../../helpers/ErrorMessages";

export const PostService = {
  getAll: async (fastify: FastifyInstance) => {
    return await fastify.db.posts.findMany()
  },
  getById: async (fastify: FastifyInstance, postId: string) => {
    const post = await fastify.db.posts.findOne({ key: 'id', equals: postId })
    if (!post) {
      throw fastify.httpErrors.notFound(ERROR_MESSAGE.POST_NOTFOUND)
    }

    return  post
  },
  create: async (fastify: FastifyInstance, input: Omit<PostEntity, 'id'>) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId })

    if (!user) throw fastify.httpErrors.badRequest(ERROR_MESSAGE.USER_NOTFOUND)

    const post = await fastify.db.posts.create(input)
    if (post) return post
    else throw fastify.httpErrors.badRequest(ERROR_MESSAGE.INVALID_BODY)
  },
  update: async (fastify: FastifyInstance, input: Partial<Omit<PostEntity, 'userId'>>) => {
    const posts = await fastify.db.posts.findOne({ key: 'id', equals: input.id || '' })
    if (!posts) {
      throw fastify.httpErrors.badRequest(ERROR_MESSAGE.INVALID_BODY)
    }

    return await fastify.db.posts.change(posts.id, input)
  },
  delete: async (fastify: FastifyInstance, postId: string) => {
    const post = await fastify.db.posts.findOne({ key: 'id', equals: postId })

    if (!post) {
      throw fastify.httpErrors.badRequest(ERROR_MESSAGE.POST_NOTFOUND)
    }

    return await fastify.db.posts.delete(postId)
  }
}