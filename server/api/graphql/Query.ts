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

    // https://relay.dev/graphql/connections.htm
    // You may order the edges however your business logic dictates,
    // and may determine the ordering based upon additional arguments
    // not covered by this specification. But the ordering must be
    // consistent from page to page, and importantly, The ordering
    // of edges should be the same when using first/after as when
    // using last/before, all other arguments being equal. It should
    // not be reversed when using last/before.

    t.connection("rounds", {
      type: "Round",
      disableBackwardPagination: true,
      additionalArgs: {
        filter: schema.arg({ type: "RoundWhereInput", required: false }),
        orderBy: schema.arg({ type: "RoundOrderByInput" }),
      },
      resolve: async (root, args, ctx, info) => {
        let result = await ctx.db.round.findMany({
          orderBy: args.orderBy,
          where: args.filter === null ? undefined : args.filter,
          take: args.first + 1,
          cursor: args.after === null ? undefined : args.after,
        })
        let pageInfo = {
          hasNextPage: result.length == args.first + 1,
          startCursor: result[0].id,
          endCursor: result[args.first - 1].id,
        };
        result.pop();
        return {
          pageInfo,
          edges: result.map(e => { return {
            cursor: e.id,
            node: e,
          }})
        }
      }
    });

    t.connection("users", {
      type: "User",
      disableBackwardPagination: true,
      resolve: (root, args, ctx, info) => {
        return connectionFromPromisedArray(ctx.db.user.findMany(), args);
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (source, args, ctx) => ctx.db.user.count(args),
        })
      }
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
