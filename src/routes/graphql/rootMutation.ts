import { GraphQLObjectType} from "graphql";
import {CreateUserInput, UserGQLType} from "../users/typeGQL";
import fetch from "node-fetch";

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
        const { firstName, lastName, email } = argv.input;
        const body = JSON.stringify({ firstName, lastName, email });
        const response = await fetch(`http://127.0.0.1:3000/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });

        return await response.json();
      },
    },
  }
})