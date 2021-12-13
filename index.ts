import { ApolloServer, AuthenticationError } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { schema } from "./schema";

export const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const requestUser = req.headers.from;

    const user = await prisma.user.findFirst({
      where: {
        email: requestUser,
      },
    });

    if (!user) throw new AuthenticationError("you are not authenticated");

    return { prisma, user };
  },
});

server
  .listen(8080)
  .then(({ url }: { url: string }) =>
    console.log(`Server started successfully on ${url}`)
  );
