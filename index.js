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
            "user":connection
    }
    connected.push(cone)
    connection.on('message', function(message) {
        let content = JSON.parse(message.utf8Data)

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
        element.sendUTF(`${content.username}: ${content.message}`)}
    }
}