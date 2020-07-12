import { schema, log } from "nexus";
import { hashSync, compare } from "bcrypt";
import { sign, Secret } from "jsonwebtoken";
import { AuthenticationError } from "../errors";

schema.mutationType({
  definition(t) {
    t.crud.createOneUser({
      // TODO FIXME IMPORTANT this stores the password in plaintext!!!!
      /*computedInputs: {
        password: ({ args }) => {
          // @ts-ignore
          hashSync(args.data.password, 10)
        },
      },*/
    });

    t.field("login", {
      type: "AuthPayload",
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
          throw new AuthenticationError(`No user found with name: ${name}`);
        }
        // @ts-ignore
        const passwordValid: boolean = await compare(password, user.password);
        if (!passwordValid) {
          throw new AuthenticationError("Invalid password");
        }
        context.response.cookie('id', user.id, {
            httpOnly: true,
            maxAge: 18000,
        })     
        return {
          user,
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
            time: 1337, // TODO
            student: {
              connect: {
                startNumber: startNumber,
              },
            },
            createdBy: {
              connect: {
                id: ctx.userId!,
              },
            },
          },
        });
        console.log("publish rounds", round);
        ctx.pubsub.publish("ROUNDS", round);
        return round;
      },
    });

    t.crud.createOneStudent();
  },
});
