import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { schema } from "./schema";

export const prisma = new PrismaClient();

const server = new ApolloServer({ schema });

server
  .listen(8080)
  .then(({ url }: { url: string }) =>
    console.log(`Server started successfully on ${url}`)
  );
