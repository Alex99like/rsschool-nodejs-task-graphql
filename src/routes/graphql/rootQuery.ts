import {GraphQLID, GraphQLList, GraphQLObjectType} from "graphql";
import {UserGQLType} from "../users/typeGQL";
import {UserEntity} from "../../utils/DB/entities/DBUsers";
import {axios} from "../../utils/axios";
import fetch from "node-fetch";

export const RootQuery: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      async resolve() {
        return await axios.get<UserEntity[]>('users')
      }
    },
    user: {
      type: UserGQLType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const response = await fetch(`http://127.0.0.1:3000/users/${args.id}`);

        return await response.json();
      },
    },
  }
})