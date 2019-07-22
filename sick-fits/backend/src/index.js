require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// TODO user express middleware to handle cookies (JWT)
// TODO Use express middleware to populate current users

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  server => {
    console.log(`Server is now running on port http://localhost:${server.port}`)
  }
)
