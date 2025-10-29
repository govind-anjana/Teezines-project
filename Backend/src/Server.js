// src/Server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import app from "./app.js";
import ConnectionData from "./config/Db.js"; // adjust if needed
import { typeDefs, resolvers } from "./graphql/schema.js";

const PORT = process.env.PORT || 8000;

//  Connect Database
ConnectionData();

//  Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

await server.start();

//  Apply Apollo Middleware
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressMiddleware(server)
);

//  Start Express
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
