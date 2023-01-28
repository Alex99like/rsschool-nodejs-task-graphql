import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {ProfileGQLType} from "../profiles/typeGQL";
import {PostGQLType} from "../posts/typeGQL";
import {FastifyInstance} from "fastify";

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent: UserEntity, args, fastify: FastifyInstance) {
        const users = await fastify.db.users.findMany()
        return users.filter(user => user.subscribedToUserIds.includes(parent.id))
      }
    },
    usersSubscribedTo: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent: UserEntity, args, fastify: FastifyInstance) {
        const users = await fastify.db.users.findMany()
        return users.filter(user => parent.subscribedToUserIds.includes(user.id))
      }
    },
    profile: {
      type: ProfileGQLType,
      async resolve(parent: UserEntity, args, fastify: FastifyInstance) {
        return await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id })
      }
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      async resolve(parent: UserEntity, args, fastify: FastifyInstance) {
        return await fastify.db.posts.findMany({ key: 'userId', equals: parent.id })
      }
    },
    memberType: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) }
  })
})

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'createUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const UpdateUserInput = new GraphQLInputObjectType({
  name: 'updateUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const SubscribeUserInput = new GraphQLInputObjectType({
  name: 'subscribeUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const UnSubscribeUserInput = new GraphQLInputObjectType({
  name: 'unSubscribeUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});