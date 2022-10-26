require('dotenv').config();
import 'reflect-metadata';

import http from 'http';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import Container from 'typedi';
import { createConnection, useContainer } from 'typeorm';

import buildSchema from './configure/schema';
// eslint-disable-next-line import/no-named-as-default
import getTypeOrmConfig from './configure/typeorm.config';
import { MyContext } from './types/types';

const main = async () => {
  useContainer(Container);

  const connectionOptions = await getTypeOrmConfig();
  const conn = await createConnection(connectionOptions);
  await conn.runMigrations();

  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: '*',
      methods: '*',
    })
  );

  const apolloServer = new ApolloServer<MyContext>({
    schema: await buildSchema(),
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 8080 }, resolve)
  );

  // eslint-disable-next-line no-console
  console.log('server started on localhost:8080');
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err);
});
