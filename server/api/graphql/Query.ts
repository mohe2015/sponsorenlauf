import { objectType, extendInputType, queryType, arg, idArg, nonNull, nullable } from 'nexus'
import { Runner } from '@prisma/client';
import { decode } from "../relay-tools-custom";
import { isUserWithRole } from '../permissions';

export const ClassRunner = objectType({
  name: "ClassRunner",
  definition(t) {
    t.string("class", {
      authorize: isUserWithRole(["ADMIN"]),
    })
    t.list.field("runners", {
      type: "Runner",
      authorize: isUserWithRole(["ADMIN"]),
    })
  }
})

export const Query = queryType({
  definition(t) {

    t.field("me", {
      type: "User",
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      resolve: (parent, args, ctx) => {
        return ctx.user!;
      },
    });

    // TODO FIXME proper pagination that is also effizient
    // useful https://github.com/graphql/graphql-relay-js/issues/94#issuecomment-232410564
    t.connectionField("runners", {
      type: "Runner",
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      disableBackwardPagination: true,
      additionalArgs: {
        orderBy: arg({ type: "RunnerOrderByInput" }),
      },
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.runner.findMany({
          orderBy: args.orderBy,
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        let pageInfo = {
          hasPreviousPage: false, // TODO FIXME
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



    // https://relay.dev/graphql/connections.htm
    // You may order the edges however your business logic dictates,
    // and may determine the ordering based upon additional arguments
    // not covered by this specification. But the ordering must be
    // consistent from page to page, and importantly, The ordering
    // of edges should be the same when using first/after as when
    // using last/before, all other arguments being equal. It should
    // not be reversed when using last/before.

    t.connectionField("rounds", {
      type: "Round",
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      disableBackwardPagination: true,
      additionalArgs: {
        filter: nullable(arg({ type: "RoundWhereInput" })),
        orderBy: arg({ type: "RoundOrderByInput" }),
      },
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.round.findMany({
          orderBy: args.orderBy,
          where: args.filter === null ? undefined : args.filter,
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        let pageInfo = {
          hasPreviousPage: false, // TODO FIXME
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

    t.connectionField("users", {
      type: "User",
      authorize: isUserWithRole(["ADMIN"]),
      disableBackwardPagination: true,
      resolve: async (root, args, ctx) => {
        let result = await ctx.db.user.findMany({
          take: args.first + 1,
          cursor: args.after ? { id: args.after } : undefined,
        })
        console.log(result)
        let pageInfo = {
          hasPreviousPage: false, // TODO FIXME
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
            node: {
              ...e,
              password: "-"
            },
          }})
        }
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (source, args, ctx) => ctx.db.user.count(args),
        })
      }
    })

    t.nullable.field("user", {
      type: "User",
      authorize: isUserWithRole(["ADMIN"]),
      args: {
        where: arg({type: "UserWhereUniqueInput"}),
      },
      resolve: async (root, args, context) => {
        return await context.db.user.findUnique({
          where: {
            id: args.where.id || undefined,
            name: args.where.name || undefined,
          },
        })
      }
    })

    t.nullable.field("runner", {
      type: "Runner",
      authorize: isUserWithRole(["ADMIN"]),
      args: {
        where: arg({type: "RunnerWhereUniqueInput"}),
      },
      resolve: async (root, args, context) => {
        return await context.db.runner.findUnique({
          where: {
            id: args.where.id || undefined,
            name: args.where.name || undefined,
            startNumber: args.where.startNumber || undefined,
          },
        })
      }
    })


    t.list.field("runnersByClass", {
      type: "ClassRunner",
      authorize: isUserWithRole(["ADMIN"]),
      resolve: async (root, args, context) => {
        let runners = await context.db.runner.findMany({
          orderBy: [{
            clazz: "asc",
          }, {
            startNumber: "asc",
          }]
        })
        let initialValue: { [clazz: string]: Runner[]} = {};
        
        let groupedRunners: { [clazz: string]: Runner[]} = runners.reduce((accumulator: { [clazz: string]: Runner[]}, currentValue: Runner) => {
          (accumulator[currentValue.clazz] = accumulator[currentValue.clazz] ?? []).push(currentValue)
          return accumulator
        }, initialValue);

        return Object.entries(groupedRunners).map(function([key, value]) {
          return {
            class: key,
            runners: value
          }
        });
      }
    })

    t.field("node", {
      type: "Node",
      authorize: () => false,
      args: { id: idArg() },
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
