import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { SubscriptionServer } from "subscriptions-transport-ws";
import express from 'express';
import http from 'http';
import dotenv from 'dotenv'
import connectDB from './config/db';
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'
import * as AppModels from './models'
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema'
// import { permissions } from './graphql/authentications/permissions'
// import AuthMiddleware from './middlewares/auth'
import { execute, subscribe } from 'graphql'
const { PubSub } = require("graphql-subscriptions");
dotenv.config();
const pubsub = new PubSub();
//uploading images 


async function startApolloServer(typeDefs, resolvers) {

  connectDB()
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  // app.use(AuthMiddleware);
  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect(a) {
      console.log(a);
    },
  }, {
    server: httpServer,
    path: "/",
  });
  
  const server = new ApolloServer({
    schema: applyMiddleware(schema, 
      // permissions
      ),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
    context: ({ req }) => {
      const { user } = req;
      return { ...AppModels,
         req, 
         user, 
         pubsub };
    }
  });
  await server.start();
  server.applyMiddleware({
    app,
    // permissions,
    path: '/'
  });


  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}


startApolloServer(typeDefs, resolvers);