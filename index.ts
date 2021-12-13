import { ApolloServer, AuthenticationError } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { schema } from "./schema";

export const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const requestUser = req.headers.from;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: requestUser,
        },
      });
    } catch (error) {
      if (!user) throw new AuthenticationError("you are not authenticated");
      console.log(error);
    }

    return { prisma, user };
  },
});

server
  .listen(8080)
  .then(({ url }: { url: string }) =>
    console.log(`Server started successfully on ${url}`)
  );
