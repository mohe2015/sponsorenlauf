import { makeSchema } from '@nexus/schema'
import * as types from './graphql'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'

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
          }
    })],
    typegenAutoConfig: {
        sources: [
            {
                source: require.resolve('.prisma/client/index.d.ts'),
                alias: "prisma",
            },
            {
                source: require.resolve('./context'),
                alias: 'ContextModule'
            },
        ],
        contextType: 'ContextModule.Context',
    },
})