import { seaport } from "../../lib/seaport";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";

export const Asset = objectType({
  name: "Asset",
  definition(t) {
    t.string("name");
    t.string("name");
    t.string("description");
    t.string("imageUrl");
    t.string("imageUrlThumbnail");
  },
});

// QUERY

export const getAssetInput = inputObjectType({
  name: "GetAssetInput",
  definition: (t) => {
    t.nonNull.string("tokenAddress");
    t.nonNull.string("tokenId");
  },
});

export const assetQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.field("asset", {
      type: "Asset",
      args: { input: nonNull(arg({ type: getAssetInput.name })) },
      resolve: async (_, args) => {
        const {
          input: { tokenAddress, tokenId },
        } = args;
        const asset = await seaport.api.getAsset({
          tokenAddress,
          tokenId,
        });

        return asset;
      },
    });
    t.list.field("assets", {
      type: "Asset",
      resolve: async () => {
        const { assets } = await seaport.api.getAssets({
          owner: "0x9f24d0572b848a6771b441f5a58702c047f7556f",
          limit: 50,
        });

        return assets;
      },
    });
  },
});
