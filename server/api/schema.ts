import { makeSchema, connectionPlugin } from 'nexus'
import * as types from './graphql/index'
import * as path from 'path'

export const schema = makeSchema({
    types,
    plugins: [connectionPlugin({
        nonNullDefaults: {
            input: true,
            output: true,
        }
    })],
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
})