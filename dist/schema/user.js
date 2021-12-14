"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userObjectType = void 0;
var nexus_1 = require("nexus");
var nexus_prisma_1 = require("nexus-prisma");
var $name = nexus_prisma_1.User.$name, id = nexus_prisma_1.User.id, name = nexus_prisma_1.User.name, email = nexus_prisma_1.User.email, image = nexus_prisma_1.User.image;
exports.userObjectType = (0, nexus_1.objectType)({
    name: $name,
    definition: function (t) {
        t.field(id);
        t.field(name);
        t.field(email);
        t.field(image);
    },
});
// QUERY
// export const getUserInput = inputObjectType({
//   name: "GetUserInput",
//   definition: (t) => {
//     t.nonNull.string(email.name);
//   },
// });
// export const userQuery = extendType({
//   type: "Query",
//   definition: (t) => {
//     t.nonNull.field("user", {
//       type: $name,
//       args: { input: nonNull(arg({ type: getUserInput.name })) },
//       resolve: async (_, args, { prisma }) => {
//         const { email } = args.input;
//         return await prisma.user.findUnique({
//           where: {
//             email,
//           },
//         });
//       },
//     });
//   },
// });
// MUTATION
// export const createOrUpdateUserInput = inputObjectType({
//   name: "CreateOrUpdateUserInput",
//   definition: (t) => {
//     t.string(image.name);
//     t.nonNull.string(name.name);
//     t.nonNull.string(email.name);
//   },
// });
// export const userMutation = extendType({
//   type: "Mutation",
//   definition: (t) => {
//     t.field("createOrUpdateUser", {
//       type: $name,
//       args: { input: nonNull(arg({ type: createOrUpdateUserInput.name })) },
//       resolve: async (_, args, { prisma }) => {
//         const { name, email, image } = args.input;
//         const userExists = await prisma.user.findFirst({
//           where: {
//             email,
//           },
//         });
//         if (userExists)
//           return await prisma.user.update({
//             data: {
//               name,
//               email,
//               image,
//             },
//             where: {
//               id: userExists.id,
//             },
//           });
//         if (image)
//           return await prisma.user.create({
//             data: {
//               name,
//               email,
//               image,
//             },
//           });
//         return await prisma.user.create({
//           data: {
//             name,
//             email,
//           },
//         });
//       },
//     });
//   },
// });
