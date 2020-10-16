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
            DateTime: DateTimeResolver,
            Json: new GraphQLScalarType({
              ...JSONObjectResolver,
              name: 'Json',
              description: 'The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
            })
          },
          shouldGenerateArtifacts: true
    }),
    connectionPlugin()],
    typegenAutoConfig: {
        sources: [
            {
                source: '.prisma/client',
                alias: "prisma",
            },
            {
                source: './api/context',
                alias: 'ContextModule'
            },
        ],
        contextType: 'ContextModule.Context',
        
    },
    outputs: {
        typegen: path.join(
          __dirname,
          '../node_modules/@types/nexus-typegen/index.d.ts',
        ),
        schema: path.join(__dirname, '../api.graphql'),
      },
})