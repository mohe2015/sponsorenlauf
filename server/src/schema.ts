import { makeSchema, connectionPlugin } from 'nexus'
import * as types from './graphql'

export const schema = makeSchema({
    types,
    plugins: [connectionPlugin()],
    nonNullDefaults: {
        input: true,
        output: true,
    },
    contextType: {
        module: "./context.ts",
        export: "Context"
    },
    outputs: {
        typegen: __dirname + '/generated/nexus.ts',
        schema: __dirname + '/../schema.graphql',
      },
})