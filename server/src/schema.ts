import { makeSchema, connectionPlugin } from '@nexus/schema'
import * as types from './graphql'
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'
import { nexusPrisma } from 'nexus-plugin-prisma'
import * as path from 'path'

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
    typegenAutoConfig: {
      contextType: 'Context.Context',
        sources: [
            {
                source: '@prisma/client',
                alias: "prisma",
            },
            {
                source: require.resolve("./context"),
                alias: 'Context'
            },
        ],
    },
    outputs: {
        typegen: __dirname + '/generated/nexus.ts',
        schema: __dirname + '/../schema.graphql',
      },
})