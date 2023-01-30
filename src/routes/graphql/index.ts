import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {graphql, GraphQLSchema, validate, parse} from "graphql";
import {RootQuery} from "./rootQuery";
import {RootMutation} from "./rootMutation";
import * as depthLimit from "graphql-depth-limit";
import {createLoaders} from "../../dataloader/dataload";

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

      const loaders = createLoaders(fastify)

      const schema = new GraphQLSchema({
        query: await RootQuery(fastify, loaders),
        mutation: await RootMutation(fastify),
      })

      const { query, variables } = request.body;

      const errors = validate(schema, parse(query!), [depthLimit(6)]);

      if (errors.length > 0) {
        return {
          errors: errors,
          data: null,
        };
      }

      if (query) {
        if (variables) {
          return  await graphql({ schema, source: query, variableValues: variables, contextValue: fastify });
        }

        return await graphql({ schema, source: query, contextValue: fastify });
      }
    }
  );
};

export default plugin;
