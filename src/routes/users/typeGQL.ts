import {GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  })
})