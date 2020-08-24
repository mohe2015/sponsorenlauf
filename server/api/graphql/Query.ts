import { schema } from "nexus";
import { decode } from "../relay-tools-custom";
import { Runner } from "nexus-plugin-prisma/client";

schema.extendInputType({
  type: "RunnerOrderByInput",
  definition(t) {
    t.field("roundCount", {
      type: "SortOrder",
      nullable: true,
    })
  }
})

schema.objectType({
  name: "ClassRunners",
  definition(t) {
    t.string("class")
    t.list.field("runners", {
      type: "Runner",
    })
  }
})

schema.queryType({
  definition(t) {
    t.field("me", {
      type: "User",
      nullable: false,
      resolve: (parent, args, ctx) => {
        return ctx.user;
      },
    });


    // https://github.com/graphql/graphql-relay-js/issues/94#issuecomment-232410564
    // TODO FIXME https://nexus.js.org/docs/plugin-connection
    // currentIndex needs to be provided for pagination information
    // pagination maybe depending on cursor and not offset (see base64 decode of cursor)
    t.connection("runners", {
      type: "Runner",
      disableBackwardPagination: true,
      additionalArgs: {
        orderBy: schema.arg({ type: "RunnerOrderByInput" }),
      },
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.runner.findMany({
          orderBy: args.orderBy,
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        let pageInfo = {
          hasNextPage: result.length == args.first + 1,
          startCursor: result.length == 0 ? null : result[0].id,
          endCursor: result.length == 0 ? null : (result.length <= args.first ? result[result.length - 1].id : result[args.first - 1].id),
        };
        if (result.length == args.first + 1) {
          result.pop();
        }
        return {
          pageInfo,
          edges: result.map(e => { return {
            cursor: e.id,
            node: e,
          }})
        }
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (source, args, ctx) => ctx.db.runner.count(args),
        })
      }
    });

    t.crud.runners({
      alias: "_hidden_runners",
      filtering: true,
      ordering: true,
    })

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
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.round.findMany({
          orderBy: args.orderBy,
          where: args.filter === null ? undefined : args.filter,
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        let pageInfo = {
          hasNextPage: result.length == args.first + 1,
          startCursor: result.length == 0 ? null : result[0].id,
          endCursor: result.length == 0 ? null : (result.length <= args.first ? result[result.length - 1].id : result[args.first - 1].id),
        };
        if (result.length == args.first + 1) {
          result.pop();
        }
        return {
          pageInfo,
          edges: result.map(e => { return {
            cursor: e.id,
            node: e,
          }})
        }
      }
    });

    t.crud.rounds({
      alias: "_hidden_rounds",
      filtering: true,
    })

    t.connection("users", {
      type: "User",
      disableBackwardPagination: true,
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.user.findMany({
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        console.log(result)
        let pageInfo = {
          hasNextPage: result.length == args.first + 1,
          startCursor: result.length == 0 ? null : result[0].id,
          endCursor: result.length == 0 ? null : (result.length <= args.first ? result[result.length - 1].id : result[args.first - 1].id),
        };
        if (result.length == args.first + 1) {
          result.pop();
        }
        return {
          pageInfo,
          edges: result.map(e => { return {
            cursor: e.id,
            node: e,
          }})
        }
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (source, args, ctx) => ctx.db.user.count(args),
        })
      }
    })

    t.crud.user({
      type: "User"
    })

    t.crud.runner({
      type: "Runner"
    })

    t.field("runnersByClass", {
      type: "ClassRunners",
      list: true,
      resolve: async (root, args, context) => {
        let runners = await context.db.runner.findMany({
          orderBy: {
            clazz: "asc",
          },
        })
        let initialValue: { [clazz: string]: Runner[]} = {};
        
        runners.reduce((accumulator: { [clazz: string]: Runner[]}, currentValue: Runner) => {
          (accumulator[currentValue.clazz] ??= []).push(currentValue)
          return accumulator
        }, initialValue)


        return null;
      }
    })

    t.field("node", {
      type: "Node",
      args: { id: schema.idArg({ required: true }) },
      resolve: (root, args, context) => {
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
