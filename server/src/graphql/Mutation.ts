import { hash, compare } from "bcrypt";
let crypto = require('crypto');
import cuid from 'cuid';
import { flatten, unflatten } from 'flat';
import { mutationType, arg, stringArg } from '@nexus/schema'

import { RoundGetPayload } from '@prisma/client'

type RoundWithRunner = RoundGetPayload<{
  include: { student: true }
}>

export const Mutation = mutationType({
  definition(t) {

    t.field("createOneUser", {
      type: "UserMutationResponse",
      nullable: false,
      args: { data: arg({type: "UserCreateInput", nullable: false}) },
      resolve: async (parent, args, context, info) => {
        let user = await context.db.user.create({
          data: {
            ...args.data,
            password: "",
          }
        });

        if (!user) {
          return {
            __typename: "UserMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
        }

        let output = {
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
      nullable: false,
      args: { 
        data: arg({type: "UserUpdateInput", nullable: false}),
        where: arg({type: "UserWhereUniqueInput", nullable: false}),
      },
      resolve: async (_parent, args, context, info) => {
        let user = await context.db.user.update({
          where: args.where,
          data: {
            ...args.data,
            password: undefined,
          }
        });

        if (!user) {
          return {
            __typename: "UserMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
        }

        let output = {
          __typename: "UserMutationOutput",
          previous_edge: null,
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

    t.crud.deleteOneUser();

    t.crud.createOneUser({
      type: "User",
      alias: "_hidden_we_need_the_types_createOneUser",
      computedInputs: {
        password: (args) => {
          return ""
        }
      }
    })
    t.crud.updateOneUser({
      type: "User",
      alias: "_hidden_we_need_the_types_updateOneUser",
      computedInputs: {
        password: (args) => {
          return ""
        }
      }
    })

    t.field("generatePasswords", {
      type: "QueryUsers_Connection",
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
              // @ts-expect-error
              password: await hash(user.password, 10),
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
      nullable: false,
      args: { data: arg({type: "RunnerCreateInput", nullable: false}) },
      resolve: async (_parent, args, context, info) => {
        let runner = await context.db.runner.create(args);

        if (!runner) {
          return {
            __typename: "RunnerMutationError",
            nameError: "Fehler bei Erstellung!",
            gradeError: null,
          }
        }

        return {
          __typename: "RunnerMutationOutput",
          edge: {
            cursor: runner.id,
            node: {
              ...runner,
            }
          }
        };
      }
    });

    t.field("updateOneRunner", {
      type: "RunnerMutationResponse",
      nullable: false,
      args: { 
        data: arg({type: "RunnerUpdateInput", nullable: false}),
        where: arg({type: "RunnerWhereUniqueInput", nullable: false}),
      },
      resolve: async (_parent, args, context, info) => {
        let user = await context.db.runner.update({
          where: args.where,
          data: {
            ...args.data,
          }
        });

        if (!user) {
          return {
            __typename: "RunnerMutationError",
            nameError: "Fehler bei Aktualisierung!",
            gradeError: null,
          }
        }

        let output = {
          __typename: "RunnerMutationOutput",
          previous_edge: null,
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

    t.crud.deleteOneRunner();

    t.crud.createOneRunner({
      type: "Runner",
      alias: "_hidden_we_need_the_types_createOneRunner"
    })
    t.crud.updateOneRunner({
      type: "Runner",
      alias: "_hidden_we_need_the_types_updateOneRunner"
    })

    t.field("createOneRound", {
      type: "CreateRoundMutationResponse",
      nullable: false,
      args: { data: arg({type: "RoundCreateInput", nullable: false}) },
      resolve: async (parent, args, context) => {
        try {
          let startNumber = args.data.student.connect?.startNumber;
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
          }) as RoundWithRunner

          console.log(roundWithRunner)

          // TODO FIXME subscriptions

          let output = {
            __typename: "CreateRoundMutationOutput",
            previous_edge: null,
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
          return {
            __typename: "CreateRoundMutationError",
            startNumberError: "Läufer mit dieser Startnummer nicht gefunden!"
          }
        }
      },
    });

    t.field("deleteOneRound", {
      type: "Round",
      nullable: true,
      args: {
        where: arg({type: "RoundWhereUniqueInput", nullable: false})
      },
      resolve: async (parent, args, context) => {
        let round = await context.db.round.delete(args)
        await context.db.$executeRaw`UPDATE "Runner" SET "roundCount" = "roundCount" - 1 WHERE id = ${round.studentId};`
        
        // TODO FIXME subscriptions

        return round
      }
    })

    t.crud.deleteOneRound({
      type: "Round",
      alias: "_hidden_deelteOneRound"
    });

    t.crud.createOneRound({
      type: "Round",
      alias: "_hidden_we_need_the_types_createOneRound",
      computedInputs: {
        createdBy: (args) => {
          return args.ctx.user
        }
      }
    })
    t.crud.updateOneRound({
      type: "Round",
      alias: "_hidden_we_need_the_types_updateOneRound"
    })

    t.field("login", {
      type: "LoginMutationResponse",
      args: {
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, password }, context) => {
        const user = await context.db.user.findOne({
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
        const passwordValid: boolean = await compare(password, user.password);
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
      resolve: async (_parent, args, context) => {
        let userSession = await context.db.userSession.delete({
          where: {
            // @ts-expect-error
            id: context.sessionId
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
