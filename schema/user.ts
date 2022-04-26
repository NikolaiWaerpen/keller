import { ApolloError } from "apollo-server";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { User } from "nexus-prisma";

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
      resolve: async (_, args, { prisma }) => {
        const { email } = args.input;

        const foundUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!foundUser)
          throw new ApolloError(`A user with email '${email}' was not found'`);

        return foundUser;
      },
    });
    t.nonNull.list.nonNull.field("users", {
      type: $name,
      resolve: async (_, __, { prisma }) => {
        const users = await prisma.user.findMany();

        if (!users) throw new ApolloError(`A users not found'`);

        return users;
      },
    });
  },
});

// MUTATION

// export const updatePublicAddressInput = inputObjectType({
//   name: "UpdatePublicAddressInput",
//   definition: (t) => {
//     t.nonNull.string("email");
//     t.nonNull.string("publicAddress");
//   },
// });

// export const userMutation = extendType({
//   type: "Mutation",
//   definition: (t) => {
//     t.field("updatePublicAddress", {
//       type: $name,
//       args: { input: nonNull(arg({ type: updatePublicAddressInput.name })) },
//       resolve: async (_, args, { prisma }) => {
//         const { email, publicAddress } = args.input;

//         return await prisma.user.update({
//           where: {
//             email,
//           },
//           data: {
//             publicAddress,
//           },
//         });
//       },
//     });
//   },
// });
