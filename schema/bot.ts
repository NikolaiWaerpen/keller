import { extendType, objectType } from "nexus";
import openseaFetch, { OPENSEA_ENDPOINT } from "../queries/opensea-fetch";
import { AssetEvent, EventType } from "../types/opensea/event-type";

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

const address = "0x1022E8731677efC814b937FB0d1AFc83D9773b20";

async function getAllEvents() {
  let allEvents: AssetEvent[] = [];
  let next = true;
  let cursor = "";

  while (next) {
    const events = await openseaFetch<EventType>(
      OPENSEA_ENDPOINT.events,
      `event_type=successful&account_address=${address}&cursor=${cursor}`
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

        const sellEvents = events.filter(
          (event) =>
            event.seller?.address.toLowerCase() === address.toLowerCase()
        );
        const buyEvents = events.filter(
          (event) =>
            event.seller?.address.toLowerCase() !== address.toLowerCase()
        );

        const groupedEvents = buyEvents.map((event) => {
          const tokenId = event.asset.token_id;

          const sellEvent = sellEvents.find(
            (event) => event.asset.token_id === tokenId
          );

          const decrease = 100000000000000000;

          const fees = event.asset.asset_contract.seller_fee_basis_points / 100;

          const profit = sellEvent
            ? (+sellEvent.total_price -
                +event.total_price -
                (+sellEvent.total_price * fees) / 100) /
              decrease
            : "N/A";

          const sell = sellEvent
            ? +sellEvent.total_price / decrease
            : "not sold";

          const buy = `${+event.total_price / decrease}`;

          return {
            tokenId,
            collection: `${event.collection_slug}`,
            link: event.asset.permalink,
            fees: `${fees}`,
            buy: `${buy}`,
            sell: `${sell}`,
            profit: `${profit}`,
          };
        });

        return groupedEvents;

        const something = events.map((event) => {
          return {
            tokenId: "someting",
            collection: event.collection_slug,
            link: event.asset.permalink,
            fees: `${event.asset.asset_contract.seller_fee_basis_points / 100}`,
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
