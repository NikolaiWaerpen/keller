import { extendType, objectType } from "nexus";
import openseaFetch, { OPENSEA_ENDPOINT } from "../queries/opensea-fetch";
import { AssetEvent, EventType } from "../types/opensea/event-type";

export const botObjectType = objectType({
  name: "Bot",
  definition(t) {
    t.nonNull.string("collection");
    t.nonNull.string("link");
    t.nonNull.float("fees");
    t.nonNull.string("buy");
    t.nonNull.string("sell");
    t.nonNull.string("profit");
  },
});

async function getAllEvents() {
  let allEvents: AssetEvent[] = [];
  let next = true;
  let cursor = "";

  while (next) {
    const events = await openseaFetch<EventType>(
      OPENSEA_ENDPOINT.events,
      `event_type=successful&account_address=0x1022E8731677efC814b937FB0d1AFc83D9773b20&cursor=${cursor}`
    );

    allEvents = [...allEvents, ...events.asset_events];

    cursor = events.next;

    if (!cursor) next = false;
  }

  return allEvents;
}

export const botQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("bot", {
      type: botObjectType,
      // args: { input: nonNull(arg({ type: getUserInput.name })) },
      resolve: async () => {
        const events = await getAllEvents();

        const something = events.map((event) => {
          return {
            collection: event.collection_slug,
            link: event.asset.permalink,
            fees: event.asset.asset_contract.seller_fee_basis_points / 100,
            buy: "buy",
            sell: "sell",
            profit: "profit",
          };
        });

        return something;
      },
    });
  },
});
