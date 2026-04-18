import { createServer } from './lexicons'
import { Hono } from 'hono'

type Env = { Bindings: {}; Variables: {} }

const xrpc = createServer<Env>()

xrpc.org.tarororo.brew.getLauncher(async ({ auth, params, input, c }) => {
  return {
    encoding: 'application/json',
    body: { record:{},view:[] },
  }
})

const app = new Hono<Env>()
app.route('/', xrpc.xrpc.createApp())
export default app