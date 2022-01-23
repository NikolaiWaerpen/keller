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

// TODO: Authentication on specific endpoints - such as creating a greeting

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const reqUser = req.headers.from?.split(","),
      isDevelopment = process.env.NODE_ENV === "development";

    // CASE: API call from external source, in production
    if (!reqUser && !isDevelopment)
      throw new AuthenticationError("you are not authenticated"); // find a sleeker implementation for this - only if [""] was not passed in header

    // CASE: API call from external source, in development
    if (!reqUser && isDevelopment) {
      // Not performant, but runs only in development playground
      const birb = {
        name: "Birb",
        email: "birb@kurzgesagt.com",
      };
      const user = await createOrUpdateUser(birb);

      return { prisma, user };
    }

    // CASE: in app, but not logged in
    if (reqUser!.length !== 3) return { prisma };

    // CASE: in app, logged in
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
