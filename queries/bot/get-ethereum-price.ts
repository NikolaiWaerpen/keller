import fetch from "node-fetch";

type GetEthereumPriceReturnType = {
  NOK: number;
};

export default async function getEthereumPrice(): Promise<GetEthereumPriceReturnType> {
  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=NOK"
    );

    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("failed to fetch");
  }
}
