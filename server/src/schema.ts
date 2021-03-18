import { makeSchema, connectionPlugin } from 'nexus'
import * as types from './graphql'
import * as path from 'path'

export const schema = makeSchema({
    types,
    plugins: [connectionPlugin()],
    nonNullDefaults: {
        input: true,
        output: true,
    },
    sourceTypes: {
        modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
        debug: true,
    },
    contextType: {
        module: path.join(__dirname, 'context.ts'),
        export: 'Context',
    },
    outputs: {
        typegen: path.join(
          __dirname,
          'node_modules/@types/nexus-typegen/index.d.ts',
        ),
        schema: path.join(__dirname, '../api.graphql'),
      },
})