import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {graphql, GraphQLSchema} from "graphql";
import {RootQuery} from "./rootQuery";
import {RootMutation} from "./rootMutation";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const schema = new GraphQLSchema({
        query: await RootQuery(fastify),
        mutation: RootMutation
      })

      const { query, variables } = request.body;

      if (query) {
        if (variables) {
          const result = await graphql({
            schema,
            source: query,
            variableValues: variables,
          });

          return reply.send(result);
        }

        const result = await graphql({ schema, source: query });
        return reply.send(result);
      }
    }
  );
};

export default plugin;
