import { schema, log } from "nexus";
import { hashSync, compare } from "bcrypt";
import { sign, Secret } from "jsonwebtoken";
import { AuthenticationError } from "../errors";
import { connect } from "http2";
import { connectionPlugin } from '@nexus/schema'
let crypto = require('crypto');

schema.inputObjectType({
  name: "CreateOneUserInput",
  nonNullDefaults: { output: false, input: false },
  definition(t) {
    t.string("name", { nullable: false })
    t.field("role", { type: "UserRole", nullable: false })
  }
})

schema.inputObjectType({
  name: "CreateRunnerInput",
  nonNullDefaults: { output: false, input: false },
  definition(t) {
    t.string("name", { nullable: false })
    t.string("clazz", { nullable: false })
    t.int("grade", { nullable: false })
  }
})


schema.mutationType({
  definition(t) {
    t.field("runner_create", {
      type: "CreateRunnerMutationResponse",
      nullable: false,
      args: { data: schema.arg({type: "CreateRunnerInput", nullable: false}) },
      resolve: async (_parent, args, context, info) => {
        let runner = await context.db.runner.create({
          data: {
            startNumber: await context.db.runner.count(), // TODO FIXME HACK
            ...args.data
          }
        });

        if (!runner) {
          return {
            __typename: "CreateRunnerMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
        }

        return {
          __typename: "CreateRunnerMutationOutput",
          previous_edge: Buffer.from("arrayconnection:" + (await context.db.runner.count() - 2)).toString('base64'),
          runner_edge: {
            cursor: Buffer.from("arrayconnection:" + (await context.db.runner.count() - 1)).toString('base64'),
            node: {
              ...runner,
            }
          }
        };
      }
    });

    t.field("user_create", {
      type: "CreateOneUserMutationResponse",
      nullable: false,
      args: { data: schema.arg({type: "CreateOneUserInput", nullable: false}) },
      resolve: async (_parent, args, context, info) => {
        let user = await context.db.user.create({
          data: {
            password: "hi",
            ...args.data
          }
        });

        if (!user) {
          return {
            __typename: "CreateOneUserMutationError",
            usernameError: "Nutzername nicht gefunden!",
            roleError: null,
          }
        }

        return {
          __typename: "CreateUserMutationOutput",
          user_edge: {
            cursor: Buffer.from("cursor:" + (await context.db.user.count() - 1)).toString('base64'),
            node: {
              ...user,
            }
          }
        };
      }
    });

    t.field("login", {
      type: "LoginMutationResponse",
      args: {
        name: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
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

        // @ts-expect-error
        context.response.cookie('id', id, {
            httpOnly: true,
            sameSite: "strict",
            // secure: true, // TODO FIXME
        })     
        return {
          __typename: "User",
          ...user,
        };
      },
    });

    t.field("createOneRound", {
      type: "Round",
      args: {
        startNumber: schema.intArg({ nullable: false }),
      },
      resolve: async (parent, { startNumber }, ctx) => {
        console.log(startNumber);

        const round = await ctx.db.round.create({
          data: {
            time: 1337, // TODO just store current time
            student: {
              connect: {
                startNumber: startNumber,
              },
            },
            createdBy: {
              connect: {
                id: ctx.user.id!,
              },
            },
          },
        });
        console.log("publish rounds", round);
        ctx.pubsub.publish("ROUNDS", round);
        return round;
      },
    });

    t.crud.createOneRunner();
  },
});
