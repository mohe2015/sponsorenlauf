import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { idArg, mutationType, stringArg, intArg } from 'nexus'
import { APP_SECRET } from '../utils'
import { Round } from './Round'

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser({
      computedInputs: {
        password: ({ args, ctx, info }) => hash(args.data.password, 10),
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, password }, context) => {
        const user = await context.photon.users.findOne({
          where: {
            name,
          },
        })
        if (!user) {
          throw new Error(`No user found with name: ${name}`)
        }
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
      resolve: async (parent, { startNumber }, ctx) => {
        const round = await ctx.photon.rounds.create({
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
