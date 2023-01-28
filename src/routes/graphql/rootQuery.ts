import {GraphQLID, GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {ProfileGQLType} from "../profiles/typeGQL";
import {PostGQLType} from "../posts/typeGQL"
import {MemberGQLType} from "../member-types/typeGQL";
import {FastifyInstance} from "fastify";

export const RootQuery= async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      async resolve() {
        return await fastify.db.users.findMany()
      }
    },
    profiles: {
      type: new GraphQLList(ProfileGQLType),
      async resolve() {
        return await fastify.db.profiles.findMany()
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
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.id })
        if (user) return user
        else throw fastify.httpErrors.notFound()
      },
    },
    profile: {
      type: ProfileGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id })
        if (profile) return profile
        else throw fastify.httpErrors.notFound()
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