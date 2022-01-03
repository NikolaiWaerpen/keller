import { PrismaClient } from "@prisma/client";
import { makeSchema } from "nexus";
import NexusPrismaScalars from "nexus-prisma/scalars";
import path from "path";
import * as greeting from "./greeting";
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
  types: [NexusPrismaScalars, greeting, user],
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus.ts"),
  },
  contextType: {
    export: "ContextType",
    module: path.join(process.cwd(), "schema/index.ts"),
  },
});
