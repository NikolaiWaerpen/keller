import { ApolloError } from "apollo-server-errors";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { Todo } from "nexus-prisma";
import { prisma } from "../index";

const { $name, id, description, isComplete } = Todo;

const checkForExistingTodo = async (id: number, returnFoundTodo?: boolean) => {
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
  },
});

export const todoQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("todos", {
      type: $name,
      resolve: () => prisma.todo.findMany(),
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

// export const todoMutation = extendType({
//   type: "Mutation",
//   definition: (t) => {
//     t.field("createTodo", {
//       type: $name,
//       args: { input: nonNull(arg({ type: createTodoInput.name })) },
//       resolve: async (_, args) => {
//         const { description } = args.input;

//         return await prisma.todo.create({
//           data: {
//             description,
//           },
//         });
//       },
//     });

//     t.field("editTodo", {
//       type: $name,
//       args: { input: nonNull(arg({ type: editTodoInput.name })) },
//       resolve: async (_, args) => {
//         const { id, description } = args.input;

//         await checkForExistingTodo(id);

//         return await prisma.todo.update({
//           where: { id },
//           data: {
//             description,
//           },
//         });
//       },
//     });

//     t.field("completeTodo", {
//       type: $name,
//       args: { input: nonNull(arg({ type: completeTodoInput.name })) },
//       resolve: async (_, args) => {
//         const { id } = args.input;

//         const foundTodo = await checkForExistingTodo(id, true);

//         return await prisma.todo.update({
//           where: { id },
//           data: {
//             isComplete: !foundTodo?.isComplete,
//           },
//         });
//       },
//     });

//     t.field("deleteTodo", {
//       type: $name,
//       args: { input: nonNull(arg({ type: deleteTodoInput.name })) },
//       resolve: async (_, args) => {
//         const { id } = args.input;

//         await checkForExistingTodo(id);

//         return await prisma.todo.delete({ where: { id } });
//       },
//     });
//   },
// });
