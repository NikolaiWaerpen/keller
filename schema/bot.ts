import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import getAllTrades from "../queries/bot/get-all-trades";
import getEthereumPrice from "../queries/bot/get-ethereum-price";
import { AssetEvent } from "../types/bot/event-type";

type GroupedEventsType = { sell: AssetEvent[]; buy: AssetEvent[] };

export const botTradesObjectType = objectType({
  name: "BotTrades",
  definition(t) {
    t.nonNull.string("tokenId");
    t.nonNull.string("collection");
    t.nonNull.string("link");
    t.nonNull.string("fees");
    t.nonNull.string("buy");
    t.nonNull.string("buyDate");
    t.string("sell");
    t.string("sellDate");
    t.string("profit");
    t.string("profitMargin");
  },
});

export const getBotTrades = inputObjectType({
  name: "GetBotTrades",
  definition: (t) => {
    t.nonNull.list.nonNull.string("addresses");
  },
});

export const botQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("botTrades", {
      type: botTradesObjectType,
      args: { input: nonNull(arg({ type: getBotTrades.name })) },
      resolve: async (_, { input: { addresses } }) => {
        const formattedAddresses = addresses.map((address: string) =>
          address.toLowerCase()
        );

        const tradePromises = formattedAddresses.map((address: string) =>
          getAllTrades(address)
        );
        const allAccountTrades = await Promise.all([...tradePromises]);

        let allTrades: AssetEvent[] = [];
        allAccountTrades.forEach((accountTrades) => {
          allTrades = [...allTrades, ...accountTrades];
        });

        const initial: GroupedEventsType = {
          sell: [],
          buy: [],
        };

        const groupedTrades = allTrades.reduce((accumulator, current) => {
          const sold =
            current.seller &&
            formattedAddresses.includes(current.seller?.address);

          if (sold) accumulator.sell.push(current);
          else accumulator.buy.push(current);

          return accumulator;
        }, initial);

        const formatted = groupedTrades.buy.map((buyTrade) => {
          // some assets don't have the asset field - filter those out
          if (!buyTrade.asset) {
            return {
              tokenId: "N/A",
              collection: "N/A",
              link: "N/A",
              fees: "N/A",
              buy: "N/A",
              buyDate: "N/A",
              sell: null,
              sellDate: null,
              profit: null,
              profitMargin: null,
            };
          }

          const assetId = buyTrade.asset.id;

          const sellTrade = groupedTrades.sell.find((sellTrade) => {
            // short-circuit due to the missing asset field on some events
            if (!sellTrade.asset) return false;
            return sellTrade.asset.id === assetId;
          });

          const decrease = 1000000000000000000;
          const fees =
            buyTrade.asset.asset_contract.seller_fee_basis_points / 100;

          // BUY
          const buy = +buyTrade.total_price,
            buyDate = `${buyTrade.created_date}`;

          // SELL
          const sell = sellTrade ? sellTrade.total_price : null,
            sellDate = sellTrade ? "" + sellTrade.created_date : null;

          const profit = sellTrade
            ? "" +
              (+sellTrade.total_price -
                +buyTrade.total_price -
                (+sellTrade.total_price * fees) / 100) /
                decrease
            : undefined;

          let profitMargin: null | string = null;
          if (profit && sell) {
            profitMargin = "" + (+profit / +sell) * 100;
            profitMargin = profitMargin.slice(0, 12);
          }

          return {
            tokenId: buyTrade.asset.token_id ? buyTrade.asset.token_id : "N/A",
            collection: `${buyTrade.collection_slug}`,
            link: buyTrade.asset.permalink,
            fees: `${fees}`,
            buy: `${buy / decrease}`,
            buyDate,
            sell: sell !== null ? "" + +sell / decrease : sell,
            sellDate,
            profit,
            profitMargin,
          };
        });

        const sortedFormatted = formatted.sort(
          (a, b) => +new Date(b.buyDate) - +new Date(a.buyDate)
        );

        const noFail = sortedFormatted.filter((trade) => trade.buy !== "0.85");

        return noFail;
      },
    });
  },
});
