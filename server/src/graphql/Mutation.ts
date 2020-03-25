import { schema } from 'nexus-future'
import { hashSync, compare } from 'bcrypt'
import { sign, Secret } from 'jsonwebtoken'

export const Mutation = schema.mutationType({
  definition(t) {
    t.crud.createOneUser({
      // TODO FIXME IMPORTANT this stores the password in plaintext!!!!
      /*computedInputs: {
        password: ({ args }) => {
          // @ts-ignore
          hashSync(args.data.password, 10)
        },
      },*/
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        name: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, password }, context) => {
        const user = await context.db.user.findOne({
          where: {
            name,
          },
        })
        if (!user) {
          throw new Error(`No user found with name: ${name}`)
        }
        // TODO FIXME password should be a hash
        // @ts-ignore
        //const passwordValid = await compare(password, user.password)
        //if (!passwordValid) {
        //  throw new Error('Invalid password')
        //}
        if (password !== user.password) { // TODO FIXME timing attack
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, process.env.APP_SECRET as Secret),
          user,
        }
      },
    })

    t.field('createOneRound', {
      type: "Round",
      args: {
        startNumber: schema.intArg({ nullable: false }),
      },
      resolve: async (parent, { startNumber }, ctx) => {
        const round = await ctx.db.round.create({
          data: {
            time: 1337, // TODO
            student: {
              connect: {
                startNumber: startNumber, // TODO FIXME doesn't check if it exists
              },
            },
            createdBy: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        })
        console.log("publish rounds", round)
        ctx.pubsub.publish('ROUNDS', round)
        return round
      },
    })

    t.crud.createOneStudent()
  },
})
