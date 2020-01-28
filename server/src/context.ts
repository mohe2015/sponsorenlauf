import { Photon } from '@prisma/photon'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { PubSub } from 'graphql-yoga'
import { verify } from 'jsonwebtoken'

export const APP_SECRET = 'appsecret321' // TODO FIXME TODO CODE DUPLICATION

interface Token {
  userId: string
}

const photon = new Photon()
const pubsub = new PubSub()

export interface Context {
  photon: Photon
  request: any
  pubsub: PubSub
  userId: String | null
}

export function createContext(context: ContextParameters): Context {
  if (context.connection) {
    return {
      ...context.connection.context,
      photon,
      pubsub,
    }
  } else {
    const Authorization = context.request.headers.authorization || ''
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      console.log('token', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      console.log('tokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      ...context,
      photon,
      pubsub,
      userId,
    }
  }
}
