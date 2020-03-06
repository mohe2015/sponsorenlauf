import { schema } from 'nexus-future'
import { verify, Secret } from 'jsonwebtoken'

function requestToUserID(req: import("http").IncomingMessage) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  console.log("token", token)
  if (!token) {
    return null;
  }
  const verifiedToken = verify(token as string, process.env.APP_SECRET as Secret) as NexusContext
  console.log("verifiedToken", verifiedToken)
  return verifiedToken.userId
}

schema.addToContext(req => {
  return { userId: requestToUserID(req) }
})