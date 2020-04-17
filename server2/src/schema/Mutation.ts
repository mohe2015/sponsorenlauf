import { mutationType, stringArg, idArg } from '@nexus/schema'
import { hashSync, compare } from 'bcrypt'
import { sign, Secret } from 'jsonwebtoken'

export const Mutation = mutationType({
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
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
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
        // @ts-ignore
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, process.env.APP_SECRET as Secret),
          user,
        }
      },
    })

    t.field('createOneRound', {
      type: 'Round',
      args: {
        id: idArg({ nullable: false }),
      },
      resolve: async (parent, { id }, ctx) => {
        console.log(id)

        const round = await ctx.db.round.create({
          data: {
            time: 1337, // TODO
            student: {
              connect: {
                id: id,
              },
            },
            createdBy: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        })
        console.log('publish rounds', round)
        ctx.pubSub.publish('ROUNDS', round)
        return round
      },
    })

    t.crud.createOneStudent()
  },
})