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

export const assetQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.list.field("assets", {
      // @ts-ignore
      type: "Asset",
      // @ts-ignore
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
