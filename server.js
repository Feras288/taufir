const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false // Set to false for production
const app = next({ dev })
const handle = app.getRequestHandler()

const port = process.env.PORT || 3000

app.prepare().then(() => {
    createServer((req, reqRes) => {
        const parsedUrl = parse(req.url, true)
        handle(req, reqRes, parsedUrl)
    }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
