// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const express = require("express")
const hbs = require('hbs')
const app = express()
const server = http.createServer(app);
const port = 1025
server.listen(port);
const wsServer = new WebSocketServer({
    httpServer: server
});

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.set('view engine', 'hbs')
app.set('views', './views')
app.get('/', async (req, res) => {
    // console.log(req.query)
    res.sendFile(__dirname + "/public/Login.html")
    // res.render('demo')
    // res.render('dynamic', {demo : demo})
    // var demo = {
    //      name : 'Rohan',
    //      age : 26
    //  }


    //      res.render('dynamic', {demo : demo})

})
app.get('/Login.html', async (req, res) => {
    res.sendFile(__dirname + "/public/Login.html")
})
app.get('/chat.html', async (req, res) => {
    let query = NUMBER(req.query)
    let token = query.options.Token
    let corresponds = await list(token)
    if (corresponds) {
        var filler = {
            // name : 'Rohan',
            Token: token
        }
        res.render('chat', { filler: filler })
    }
})
app.use(express.static('public'))

var connected = []

wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    let cone = {
        "id": connected.length,
        "user": connection,
    }
    connected.push(cone)

    connection.on('message', async function (message) {
        let content = JSON.parse(message.utf8Data)
        console.log(message)
        if (content.type == "message") {
            let msg = content.message
            let token = content.token
            let search = await User.findOne({
                where: {
                    Token: token
                }
            });
            let res = JSON.parse(JSON.stringify(search, null, 2))
            content.username = res.Username
            content.message = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig, "\n<a href=\"$&\" target=\"_blank\">$&</a>\n\t")
            relaymsg(content)
        }
        if (content.type == "loginRequest") {
            let username = content.username
            let password = content.password
            let search = await User.findOne({
                where: {
                    Username: username
                }
            });
            let res = JSON.parse(JSON.stringify(search, null, 2))
            if (res) {
                if (password === res.Password) {
                    console.log('correct')
                    send(cone.user, "success", res.Token)

                } else {
                    //if Password is wrong
                    send(cone.user, "failed")
                }
            } else {
                send(cone.user, "failed")
                //username doesn't exist
            }
        }
        if (content.type == "signupRequest") {
            let username = content.username
            let password = content.password
            let passwordC = content.passwordC
            let token = content.Token
            if (passwordC === password) {
                let search = await User.findOne({
                    where: {
                        Username: username
                    }
                });
                let res = JSON.parse(JSON.stringify(search, null, 2))
                if (!res) {
                    send(cone.user, "success")
                    addUser(username, password, token)
                } else {
                    send(cone.user, "failed")
                }
            } else {
                send(cone.user, "passNoMatch")
                //username doesn't exist
            }
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

function send(sender, type, content) {
    sender.sendUTF(JSON.stringify({ "type": type, "payload": content }))
}

function relaymsg(content) {
    connected.forEach(element => {
        element.user.sendUTF(JSON.stringify({ "type": 'add_message', "payload": `${content.username}: ${content.message}` }))   
    });
}
setInterval(userCount, 10000)
function userCount() {
    try {
        let count = wsServer.connections[0].socket._server._connections
        for (let i = 0; i < connected.length; i++) {
            const element = connected[i].user;
            element.sendUTF(JSON.stringify({ "type": 'userCount', "payload": count }))
        };
    }
    catch (err) {
        // console.log(err)
    }
}

const { Sequelize, DataTypes, NUMBER } = require('sequelize');
const sequelize = new Sequelize('chat', 'root', 'Passwordgoburr', {
    host: 'localhost',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
const User = sequelize.define('User', {
    // Model attributes are defined here
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

test()
async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function addUser(username, password, token) {
    await User.create({ Username: username, Password: password, Token: token })

}

async function list(secret) {
    const users = await User.findAll();
    let userbase = JSON.stringify(users, null, 2);
    console.log(JSON.parse(userbase))
    let search = await User.findOne({
        where: {
            Token: secret
        }
    });
    return search//JSON.parse(JSON.stringify(search, null, 2))
}
