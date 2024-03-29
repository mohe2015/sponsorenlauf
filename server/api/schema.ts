import { makeSchema, connectionPlugin, fieldAuthorizePlugin, queryComplexityPlugin } from 'nexus'
import * as types from './graphql/index'
import * as path from 'path'

export const schema = makeSchema({
    types,
    plugins: [
        connectionPlugin({
            nonNullDefaults: {
                input: true,
                output: true,
            }
        }),
        fieldAuthorizePlugin({
            // @ts-expect-error
            optional: false,
            formatError: ({ args, ctx, error, info, root }) => {
                throw error;
            }
        }),
        queryComplexityPlugin(),
    ],
    nonNullDefaults: {
        input: true,
        output: true,
    },
    sourceTypes: {
        modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
    },
    contextType: {
        module: path.join(__dirname, 'context.ts'),
        export: 'Context',
    },
    outputs: {
        schema: true,
        typegen: path.join(__dirname, "../node_modules/@types/nexus-typegen/index.d.ts")
    },
    shouldGenerateArtifacts: true,
    features: {
        abstractTypeStrategies: {
            resolveType: false,
            isTypeOf: false,
            __typename: true
        }
    }
})