import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

const resolvers = require('../resolvers');

const schema: () => Promise<GraphQLSchema> = async () => {
  return buildSchema({
    resolvers: Object.keys(resolvers).map((key) => resolvers[key]) as any,
    container: Container,
    validate: true,
  });
};

export default schema;
