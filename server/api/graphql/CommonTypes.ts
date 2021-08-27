import { GraphQLDateTime } from 'graphql-scalars'

import { asNexusMethod, enumType } from 'nexus'

export const DateTime = asNexusMethod(GraphQLDateTime, 'date')

export const SortOrder = enumType({
    name: "SortOrder",
    members: ["asc", "desc"]
})