const networkInterfaces = require('os').networkInterfaces
const http = require('http')
const nodeStatic = require('node-static')

const getLocalAddress = () => Object
  .values(networkInterfaces())
  .map(info => info.find(({ family, internal }) => family === 'IPv4' && !internal))
  .filter(Boolean)[0].address

const startServer = () => {
  const port = parseInt(process.env.PORT, 10) || 8080
  const server = new nodeStatic.Server('./dist', {
    gzip: true,
    cache: 3600,
    serverInfo: 'server'
  })

  http
    .createServer((request, response) => {
      request
        .addListener('end', () => server.serve(request, response))
        .resume()
    })
    .listen(port)

  console.log(`Server started @ ${getLocalAddress()}:${port}`)
}

startServer()
