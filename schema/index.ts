import { makeSchema } from "nexus";
import * as todo from "./todo";
import * as user from "./user";

export const schema = makeSchema({
  types: [todo, user],
});
