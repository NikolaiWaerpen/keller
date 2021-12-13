import { PrismaClient } from "@prisma/client";
import { makeSchema } from "nexus";
import path from "path";
import * as todo from "./todo";
import * as user from "./user";

export type ContextType = {
  prisma: PrismaClient;
  user: {
    id: number;
    name: string;
    email: string;
    image: string;
  };
};

export const schema = makeSchema({
  types: [todo, user],
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus.ts"),
  },
  contextType: {
    export: "ContextType",
    module: path.join(process.cwd(), "schema/index.ts"),
  },
});
