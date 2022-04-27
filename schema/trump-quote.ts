import { arg, extendType, inputObjectType, nonNull } from "nexus";
import fetch from "node-fetch";
import { SMSRecipientType } from "../queries/gateway/send-sms";
import { QuotesType } from "../types/trump-quote/quotes";
import { Tags } from "../types/trump-quote/tags";
import formatDate from "../utils/format-date";

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
    t.nonNull.string("sendTrumpQuote", {
      args: { input: nonNull(arg({ type: sendTrumpQuoteArgs.name })) },
      async resolve(_, args) {
        const {
          input: { recipent, tag },
        } = args;

        const recipients: SMSRecipientType[] = [{ msisdn: parseInt(recipent) }];

        const url = new URL("https://tronalddump.io/search/quote");
        url.searchParams.set("tag", tag);

        const quotes = await fetch(url);
        if (quotes.status !== 200) throw new Error("failed");
        const jsonQuotes: QuotesType = await quotes.json();

        const randomQuote =
          jsonQuotes._embedded.quotes[
            Math.floor(Math.random() * jsonQuotes.count)
          ];

        const message = `${randomQuote.value.replaceAll(
          "’",
          "'"
        )} // ’ is not a valid char over text

- Trump ${formatDate({
          date: new Date(randomQuote.appeared_at),
          format: "YYYY",
        })}`;

        // await sendSMS({ message, recipients, sender: "The Donald" });

        return "Check your SMS!";
      },
    });
  },
});
