import { schema } from "nexus";
import { decode } from "../relay-tools-custom";
import { connectionFromPromisedArray } from "graphql-relay";

schema.queryType({
  definition(t) {
    t.field("me", {
      type: "User",
      nullable: false,
      resolve: (parent, args, ctx) => {
        return ctx.user;
      },
    });

    t.crud.runners({
      alias: "jojo",
      pagination: true,
      filtering: true,
      ordering: true,
    })

    // https://github.com/graphql/graphql-relay-js/issues/94#issuecomment-232410564
    // TODO FIXME https://nexus.js.org/docs/plugin-connection
    // currentIndex needs to be provided for pagination information
    // pagination maybe depending on cursor and not offset (see base64 decode of cursor)
    t.connection("runners", {
      type: "Runner",
      disableBackwardPagination: true,
      resolve: (root, args, ctx, info) => {
        return connectionFromPromisedArray(ctx.db.runner.findMany(), args);
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (source, args, ctx) => ctx.db.runner.count(args),
        })
      }
    });

    t.connection("rounds", {
      type: "Round",
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.round.findMany();
      },
    });

    t.connection("users", {
      type: "User",
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.user.findMany();
      },
    })

    t.field("node", {
      type: "Node",
      args: { id: schema.idArg({ required: true }) },
      resolve: (root, args, context, info) => {
        const { id, __typename } = decode(args.id);
        const objeto = __typename.charAt(0).toLowerCase() + __typename.slice(1); // from TitleCase to camelCase
        return {
          // @ts-ignore
          ...context.db[objeto].findOne({ where: { id } }),
          __typename,
        };
      },
    });
  },
});
