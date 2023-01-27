import {GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

export const MemberGQLType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});