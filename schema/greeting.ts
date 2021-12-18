import { PrismaClient } from "@prisma/client";
import { ApolloError } from "apollo-server-errors";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { Greeting } from "nexus-prisma";

const { $name, id, title, comment, createdAt, author } = Greeting;

const checkForExistingGreeting = async (id: number, prisma: PrismaClient) => {
  const greeting = await prisma.greeting.findUnique({ where: { id } });
  if (!greeting)
    throw new ApolloError(`A greeting with id '${id}' was not found'`);
  return greeting;
};

export const greetingObjectType = objectType({
  name: $name,
  definition(t) {
    t.field(id);
    t.field(title);
    t.field(comment);
    t.field(createdAt);
    t.field(author);
  },
});

// QUERIES

export const greetingQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("greetings", {
      type: $name,
      resolve: async (_, __, { prisma }) => await prisma.greeting.findMany(),
    });
  },
});

// MUTATIONS

export const createGreetingInput = inputObjectType({
  name: "CreateGreetingInput",
  definition: (t) => {
    t.nonNull.string(title.name);
    t.nonNull.string(comment.name);
  },
});

export const editGreetingInput = inputObjectType({
  name: "EditGreetingInput",
  definition: (t) => {
    t.nonNull.int(id.name);
    t.nonNull.string(title.name);
    t.nonNull.string(comment.name);
  },
});

export const deleteGreetingInput = inputObjectType({
  name: "DeleteGreetingInput",
  definition: (t) => {
    t.nonNull.int(id.name);
  },
});

export const greetingMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createGreeting", {
      type: $name,
      args: { input: nonNull(arg({ type: createGreetingInput.name })) },
      resolve: async (_, { input: { title, comment } }, context) => {
        const {
          prisma,
          user: { id },
        } = context;

        return await prisma.greeting.create({
          data: {
            title,
            comment,
            author: {
              connect: {
                id,
              },
            },
          },
        });
      },
    });

    t.field("editGreeting", {
      type: $name,
      args: { input: nonNull(arg({ type: editGreetingInput.name })) },
      resolve: async (_, args, { prisma }) => {
        const { id, title, comment } = args.input;

        await checkForExistingGreeting(id, prisma);

        return await prisma.greeting.update({
          where: { id },
          data: {
            title,
            comment,
          },
        });
      },
    });

    t.field("deleteGreeting", {
      type: $name,
      args: { input: nonNull(arg({ type: deleteGreetingInput.name })) },
      resolve: async (_, { input: { id } }, { prisma }) => {
        await checkForExistingGreeting(id, prisma);

        return await prisma.greeting.delete({ where: { id } });
      },
    });
  },
});
