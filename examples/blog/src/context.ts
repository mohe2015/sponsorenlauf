import { Photon } from '@prisma/photon'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { PubSub } from 'graphql-yoga'

const photon = new Photon()
const pubsub = new PubSub()

export interface Context {
  photon: Photon
  request: any
  pubsub: PubSub
}

export function createContext(request: ContextParameters) {
  return {
    ...request,
    photon,
    pubsub
  }
}