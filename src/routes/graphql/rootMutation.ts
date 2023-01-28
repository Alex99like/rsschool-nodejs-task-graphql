import { GraphQLObjectType} from "graphql";
import {
  CreateUserInput,
  SubscribeUserInput,
  UnSubscribeUserInput,
  UpdateUserInput,
  UserGQLType
} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {CreateProfileInput, ProfileGQLType, UpdateProfileInput} from "../profiles/typeGQL";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";
import {CreatePostInput, PostGQLType, UpdatePostInput} from "../posts/typeGQL";
import {PostEntity} from "../../utils/DB/entities/DBPosts";
import {MemberGQLType, UpdateMemberInput} from "../member-types/typeGQL";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";
import {FastifyInstance} from "fastify";
import {checkFieldsToCreateProfile, checkFieldsToUpdateProfile} from "../profiles/services";
import {checkFieldsToCreatePost, checkFieldsToUpdatePost} from "../posts/services";
import {checkFieldsToUpdateMemberTypes} from "../member-types/services";
import {subscribeUserService, unSubscribeUserService} from "../users/services";

export const RootMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addUser: {
      type: UserGQLType,
      args: { input: { type: CreateUserInput } },
      async resolve(
        parent,
        { input }: { input: Omit<UserEntity, 'subscribedToUserIds' | 'id' > }
      ) {
        const { email, lastName, firstName } = input
        const user = await fastify.db.users.create({ email, lastName, firstName })
        if (user) return user
        else throw fastify.httpErrors.badRequest()
      },
    },
    updateUser: {
      type: UserGQLType,
      args: { input: { type: UpdateUserInput } },
      async resolve(
        parent,
        { input }: { input: Omit<UserEntity, 'subscribedToUserIds'> }
      ) {
        const { email, lastName, firstName, id } = input
        const user = await fastify.db.users.change(id, { email, lastName, firstName })
        if (user) return user
        else throw fastify.httpErrors.badRequest()
      },
    },
    addProfile: {
      type: ProfileGQLType,
      args: { input: { type: CreateProfileInput } },
      async resolve(
        parent,
        { input }: { input: Omit<ProfileEntity, 'id'> }
      ) {
        return await checkFieldsToCreateProfile(fastify, input)
      }
    },
    updateProfile: {
      type: ProfileGQLType,
      args: { input: { type: UpdateProfileInput } },
      async resolve(
        parent,
        { input }: { input: Omit<ProfileEntity, 'userId'> }
      ) {
        return await checkFieldsToUpdateProfile(fastify, input)
      }
    },
    addPost: {
      type: PostGQLType,
      args: { input: { type: CreatePostInput } },
      async resolve(
        parent,
        { input }: { input: Omit<PostEntity, 'id'> },
      ) {
        return await checkFieldsToCreatePost(fastify, input)
      }
    },
    updatePost: {
      type: PostGQLType,
      args: { input: { type: UpdatePostInput } },
      async resolve(
        parent,
        { input }: { input: Omit<PostEntity, 'userId'> },
      ) {
        return await checkFieldsToUpdatePost(fastify, input)
      }
    },
    updateMemberType: {
      type: MemberGQLType,
      args: { input: { type: UpdateMemberInput } },
      async resolve(
        parent,
        { input }: { input: MemberTypeEntity },
      ) {
        return await checkFieldsToUpdateMemberTypes(fastify, input)
      },
    },
    subscribeUser: {
      type: UserGQLType,
      args: { input: { type: SubscribeUserInput } },
      async resolve(
        parent,
        { input }: { input: { id: string, userId: string } }
      ) {
        return await subscribeUserService(fastify, input)
      }
    },
    unSubscribeUser: {
      type: UserGQLType,
      args: { input: { type: UnSubscribeUserInput } },
      async resolve(
        parent,
        { input }: { input: { id: string, userId: string } }
      ) {
        return await unSubscribeUserService(fastify, input)
      },
    },
  }
})