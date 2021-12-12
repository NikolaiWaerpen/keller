import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { User } from "nexus-prisma";
import { prisma } from "..";

const { $name, id, name, email, image } = User;

export const userObjectType = objectType({
  name: $name,
  definition(t) {
    t.field(id);
    t.field(name);
    t.field(email);
    t.field(image);
  },
});

// QUERY

export const getUserInput = inputObjectType({
  name: "GetUserInput",
  definition: (t) => {
    t.nonNull.string(email.name);
  },
});

export const userQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("user", {
      type: $name,
      args: { input: nonNull(arg({ type: getUserInput.name })) },
      resolve: async (_, args) => {
        const { email } = args.input;

        return await prisma.user.findFirst({
          where: {
            email,
          },
        });
      },
    });
  },
});

// MUTATION

export const createOrUpdateUserInput = inputObjectType({
  name: "CreateOrUpdateUserInput",
  definition: (t) => {
    t.string(image.name);
    t.nonNull.string(name.name);
    t.nonNull.string(email.name);
  },
});

export const userMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createOrUpdateUser", {
      type: $name,
      args: { input: nonNull(arg({ type: createOrUpdateUserInput.name })) },
      resolve: async (_, args) => {
        const { name, email, image } = args.input;

        const userExists = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (userExists)
          return await prisma.user.update({
            data: {
              name,
              email,
              image,
            },
            where: {
              id: userExists.id,
            },
          });

        if (image)
          return await prisma.user.create({
            data: {
              name,
              email,
              image,
            },
          });

        return await prisma.user.create({
          data: {
            name,
            email,
          },
        });
      },
    });
  },
});
