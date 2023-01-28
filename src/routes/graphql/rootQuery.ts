import {GraphQLID, GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {axios} from "../../utils/axios";
import {ProfileGQLType} from "../profiles/typeGQL";
import {ProfileEntity} from "../../utils/DB/entities/DBProfiles";
import {PostGQLType} from "../posts/typeGQL";
import {PostEntity} from "../../utils/DB/entities/DBPosts";
import {MemberGQLType} from "../member-types/typeGQL";
import {MemberTypeEntity} from "../../utils/DB/entities/DBMemberTypes";

export const RootQuery: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent, args) {
        return await axios.get<UserEntity[]>('users')
      }
    },
    profiles: {
      type: new GraphQLList(ProfileGQLType),
      async resolve() {
        return await axios.get<ProfileEntity[]>(`profiles`);
      },
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      async resolve() {
        return await axios.get<PostEntity[]>('posts');
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberGQLType),
      async resolve() {
        return await axios.get<MemberTypeEntity[]>('member-types');
      },
    },
    user: {
      type: UserGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const user = await axios.get<UserEntity>(`users/${args.id}`)
        if (user.id) return user
        else throw new Error('User not Found')
      },
    },
    profile: {
      type: ProfileGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const profile = await axios.get<ProfileEntity>(`profiles/${args.id}`);
        if (profile.id) return profile
        else throw new Error('Profile not Found')
      },
    },
    post: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const post = await axios.get<PostEntity>(`posts/${args.id}`);
        if (post.id) return post
        else throw new Error('Post not Found')
      },
    },
    memberType: {
      type: MemberGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent: UserEntity, args: Record<'id', string>) {
        const memberTypes = await axios.get<MemberTypeEntity>(`member-types/${args.id}`);

        if (memberTypes.id) return memberTypes
        else throw new Error('MemberType not Found')
      },
    },
  }
})