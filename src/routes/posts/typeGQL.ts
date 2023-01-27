import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {axios} from "../../utils/axios";
import {UserGQLType} from "../users/typeGQL";
import {PostEntity} from "../../utils/DB/entities/DBPosts";

export const PostGQLType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    userId: {
      type: new GraphQLList(UserGQLType),
      async resolve(parent: PostEntity, args) {
        return  await axios.get<UserEntity>(`posts/${parent.userId}`)
      }
    },
  }),
});

export const addPostInput = new GraphQLInputObjectType({
  name: 'addPostInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const updatePostInput = new GraphQLInputObjectType({
  name: 'updatePostInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});