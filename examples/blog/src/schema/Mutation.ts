import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { idArg, mutationType, stringArg } from 'nexus'
import { APP_SECRET, getUserId } from '../utils'
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
      args: { studentId: idArg({nullable: false}) },
      resolve: async (parent, { studentId }, ctx) => {
        const round = await ctx.photon.rounds.create({
          data: {
            time: 1337,
            student: { 
              connect: { 
                id: studentId
              } 
            },
            createdBy: {
              connect: {
                id: getUserId(ctx),
              }
            }
          }
        })
        ctx.pubsub.publish("STUDENTS", round);
        return round
      },
    })

    t.crud.createOneStudent()
  },
})
