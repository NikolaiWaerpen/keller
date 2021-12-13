import { PrismaClient } from "@prisma/client";
import { ApolloError } from "apollo-server-errors";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { Todo } from "nexus-prisma";

const { $name, id, description, isComplete, author } = Todo;

const checkForExistingTodo = async (
  id: number,
  prisma: PrismaClient,
  returnFoundTodo?: boolean
) => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) throw new ApolloError(`A todo with id '${id}' was not found'`);
  if (returnFoundTodo) return todo;
};

// QUERIES

export const todoObjectType = objectType({
  name: $name,
  definition(t) {
    t.field(id);
    t.field(description);
    t.field(isComplete);
    t.field(author);
  },
});

export const todoQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("todos", {
      type: $name,
      resolve: async (_, __, { prisma }) => await prisma.todo.findMany(),
    });
  },
});

// MUTATIONS

export const createTodoInput = inputObjectType({
  name: "CreateTodoInput",
  definition: (t) => {
    t.nonNull.string(description.name);
  },
});

export const editTodoInput = inputObjectType({
  name: "EditTodoInput",
  definition: (t) => {
    t.nonNull.int(id.name);
    t.nonNull.string(description.name);
  },
});

export const completeTodoInput = inputObjectType({
  name: "CompleteTodoInput",
  definition: (t) => {
    t.nonNull.int(id.name);
  },
});

export const deleteTodoInput = inputObjectType({
  name: "DeleteTodoInput",
  definition: (t) => {
    t.nonNull.int(id.name);
  },
});

export const todoMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createTodo", {
      type: $name,
      args: { input: nonNull(arg({ type: createTodoInput.name })) },
      resolve: async (_, { input: { description } }, context) => {
        const {
          prisma,
          user: { id },
        } = context;

        return await prisma.todo.create({
          data: {
            description,
            author: {
              connect: {
                id,
              },
            },
          },
        });
      },
    });

    t.field("editTodo", {
      type: $name,
      args: { input: nonNull(arg({ type: editTodoInput.name })) },
      resolve: async (_, args, { prisma }) => {
        const { id, description } = args.input;

        await checkForExistingTodo(id, prisma);

        return await prisma.todo.update({
          where: { id },
          data: {
            description,
          },
        });
      },
    });

    t.field("completeTodo", {
      type: $name,
      args: { input: nonNull(arg({ type: completeTodoInput.name })) },
      resolve: async (_, { input: { id } }, { prisma }) => {
        const foundTodo = await checkForExistingTodo(id, prisma, true);

        return await prisma.todo.update({
          where: { id },
          data: {
            isComplete: !foundTodo!.isComplete,
          },
        });
      },
    });

    t.field("deleteTodo", {
      type: $name,
      args: { input: nonNull(arg({ type: deleteTodoInput.name })) },
      resolve: async (_, { input: { id } }, { prisma }) => {
        await checkForExistingTodo(id, prisma);

        return await prisma.todo.delete({ where: { id } });
      },
    });
  },
});
