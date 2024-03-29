let crypto = require('crypto');
import cuid from 'cuid';
import { unflatten } from 'flat';
import { mutationType, arg, stringArg } from 'nexus'
import { Context } from "../context";
import type { NexusGenUnions } from 'nexus-typegen'
import { hash, verify } from 'argon2'
import { isUserWithRole } from '../permissions';

export const Mutation = mutationType({
  definition(t) {

    t.field("createOneUser", {
      type: "UserMutationResponse",
      authorize: isUserWithRole(["ADMIN"]),
      args: { data: arg({type: "UserCreateInput" }) },
      resolve: async (parent, args, context: Context, info) => {
        let user = await context.db.user.create({
          data: {
            ...args.data,
            password: "",
          }
        });

        if (!user) {
          let output: NexusGenUnions["UserMutationResponse"] = {
            __typename: "UserMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
          return output
        }

        let output: NexusGenUnions["UserMutationResponse"] = {
          __typename: "UserMutationOutput",
          edge: {
            cursor: user.id,
            node: {
              ...user,
            }
          }
        };
        context.pubsub.publish("USERS", output);
        return output;
      }
    });

    t.field("updateOneUser", {
      type: "UserMutationResponse",
      authorize: isUserWithRole(["ADMIN"]),
      args: { 
        data: arg({type: "UserUpdateInput"}),
        where: arg({type: "UserWhereUniqueInput"}),
      },
      resolve: async (_parent, args, context, info) => {
        // TODO FIXME https://github.com/graphql-nexus/nexus/issues/819
        // TODO FIXME https://github.com/graphql-nexus/nexus/issues/439

        
        let user = await context.db.user.update({
          where: {
            id: args.where.id || undefined,
            name: args.where.name || undefined,
          },
          data: {
            id: args.data.id || undefined,
            name: args.data.name || undefined,
            role: args.data.role || undefined,
            password: undefined
          }
        });

        if (!user) {
          let result: NexusGenUnions["UserMutationResponse"] = {
            __typename: "UserMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
          return result
        }

        let output: NexusGenUnions["UserMutationResponse"] = {
          __typename: "UserMutationOutput",
          edge: {
            cursor: user.id,
            node: {
              ...user,
            }
          }
        };
        context.pubsub.publish("USERS", output);
        return output;
      }
    });

    t.field("deleteOneUser", {
      type: "User",
      authorize: isUserWithRole(["ADMIN"]),
      args: {
        where: arg({type: "UserWhereUniqueInput"})
      },
      resolve: async (parent, args, context, info) => {
        return await context.db.user.delete({
          where: {
            id: args.where.id || undefined,
            name: args.where.name || undefined,
          }
        })
      }
    })

    t.field("generatePasswords", {
      type: "QueryUsers_Connection",
      authorize: isUserWithRole(["ADMIN"]),
      resolve: async (parent, args, context, info) => {
        let usersWithoutPassword = await context.db.user.findMany({
          where: {
            password: ""
          }
        })

        for (let user of usersWithoutPassword) {
          user.password = crypto.randomBytes(8).toString("hex");

          await context.db.user.update({
            where: {
              id: user.id
            },
            data: {
              password: await hash(user.password, {
                // TODO FIXME
              }),
            }
          })
        }

        return {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            endCursor: null,
            startCursor: null
          },
          edges: usersWithoutPassword.map((e: any) => { return {
            cursor: e.id,
            node: e,
          }})
        }
      }
    })

    t.field("createOneRunner", {
      type: "RunnerMutationResponse",
      authorize: isUserWithRole(["ADMIN"]),
      args: { data: arg({type: "RunnerCreateInput"}) },
      resolve: async (_parent, args, context, info) => {
        let runner = await context.db.runner.create(args);

        if (!runner) {
          let output: NexusGenUnions["RunnerMutationResponse"] = {
            __typename: "RunnerMutationError",
            nameError: "Fehler bei Erstellung!",
            gradeError: null,
          }
          return output
        }

        let output: NexusGenUnions["RunnerMutationResponse"] = {
          __typename: "RunnerMutationOutput",
          edge: {
            cursor: runner.id,
            node: {
              ...runner,
            }
          }
        };
        return output
      }
    });

    t.field("updateOneRunner", {
      type: "RunnerMutationResponse",
      authorize: isUserWithRole(["ADMIN"]),
      args: { 
        data: arg({type: "RunnerUpdateInput"}),
        where: arg({type: "RunnerWhereUniqueInput"}),
      },
      resolve: async (_parent, args, context, info) => {
        let user = await context.db.runner.update({
          where: {
            id: args.where.id || undefined,
            startNumber: args.where.startNumber || undefined,
            name: args.where.name || undefined,
          },
          data: {
            name: args.data.name || undefined,
            clazz: args.data.clazz || undefined,
            grade: args.data.grade || undefined,
          }
        });

        if (!user) {
          let output: NexusGenUnions["RunnerMutationResponse"] = {
            __typename: "RunnerMutationError",
            nameError: "Fehler bei Aktualisierung!",
            gradeError: null,
          }
          return output
        }

        let output: NexusGenUnions["RunnerMutationResponse"] = {
          __typename: "RunnerMutationOutput",
          edge: {
            cursor: user.id,
            node: {
              ...user,
            }
          }
        };
        context.pubsub.publish("RUNNERS", output);
        return output;
      }
    });

    t.field("createOneRound", {
      type: "CreateRoundMutationResponse",
      authorize: isUserWithRole(["ADMIN", "TEACHER"]),
      args: { data: arg({type: "RoundCreateInput"}) },
      resolve: async (parent, args, context) => {
        try {
          let startNumber = args.data.studentStartNumber;
          let thecuid = cuid();
          let createdById = context.user?.id;

          // TODO FIXME this is supposed to be an transaction but there is no support in prisma and I think none of these should fail
          
          await context.db.$executeRaw`INSERT INTO "Round" (id, "studentId", "createdById") VALUES (${thecuid}, (SELECT id FROM "Runner" WHERE "startNumber" = ${startNumber}), ${createdById});`

          // technically the select id could have a race condition and not find the runner any more. but then updating doesnt matter
          // CAN NOW BE DONE USING PRISMA
          await context.db.$executeRaw`UPDATE "Runner" SET "roundCount" = "roundCount" + 1 WHERE id = (SELECT id FROM "Runner" WHERE "startNumber" = ${startNumber});`
          
          // TODO FIXME replace with normal select?
          let result = await context.db.$queryRaw<object[]>`SELECT "Round".id, "Round"."studentId", "Round"."createdById", "Round".time, "Runner".id AS "Runner.id", "Runner"."startNumber" AS "Runner.startNumber", "Runner".name AS "Runner.name", "Runner".clazz AS "Runner.clazz", "Runner".grade as "Runner.grade", "Runner"."roundCount" AS "Runner.roundCount" FROM "Round", "Runner" WHERE "Runner".id = (SELECT id FROM "Runner" WHERE "startNumber" = ${startNumber}) AND "Round".id = ${thecuid};`
      
          let roundWithRunner = unflatten(result[0], {
            object: false,
          }) as any

          console.log(roundWithRunner)

          // TODO FIXME subscriptions

          let output: NexusGenUnions["CreateRoundMutationResponse"] = {
            __typename: "CreateRoundMutationOutput",
            edge: {
              cursor: roundWithRunner.id,
              node: {
                ...roundWithRunner,
              }
            }
          };
          context.pubsub.publish("ROUNDS", output);
          return output;
        } catch (error) {
          console.log(error);
          let output: NexusGenUnions["CreateRoundMutationResponse"] = {
            __typename: "CreateRoundMutationError",
            startNumberError: "Läufer mit dieser Startnummer nicht gefunden!"
          }
          return output
        }
      },
    });

    t.field("deleteOneRound", {
      type: "Round",
      authorize: isUserWithRole(["ADMIN"]),
      args: {
        where: arg({type: "RoundWhereUniqueInput"})
      },
      resolve: async (parent, args, context) => {
        let round = await context.db.round.delete(args)
        await context.db.$executeRaw`UPDATE "Runner" SET "roundCount" = "roundCount" - 1 WHERE id = ${round.studentId};`
        
        // TODO FIXME subscriptions

        return round
      }
    })

    t.field("deleteOneRunner", {
      type: "Runner",
      authorize: isUserWithRole(["ADMIN"]),
      args: {
        where: arg({type: "RunnerWhereUniqueInput"})
      },
      resolve: async (parent, args, context) => {
        return await context.db.runner.delete({
          where: {
            id: args.where.id || undefined,
            name: args.where.name || undefined,
            startNumber: args.where.startNumber || undefined,
          }
        })
      }
    })

    t.field("login", {
      type: "LoginMutationResponse",
      authorize: () => true,
      args: {
        name: stringArg(),
        password: stringArg(),
      },
      resolve: async (_parent, { name, password }, context) => {
        console.log(context)
        const user = await context.db.user.findUnique({
          where: {
            name,
          },
        });
        if (!user) {
          return {
            __typename: "LoginMutationError",
            usernameError: "Nutzername nicht gefunden!",
            passwordError: null,
          }
        }
        // @ts-ignore
        const passwordValid: boolean = await verify(user.password, password);
        if (!passwordValid) {
          return {
            __typename: "LoginMutationError",
            usernameError: null,
            passwordError: "Passwort falsch!",
          }
        }

        const id = crypto.randomBytes(32).toString("hex");

        let validUntil = new Date();
        validUntil.setHours(validUntil.getHours() + 8);

        let userSession = await context.db.userSession.create({
          data: {
            id,
            user: {
              connect: {
                id: user.id
              },
            },
            validUntil,
          }
        })

        context.response.cookie('id', id, {
            httpOnly: true,
            sameSite: "strict",
            // secure: true, // TODO FIXME
        })
        context.response.cookie('logged-in', "true", {
          sameSite: "strict",
          // secure: true, // TODO FIXME
      })
        return {
          __typename: "User",
          ...user,
        };
      },
    });

    t.field("logout", {
      type: "Boolean",
      authorize: () => true,
      resolve: async (_parent, args, context) => {
        let userSession = await context.db.userSession.delete({
          where: {
            id: context.sessionId!
          }
        })

        context.response.clearCookie('id', {
          httpOnly: true,
          sameSite: "strict",
          // secure: true, // TODO FIXME
        })
        context.response.clearCookie('logged-in', {
          sameSite: "strict",
          // secure: true, // TODO FIXME
        })

        return !!userSession
      },
    });
    
  },
});
