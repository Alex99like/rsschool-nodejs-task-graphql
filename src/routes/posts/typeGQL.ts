import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

export const PostGQLType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'createPostInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const UpdatePostInput = new GraphQLInputObjectType({
  name: 'updatePostInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});