import { makeSchema, connectionPlugin } from 'nexus'
import * as types from './graphql'
import { DateTimeResolver, } from 'graphql-scalars'
import { nexusPrisma } from 'nexus-plugin-prisma'

export const schema = makeSchema({
    types,
    plugins: [nexusPrisma({
        experimentalCRUD: true,
        scalars: {
            DateTime: DateTimeResolver
          },
          shouldGenerateArtifacts: true
    }),
    connectionPlugin()],
    nonNullDefaults: {
        input: true,
        output: true,
    },
    outputs: {
        typegen: __dirname + '/generated/nexus.ts',
        schema: __dirname + '/../schema.graphql',
      },
})