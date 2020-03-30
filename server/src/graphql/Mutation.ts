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
        console.log('login')
        const user = await context.db.user.findOne({
          where: {
            name,
          },
        })
        console.log('user: ', user)
        if (!user) {
          throw new Error(`No user found with name: ${name}`)
        }
        // @ts-ignore
        const passwordValid = await compare(password, user.password)
        console.log('passwordValid: ', passwordValid)
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
        startNumber: schema.intArg({ nullable: false }),
      },
      resolve: async (parent, { startNumber }, ctx) => {
        const student = await ctx.db.student.findOne({
          where: {
            startNumber,
          },
        })
        console.log(student)

        const round = await ctx.db.round.create({
          data: {
            time: 1337, // TODO
            student: {
              connect: {
                id: student?.id,
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
        ctx.pubsub.publish('ROUNDS', round)
        return round
      },
    })

    t.crud.createOneStudent()
  },
})
