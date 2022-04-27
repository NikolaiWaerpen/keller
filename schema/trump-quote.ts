import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import fetch from "node-fetch";
import { Tags } from "../types/trump-quote/tags";

export const trumpQuoteQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.string("tags", {
      resolve: async () => {
        const tags = await fetch("https://tronalddump.io/tag");

        const tagsJson: Tags = await tags.json();

        const tagValues = tagsJson._embedded.tag.map(({ value }) => value);

        return tagValues;
      },
    });
  },
});

export const sendTrumpQuoteArgs = inputObjectType({
  name: "SendTrumpQuoteInput",
  definition(t) {
    t.nonNull.string("tag");
    t.nonNull.string("recipent");
  },
});

export const trumpQuoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.boolean("sendTrumpQuote", {
      args: { input: nonNull(arg({ type: sendTrumpQuoteArgs.name })) },
      async resolve() {
        return true;
      },
    });
  },
});

// export const getBotTrades = inputObjectType({
//   name: "GetBotTrades",
//   definition: (t) => {
//     t.nonNull.list.nonNull.string("addresses");
//   },
// });

// export const trumpQuoteQuery = extendType({
//   type: "Query",
//   definition: (t) => {
//     t.nonNull.list.nonNull.field("tag", {
//       type: trumpQuoteTag,
//       resolve: async () => {},
//     });
//   },
// });
