// const ws = require("nodejs-websocket")
// let websocket = ws.createServer((client)=>{
//     console.log("jin---new client")
//     client.on("text", (result)=>{
//         console.log("jin---receive message:",result)
//         client.send("OK hello world")
//     })
//     client.on("close", (result)=>{
//         console.log("jin---on close:",result)
//     })
//     client.on("error", (result)=>{
//         console.log("jin---on error:",result)
//     })
// })
// websocket.listen(3000)

const http = require("http")
let httpNet = http.createServer()
httpNet.on("request", (request, response)=>{
    console.log('收到客户端的请求了，请求路径是：' + request.url)
    response.write('hello')
    response.write(' nodejs')
    response.end()
})

httpNet.listen(3000)