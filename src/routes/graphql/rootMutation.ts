import { GraphQLObjectType} from "graphql";
import {CreateUserInput, UserGQLType} from "../users/typeGQL";
//import fetch from "node-fetch";
import {axios} from "../../utils/axios";
import {UserEntity} from "../../utils/DB/entities/DBUsers";

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
  }
})