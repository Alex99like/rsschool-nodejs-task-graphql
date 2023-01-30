import {GraphQLID, GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {ProfileGQLType} from "../profiles/typeGQL";
import {PostGQLType} from "../posts/typeGQL"
import {MemberGQLType} from "../member-types/typeGQL";
import {FastifyInstance} from "fastify";
import {UserService} from "../users/services";
import {ProfileService} from "../profiles/services";
import {PostService} from "../posts/services";
import {MemberTypeService} from "../member-types/services";
import {LoadersType} from "../../dataloader/dataload";

export const RootQuery= async (fastify: FastifyInstance, { usersLoader, profilesLoader, postsLoader, memberTypesLoader }: LoadersType): Promise<GraphQLObjectType> => new GraphQLObjectType({
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
        return await PostService.getAll(fastify)
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberGQLType),
      async resolve() {
        return await MemberTypeService.getAll(fastify)
      },
    },
    user: {
      type: UserGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        return await usersLoader.load(args.id)
        //return await UserService.getById(fastify, args.id)
      },
    },
    profile: {
      type: ProfileGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        return await profilesLoader.load(args.id)
        //return await ProfileService.getById(fastify, args.id)
      },
    },
    post: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: Pick<UserEntity, 'id'>) {
        return await postsLoader.load(args.id)
        //return await PostService.getById(fastify, args.id)
      },
    },
    memberType: {
      type: MemberGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent: UserEntity, args: Pick<UserEntity, 'id'>) {
        return memberTypesLoader.load(args.id)
        //return MemberTypeService.getById(fastify, args.id)
      },
    },
  }
})