import { makeSchema } from '@nexus/schema'
import * as types from './graphql'

export const schema = makeSchema({
    types
})