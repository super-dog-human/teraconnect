const fs = require('fs')
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: true })
const handle = app.getRequestHandler()

const options = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
}

app.prepare().then(() => {
  createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on https://localhost:3000')
  })
})