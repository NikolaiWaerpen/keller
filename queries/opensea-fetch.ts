import { OPENSEA_API_URL } from "../consts";
import fetch from "node-fetch";

export enum OPENSEA_ENDPOINT {
  assets = "assets",
  events = "events",
  collection = "collection",
  "asset-contract" = "asset-contract",
}

export default async function openseaFetch<TResponse>(
  endpoint: OPENSEA_ENDPOINT,
  params: string
): Promise<TResponse> {
  const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;

  if (!OPENSEA_API_KEY) throw new Error("missing OpenSea API key");

  const url = `${OPENSEA_API_URL}/${endpoint}?${params}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": OPENSEA_API_KEY,
      },
    });

    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("failed to fetch");
  }
}
