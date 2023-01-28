import { GraphQLObjectType} from "graphql";
import {
  CreateUserInput,
  SubscribeUserInput,
  UnSubscribeUserInput,
  UpdateUserInput,
  UserGQLType
} from "../users/typeGQL";
import {axios} from "../../utils/axios";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {CreateProfileInput, ProfileGQLType, UpdateProfileInput} from "../profiles/typeGQL";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";
import {CreatePostInput, PostGQLType, UpdatePostInput} from "../posts/typeGQL";
import {PostEntity} from "../../utils/DB/entities/DBPosts";
import {MemberGQLType, UpdateMemberInput} from "../member-types/typeGQL";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";

export const RootMutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addUser: {
      type: UserGQLType,
      args: { input: { type: CreateUserInput } },
      async resolve(
        parent,
        argv
      ) {
        return await axios.post<UserEntity>('users', argv.input)
      },
    },
    updateUser: {
      type: UserGQLType,
      args: { input: { type: UpdateUserInput } },
      async resolve(
        parent: unknown,
        argv
      ) {
        const user = await axios.pathc<UserEntity>('users', argv.input.id, argv.input)
        if (user.id) return user
        else throw new Error('User Not Found')
      },
    },
    addProfile: {
      type: ProfileGQLType,
      args: { input: { type: CreateProfileInput } },
      async resolve(
        parent,
        argv
      ) {
        const profile = await axios.post<ProfileEntity>('profiles', argv.input)
        if (profile.id) return profile
        else throw new Error('No valid body or userId not Found')
      }
    },
    updateProfile: {
      type: ProfileGQLType,
      args: { input: { type: UpdateProfileInput } },
      async resolve(
        parent,
        argv
      ) {
        const profile = await axios.pathc<ProfileEntity>('profiles', argv.input.id, argv.input)
        if (profile.id) return profile
        else throw new Error('No valid body or userId not Found')
      }
    },
    addPost: {
      type: PostGQLType,
      args: { input: { type: CreatePostInput } },
      async resolve(
        parent,
        argv,
      ) {
        const post = await axios.post<PostEntity>('posts', argv.input)
        if (post.id) return post
        else throw new Error('No valid body or userId not Found')
      }
    },
    updatePost: {
      type: PostGQLType,
      args: { input: { type: UpdatePostInput } },
      async resolve(
        parent,
        argv,
      ) {
        const post = await axios.pathc<PostEntity>('posts', argv.input.id, argv.input)
        if (post.id) return post
        else throw new Error('No valid body')
      }
    },
    updateMemberType: {
      type: MemberGQLType,
      args: { input: { type: UpdateMemberInput } },
      async resolve(
        parent,
        argv,
      ) {
        const memberType = await axios.pathc<MemberTypeEntity>('member-types', argv.input.id, argv.input)
        if (memberType.id) return memberType
        else throw new Error('No valid body')
      },
    },
    subscribeUser: {
      type: UserGQLType,
      args: { input: { type: SubscribeUserInput } },
      async resolve(
        parent,
        argv
      ) {
        const user = await axios.post<UserEntity>(`users/${argv.input.id}/subscribeTo`, argv.input)
        if (user.id) return user
        else throw new Error('No valid body or User not Found')
      },
    },
    unSubscribeUser: {
      type: UserGQLType,
      args: { input: { type: UnSubscribeUserInput } },
      async resolve(
        parent: unknown,
        argv
      ) {
        const user = await axios.post<UserEntity>(`users/${argv.input.id}/unsubscribeFrom`, argv.input)
        if (user.id) return user
        else throw new Error('No valid body or User not Found')
      },
    },
  }
})