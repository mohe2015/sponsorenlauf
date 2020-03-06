import { server } from 'nexus-future'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import WebSocket from 'ws'
import { ConnectionContext } from 'subscriptions-transport-ws'
import { Request, Response } from 'apollo-server-env'
import { ExecutionParams } from 'subscriptions-transport-ws'
import { Context } from './context'
import { schema } from 'nexus-future'