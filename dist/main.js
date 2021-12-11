"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApolloServer = require("apollo-server").ApolloServer;
var schema_1 = require("./schema");
var server = new ApolloServer({ schema: schema_1.schema });
server.listen(3000).then(function (_a) { return console.log("Server started successfully"); });
