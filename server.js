const nodeStatic = require('node-static')
const fileServer = new nodeStatic.Server('./dist', { gzip: true, cache: 3600, serverInfo: 'server' })

require('http')
  .createServer((request, response) => {
    request
      .addListener('end', () => fileServer.serve(request, response))
      .resume()
  })
  .listen(process.env.PORT || 8080)
console.log('Server started')
