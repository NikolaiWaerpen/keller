import { PrismaClient } from "@prisma/client";
import { makeSchema } from "nexus";
import NexusPrismaScalars from "nexus-prisma/scalars";
import path from "path";
import * as greeting from "./greeting";
import * as user from "./user";
import * as bot from "./bot";
import * as runBot from "./run-bot";
import * as trumpQuote from "./trump-quote";

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
  types: [NexusPrismaScalars, greeting, user, bot, runBot, trumpQuote],
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus.ts"),
  },
  contextType: {
    export: "ContextType",
    module: path.join(process.cwd(), "schema/index.ts"),
  },
});
