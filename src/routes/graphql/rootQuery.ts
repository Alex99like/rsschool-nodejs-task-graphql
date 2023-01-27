import {GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {axios} from "../../utils/axios";

export const RootQuery: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      async resolve() {
        return  await axios<UserEntity[]>('users')
      }
    }
  }
})