import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import {axios} from "../../utils/axios";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {ProfileGQLType} from "../profiles/typeGQL";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";
import {PostGQLType} from "../posts/typeGQL";
import {PostEntity} from "../../utils/DB/entities/DBPosts";
import {MemberGQLType} from "../member-types/typeGQL";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent: UserEntity, args) {
        const users = await axios.get<UserEntity[]>('users')
        return users.filter(user => user.subscribedToUserIds.includes(parent.id))
      }
    },
    usersSubscribedTo: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent: UserEntity, args) {
        const users = await axios.get<UserEntity[]>('users')
        return users.filter(user => parent.subscribedToUserIds.includes(user.id))
      }
    },
    profile: {
      type: ProfileGQLType,
      async resolve(parent: UserEntity, args) {
        const profiles = await axios.get<ProfileEntity[]>('profiles')
        return profiles.find(el => el.userId === parent.id)
      }
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      async resolve(parent: UserEntity, args) {
        const posts = await axios.get<PostEntity[]>('posts')
        return posts.filter(post => post.userId === parent.id)
      }
    },
    memberType: {
      type: MemberGQLType,
      async resolve(parent: UserEntity, args) {
        const profiles = await axios.get<ProfileEntity[]>('profiles')
        const profile = profiles.find(el => el.userId === parent.id)
        return await axios.get<MemberTypeEntity>(`member-types/${profile?.memberTypeId}`)
      }
    }
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