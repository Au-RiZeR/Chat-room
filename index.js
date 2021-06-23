// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const express = require("express")
const app = express()
const server = http.createServer(app);
const port = 1025
server.listen(port);
const wsServer = new WebSocketServer({
    httpServer: server
});

app.get('/',(req,res) =>{
    res.sendFile(__dirname+"/public/indexa.html")
})
app.use(express.static('public'))

var connected = []
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    let cone = {
            "id":connected.length,
            "user":connection,
            // "name":""
    }
    // console.log(wsServer.connections[0].socket)
    connected.push(cone)
    connection.on('message', function(message) {
        let content = JSON.parse(message.utf8Data)
        console.log(message)
        relaymsg(cone,content)
    });
    connection.on('close', function(reasonCode, description) {
        // connected.splice(cone.id)
        console.log('Client has disconnected.');
    });
});
function relaymsg(sender,content){
    for (let i = 0; i < connected.length; i++) {
        const element = connected[i].user;
        if(element!=sender.user){
        element.sendUTF(JSON.stringify({ "type":'add_message', "payload": `${content.username}: ${content.message}` }))}
    }
}
setInterval(userCount,10000)
function userCount() {
    try {
        let count = wsServer.connections[0].socket._server._connections
        for (let i = 0; i < connected.length; i++) {
            const element = connected[i].user;
            element.sendUTF(JSON.stringify({ "type":'userCount', "payload": count }))};
      }
      catch(err) {
        // console.log(err)
      }

    
}