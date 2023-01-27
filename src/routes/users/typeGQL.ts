import {GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
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

export const subscribeUserInput = new GraphQLInputObjectType({
  name: 'subscribeUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const unSubscribeUserInput = new GraphQLInputObjectType({
  name: 'unSubscribeUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});