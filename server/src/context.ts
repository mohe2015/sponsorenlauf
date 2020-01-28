import { Photon } from '@prisma/photon'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { PubSub } from 'graphql-yoga'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'

const photon = new Photon()
const pubsub = new PubSub()

export interface Context {
  photon: Photon
  request: any
  pubsub: PubSub
  userId: string | null
}

export function createContext(context: ContextParameters): Context {
  if (context.connection) {
    console.log('IMPORTANT', context.connection.context.userId)
    return {
      request: context.connection.context.request,
      userId: context.connection.context.userId,
      photon,
      pubsub,
    }
  } else {
    const Authorization = context.request.headers.authorization || ''
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      // console.log('token', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      //console.log('tokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      request: context.request,
      photon,
      pubsub,
      userId,
    }
  }
}
