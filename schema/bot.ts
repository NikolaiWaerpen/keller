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
    t.nonNull.string("sell");
    t.nonNull.string("sellDate");
    t.nonNull.string("profit");
    t.nonNull.string("nokProfit");
  },
});

export const getBotTrades = inputObjectType({
  name: "GetBotTrades",
  definition: (t) => {
    t.nonNull.string("address");
  },
});

export const netProfitObjectType = objectType({
  name: "NetProfit",
  definition(t) {
    t.nonNull.string("netProfitTotal");
    t.nonNull.string("netProfitTotalNok");
  },
});

export const getNetProfit = inputObjectType({
  name: "GetNetProfit",
  definition: (t) => {
    t.nonNull.string("address");
  },
});

export const botQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("botTrades", {
      type: botTradesObjectType,
      args: { input: nonNull(arg({ type: getBotTrades.name })) },
      resolve: async (_, { input: { address } }) => {
        const [allTrades, ethereumPrice] = await Promise.all([
          getAllTrades(address),
          getEthereumPrice(),
        ]);

        const initial: GroupedEventsType = {
          sell: [],
          buy: [],
        };

        const groupedTrades = allTrades.reduce((accumulator, current) => {
          const sold =
            current.seller?.address.toLowerCase() === address.toLowerCase();

          if (sold) accumulator.sell.push(current);
          else accumulator.buy.push(current);

          return accumulator;
        }, initial);

        const formatted = groupedTrades.buy.map((buyTrade) => {
          const tokenId = buyTrade.asset.token_id;

          const sellTrade = groupedTrades.sell.find(
            (buyTrade) => buyTrade.asset.token_id === tokenId
          );

          const decrease = 1000000000000000000;
          const fees =
            buyTrade.asset.asset_contract.seller_fee_basis_points / 100;
          const profit = sellTrade
            ? (+sellTrade.total_price -
                +buyTrade.total_price -
                (+sellTrade.total_price * fees) / 100) /
              decrease
            : "N/A";

          // BUY
          const buy = +buyTrade.total_price,
            buyDate = `${buyTrade.created_date}`;

          // SELL
          const sell = sellTrade ? +sellTrade.total_price : "N/A",
            sellDate = `${sellTrade ? sellTrade.created_date : "N/A"}`;

          return {
            tokenId,
            collection: `${buyTrade.collection_slug}`,
            link: buyTrade.asset.permalink,
            fees: `${fees}`,
            buy: `${buy / decrease}`,
            buyDate,
            sell: `${typeof sell === "number" ? sell / decrease : sell}`,
            sellDate,
            profit: `${profit}`,
            nokProfit: `${
              typeof profit === "number" ? profit * +ethereumPrice.NOK : profit
            }`,
          };
        });

        return formatted;
      },
    });

    t.nonNull.field("netProfit", {
      type: netProfitObjectType,
      args: { input: nonNull(arg({ type: getNetProfit.name })) },
      resolve: async (_, { input: { address } }) => {
        const [allTrades, ethereumPrice] = await Promise.all([
          getAllTrades(address),
          getEthereumPrice(),
        ]);

        const initial: GroupedEventsType = {
          sell: [],
          buy: [],
        };

        const groupedTrades = allTrades.reduce((accumulator, current) => {
          const sold =
            current.seller?.address.toLowerCase() === address.toLowerCase();

          if (sold) accumulator.sell.push(current);
          else accumulator.buy.push(current);

          return accumulator;
        }, initial);

        const profits = groupedTrades.buy.map((buyTrade) => {
          const tokenId = buyTrade.asset.token_id;

          const sellTrade = groupedTrades.sell.find(
            (buyTrade) => buyTrade.asset.token_id === tokenId
          );

          const decrease = 1000000000000000000;
          const fees =
            buyTrade.asset.asset_contract.seller_fee_basis_points / 100;

          const profit = sellTrade
            ? (+sellTrade.total_price -
                +buyTrade.total_price -
                (+sellTrade.total_price * fees) / 100) /
              decrease
            : undefined;

          return profit;
        });

        const trades = profits.filter((profit) => profit) as number[];

        const netProfitTotal = trades.reduce((accumulator, current) => {
          accumulator += current;
          return accumulator;
        }, 0);

        const netProfitTotalNok = netProfitTotal * ethereumPrice.NOK;

        return {
          netProfitTotal: "" + netProfitTotal,
          netProfitTotalNok: "" + netProfitTotalNok,
        };
      },
    });
  },
});
