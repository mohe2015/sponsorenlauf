import { makeSchema } from '@nexus/schema'
import * as types from './graphql'
import * as Path from 'path'

export const schema = makeSchema({
    types,
    typegenAutoConfig: {
        sources: [{
          source: Path.join(__dirname, './src/contextModule'),
          alias: 'ContextModule'
        }],
        contextType: 'ContextModule.Context',
      },
})