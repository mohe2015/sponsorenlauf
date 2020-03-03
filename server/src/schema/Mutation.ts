import { compare, hash, hashSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { idArg, mutationType, stringArg, intArg } from 'nexus'
import { APP_SECRET } from '../utils'
import { Round } from './Round'
import { Context } from '../context'

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser({
      computedInputs: {
        password: ({ args }) => {
          // @ts-ignore
          hashSync(args.data.password, 10)
        },
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, password }, context: Context) => {
        const user = await context.prisma.user.findOne({
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
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createOneRound', {
      type: Round,
      args: {
        startNumber: intArg({ nullable: false }),
      },
      resolve: async (parent, { startNumber }, ctx: Context) => {
        const round = await ctx.prisma.round.create({
          data: {
            time: 1337, // TODO
            student: {
              connect: {
                startNumber: startNumber,
              },
            },
            createdBy: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        })
        ctx.pubsub.publish('ROUNDS', round)
        return round
      },
    })

    t.crud.createOneStudent()
  },
})
