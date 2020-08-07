import { schema } from "nexus";
import { hash, compare } from "bcrypt";
let crypto = require('crypto');

schema.mutationType({
  definition(t) {

    t.field("createOneUser", {
      type: "UserMutationResponse",
      nullable: false,
      args: { data: schema.arg({type: "UserCreateInput", nullable: false}) },
      resolve: async (_parent, args, context, info) => {
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

    t.field("updateOneUser", {
      type: "UserMutationResponse",
      nullable: false,
      args: { 
        data: schema.arg({type: "UserUpdateInput", nullable: false}),
        where: schema.arg({type: "UserWhereUniqueInput", nullable: false}),
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
      type: "User",
      list: true,
      resolve: async (parent, args, context, info) => {
        let usersWithoutPassword = await context.db.user.findMany({
          where: {
            password: ""
          }
        })

        for (let user of usersWithoutPassword) {
          user.password = crypto.randomBytes(32).toString("hex");

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

        return usersWithoutPassword
      }
    })

    t.field("createOneRunner", {
      type: "CreateRunnerMutationResponse",
      nullable: false,
      args: { data: schema.arg({type: "RunnerCreateInput", nullable: false}) },
      resolve: async (_parent, args, context, info) => {
        let runner = await context.db.runner.create({
          data: args.data
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
          previous_edge: null,
          runner_edge: {
            cursor: runner.id,
            node: {
              ...runner,
            }
          }
        };
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
      args: { data: schema.arg({type: "RoundCreateInput", nullable: false}) },
      resolve: async (parent, args, context) => {
        const round = await context.db.round.create({
          data: {
            ...args.data,
            createdBy: {
              connect: {
                id: context.user?.id,
              },
            },
          },
        });
        let output = {
          __typename: "CreateRoundMutationOutput",
          previous_edge: null,
          round_edge: {
            cursor: round.id,
            node: {
              ...round,
            }
          }
        };
        context.pubsub.publish("ROUNDS", output);
        return output;
      },
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
        // @ts-expect-error
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
  },
});
