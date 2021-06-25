// Node.js WebSocket server script
require('dotenv').config()
const http = require('http');
const WebSocketServer = require('websocket').server;
const express = require("express")
const hbs = require('hbs')
const app = express()
const server = http.createServer(app);
server.listen(process.env.PORT);
const wsServer = new WebSocketServer({
    httpServer: server
});

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.set('view engine', 'hbs')
app.set('views', './views')
app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/public/Login.html")
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
            Token: token
        }
        res.render('chat', { filler: filler })
    }
})
app.use(express.static('public'))

function replaceMessageText(msg)
{
    return msg
        .replace(/</g, "&lt;") // '<' to HTML-text equivalent
        .replace(/>/g, "&gt;") // '>' to HTML-text equivalent

        // Surround link-looking text with hyperlink elements <a></a>
        .replace(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig, "\n<a href=\"$&\" target=\"_blank\">$&</a>\n\t")

        // Replace ** pairs with bold tags
        .replace(/\*\*(.+)\*\*/g, "<b>$1</b>")

        // Replace * pairs with italic tags
        .replace(/\*(.+)\*/g, "<i>$1</i>")

        // Replace ~ pairs with strikethrough tags
        .replace(/\~(.+)\~/g, "<s>$1</s>")

        // Replace ` pairs with code tags
        .replace(/\`(.+)\`/g, "<code>$1</code>")
    }

var connected = []

wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    let logged = 0

    connection.on('message', async function (message) {
        let content = JSON.parse(message.utf8Data)
        let cone = {
            "user": connection
        }
        console.log(message)
        if (content.type == "message") {
            let msg = content.message
            let token = content.token
            connection.token = token
            let search = await User.findOne({
                where: {
                    Token: token
                }
            });
            let res = JSON.parse(JSON.stringify(search, null, 2))
            content.username = res.Username
            connection.username = `<s>${res.Username}<s>`
            connection.name = res.Username
            content.message = replaceMessageText(msg)
            relaymsg(content)
            if (logged == 0) {
                cone = {
                    "name": connection.name,
                    "user": connection,
                    "token": connection.token,
                    "username": connection.username 
                }
                connected.push(cone) 
                logged++
            }

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
            if (passwordC === password ) {
                let search = await User.findOne({
                    where: {
                        Username: username
                    }
                });
                let res = JSON.parse(JSON.stringify(search, null, 2))
                if (!res && username.search(/^(?! )[A-Za-z0-9 ]*(?<! )$/gm) !=-1) {
                    send(cone.user, "success")
                    addUser(username, password, token)
                } else {
                    send(cone.user, "failed")
                    // Username Invalid
                }
            } else {
                send(cone.user, "passNoMatch")
                //Passwords don't match
            }
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log(reasonCode)
        console.log(description)
        connection.message = "has left the Chat Room"
        connected.splice(connected.indexOf(connection.username),1)
        relaymsg(connection)
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
setInterval(userCount, 5000)
function userCount() {
    try {
        let userString =" "
        for (let i = 0; i < connected.length; i++) {
            const element = connected[i].name;
            userString = userString.concat(` ${element},`)
        };
        connected.forEach(element => {
            element.user.sendUTF(JSON.stringify({ "type": 'userCount', "payload": userString }))   
        });
    }
    catch (err) {
        // console.log(err)
    }
}

const { Sequelize, DataTypes, NUMBER } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_TABLE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // 3306 is default MySQL port
    dialect: process.env.DB_TYPE // Place your DB here eg. 'mysql'
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
    // console.log(JSON.parse(userbase))
    let search = await User.findOne({
        where: {
            Token: secret
        }
    });
    return search//JSON.parse(JSON.stringify(search, null, 2))
}
