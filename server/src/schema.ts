import { makeSchema, connectionPlugin } from 'nexus'
import * as types from './graphql'

export const schema = makeSchema({
    types,
    plugins: [connectionPlugin()],
    nonNullDefaults: {
        input: true,
        output: true,
    },
    outputs: {
        typegen: __dirname + '/generated/nexus.ts',
        schema: __dirname + '/../schema.graphql',
      },
})