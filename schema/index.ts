import { makeSchema } from "nexus";
import * as todos from "./todos";

export const schema = makeSchema({
  types: [todos],
});
