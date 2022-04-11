import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import openseaFetch, { OPENSEA_ENDPOINT } from "../queries/opensea-fetch";
import { AssetEvent, EventType } from "../types/opensea/event-type";

type GroupedEventsType = { sell: AssetEvent[]; buy: AssetEvent[] };

export const botObjectType = objectType({
  name: "Bot",
  definition(t) {
    t.nonNull.string("tokenId");
    t.nonNull.string("collection");
    t.nonNull.string("link");
    t.nonNull.string("fees");
    t.nonNull.string("buy");
    t.nonNull.string("sell");
    t.nonNull.string("profit");
  },
});

async function getAllEvents(address: string) {
  let allEvents: AssetEvent[] = [];
  let next = true;
  let cursor = "";

  while (next) {
    const events = await openseaFetch<EventType>(
      OPENSEA_ENDPOINT.events,
      `event_type=successful&limit=300&account_address=${address}&cursor=${cursor}`
    );

    allEvents = [...allEvents, ...events.asset_events];

    cursor = events.next;

    if (!cursor) next = false;
  }

  return allEvents;
}

export const getBotTrades = inputObjectType({
  name: "GetBotTrades",
  definition: (t) => {
    t.nonNull.string("address");
  },
});

export const botQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("botTrades", {
      type: botObjectType,
      args: { input: nonNull(arg({ type: getBotTrades.name })) },
      resolve: async (_, { input: { address } }) => {
        const events = await getAllEvents(address);

        const initial: GroupedEventsType = {
          sell: [],
          buy: [],
        };

        const groupedEvents = events.reduce((accumulator, current) => {
          const sold =
            current.seller?.address.toLowerCase() === address.toLowerCase();

          if (sold) accumulator.sell.push(current);
          else accumulator.buy.push(current);

          return accumulator;
        }, initial);

        const formatted = groupedEvents.buy.map((event) => {
          const tokenId = event.asset.token_id;

          const sellEvent = groupedEvents.sell.find(
            (event) => event.asset.token_id === tokenId
          );

          const decrease = 1000000000000000000;
          const fees = event.asset.asset_contract.seller_fee_basis_points / 100;
          const profit = sellEvent
            ? +sellEvent.total_price -
              +event.total_price -
              (+sellEvent.total_price * fees) / 100
            : "N/A";
          const sell = sellEvent ? +sellEvent.total_price : "not sold";
          const buy = +event.total_price;

          return {
            tokenId,
            collection: `${event.collection_slug}`,
            link: event.asset.permalink,
            fees: `${fees}`,
            buy: `${buy / decrease}`,
            sell: `${typeof sell === "number" ? sell / decrease : sell}`,
            profit: `${
              typeof profit === "number" ? profit / decrease : profit
            }`,
          };
        });

        return formatted;
      },
    });
  },
});
