import { schema } from 'nexus-future'

 schema.addToContext(req => {
   return { userId: 4 }
 })