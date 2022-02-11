/*
 * @Author: Jin
 * @Date: 2021-08-27 09:52:40
 * @LastEditTime: 2022-02-11 18:01:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \testProject3D\testProject3D_server\app.js
 */
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
const fs = require('fs');       //读取文件模块
const path = require('path');   //path模块解析路径
const url = require('url');     //解析地址模块

let server = http.createServer(function(req,res){ //req(request):请求  res(response)：相应
    // if(req.url === '/get.html'){

    // }

    let {pathname} = url.parse(req.url);//假设 /get?id=1中，只要/get

    //TODOT 
    // console.log("jin---req,res: ", req, res)
    // let pathname = req.url
    //也可写成一个数组
    if(['/get.html','/post.html'].includes(pathname)){
        res.statusCode = 200;//状态码
        res.setHeader('Content-Type', 'text/html');//设置头
        //以同步模式读取文件内容
        let content = fs.readFileSync(path.join(__dirname, 'static', pathname.slice(1)));//读文件 __dirname:当前目录、文件夹、文件
        //写法一 这种写法会在客户端会有不一样的解析（与第二种相比）
        res.write(content);//向客户端写响应
        res.end();//结束 这次写响应
        //写法二
        // res.end(content);//发给客户端
    }
    else if(pathname === "/get"){
        console.log(req.method);
        console.log(req.url);
        console.log(req.headers);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('get');
        res.end();
    }else if(pathname === "/post"){
        let buffers = [];
        //客户端tcp传输时，有可能会分包，10M包，可能分成10次发送，每次发1M
        req.on('data',(data)=>{
            buffers.push(data);
        });
        //1.监听状态，end时候发完 2.Buffer是一个类，是node里一个类，类似于一个字节数组
        req.on('end',(data)=>{
            console.log(req.method);
            console.log(req.url);
            console.log(req.headers);
            res.statusCode = 200;
            let body = Buffer.concat(buffers);
            console.log('body',body);
            res.setHeader('Content-Type', 'text/plain');
            res.write(body);
            res.end();
        });

    }
    else{
        res.statusCode = 404;
        res.end();
    }
 });

 server.listen(8080)