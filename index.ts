import { ApolloServer, AuthenticationError } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { schema } from "./schema";

export const prisma = new PrismaClient();

function findUser() {}

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const requestUser = req.headers.from,
      isDevelopment = process.env.NODE_ENV === "development";

    if (!requestUser && !isDevelopment)
      throw new AuthenticationError("you are not authenticated");

    if (requestUser) {
      const user = await prisma.user.findUnique({
        where: {
          email: requestUser,
        },
      });

      return { prisma, user };
    }

    // GraphQL playground
    else if (!requestUser && isDevelopment) {
      // TODO: create or update prisma user read on upsert
      const user = {};

      return { prisma, user };
    }
  },
});

server
  .listen(8080)
  .then(({ url }: { url: string }) =>
    console.log(`Server started successfully on ${url}`)
  );
