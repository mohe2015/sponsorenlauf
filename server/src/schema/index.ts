import * as Nexus from 'nexus'
import { nexusPrismaPlugin } from 'nexus-prisma'
import * as Query from './Query'
import * as Mutation from './Mutation'
import * as Student from './Student'
import * as Round from './Round'
import * as User from './User'
import * as AuthPayload from './AuthPayload'
import * as path from 'path'
import * as Subscription from './Subscription'
import { fieldAuthorizePlugin } from 'nexus'

export default Nexus.makeSchema({
  types: [Query, Mutation, Student, User, Round, AuthPayload, Subscription],
  plugins: [nexusPrismaPlugin(), fieldAuthorizePlugin()],
  outputs: {
    typegen: path.join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts',
    ),
    schema: path.join(
      __dirname,
      '../../generated/schema.graphql'
    )
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/photon',
        alias: 'photon',
      },
      {
        source: require.resolve('../context'),
        alias: 'Context',
      },
    ],
  },
})
