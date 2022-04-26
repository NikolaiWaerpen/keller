import { AssetEvent, EventType } from "../../types/bot/event-type";
import openseaFetch, { OPENSEA_ENDPOINT } from "./opensea-fetch";

export default async function getAllTrades(address: string) {
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
