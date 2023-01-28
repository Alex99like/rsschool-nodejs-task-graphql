import {GraphQLID, GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {ProfileGQLType} from "../profiles/typeGQL";
import {PostGQLType} from "../posts/typeGQL"
import {MemberGQLType} from "../member-types/typeGQL";
import {FastifyInstance} from "fastify";
import {UserService} from "../users/services";
import {ProfileService} from "../profiles/services";

export const RootQuery= async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      async resolve() {
        return await UserService.getAll(fastify)
      }
    },
    profiles: {
      type: new GraphQLList(ProfileGQLType),
      async resolve() {
        return await ProfileService.getAll(fastify)
      },
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      async resolve() {
        return await fastify.db.posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberGQLType),
      async resolve() {
        return await fastify.db.memberTypes.findMany()
      },
    },
    user: {
      type: UserGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        return await UserService.getById(fastify, args.id)
      },
    },
    profile: {
      type: ProfileGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        return await ProfileService.getById(fastify, args.id)
      },
    },
    post: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id })
        if (post) return post
        else throw fastify.httpErrors.notFound()
      },
    },
    memberType: {
      type: MemberGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent: UserEntity, args: Pick<UserEntity, 'id'>) {
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id })
        if (memberType) return memberType
        else throw fastify.httpErrors.notFound()
      },
    },
  }
})