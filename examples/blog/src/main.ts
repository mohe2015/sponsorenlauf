import { GraphQLServer } from 'graphql-yoga'
import schema from './schema'
import { createContext } from './context'
import { permissions } from './permissions'

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

server.start({
  cors: {
    credentials: true,
    origin: ["http://localhost:3000"],
  }
}, () => console.log(`🚀 Server ready at http://localhost:4000`))
