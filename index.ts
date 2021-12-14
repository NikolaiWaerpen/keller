import { ApolloServer, AuthenticationError } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { schema } from "./schema";

export const prisma = new PrismaClient();

type User = {
  id?: number;
  name: string;
  email: string;
  image?: string;
};

async function createOrUpdateUser({ id, name, email, image }: User) {
  return await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      email,
      image,
    },
    create: {
      name,
      email,
      image,
    },
  });
}

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const reqUser = req.headers.from?.split(","),
      isDevelopment = process.env.NODE_ENV === "development";

    if (!reqUser && !isDevelopment)
      throw new AuthenticationError("you are not authenticated");

    if (!reqUser && isDevelopment) {
      // RUNS ON GraphQL playground, not performant, but is only relevant in playground
      const birb = {
        name: "Birb",
        email: "birb@kurzgesagt.com",
      };
      const user = await createOrUpdateUser(birb);

      return { prisma, user };
    }

    if (reqUser!.length !== 3 && !isDevelopment)
      throw new AuthenticationError(
        "proper user credentials not passed in header"
      );

    const reqUserFormatted = {
      email: reqUser![0],
      name: reqUser![1],
      image: reqUser![2],
    };

    const user = await createOrUpdateUser(reqUserFormatted);

    return { prisma, user };
  },
});

server
  .listen(4000)
  .then(({ url }: { url: string }) =>
    console.log(`server started successfully on ${url}`)
  );
