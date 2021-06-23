$(document).ready(function () {
    let msgContain = $("#msgBox")
    let wholemsg = $('#msg')
    let usernameContain = $("#usernameBox")
    let wholeUser = $('#username')


    // const ws = new WebSocket('ws://ottoline.madissia.com.au:1025/');
    const ws = new WebSocket('ws://localhost:1025/');
    ws.onopen = function () {
        console.log('WebSocket Client Connected');
        // ws.send('Hi this is web client.');
    };
    ws.onmessage = function (e) {
        console.log(e)
        let content = JSON.parse(e.data)
        console.log(content)
        if(content.type == "add_message"){
            appendReceived()
        }
        if(content.type == "userCount"){
            $("#userCount").text(`Global Users: ${content.payload}`)
            
        }
        function appendReceived() {
            let text = `<div class="board-item"><div class="board-item-content break-word"><span class="break-word">${content.payload}</span></div></div>`
            $('#messages').append(text);
            messageCount()

        }
    };
    $(usernameContain).keyup(function (e) {
        var key = e.which;
        if (key == 13 && usernameContain.val()) {
            let username = $(usernameContain).val();
            let obj =
            {
                "username": username,
                "message": "Joined The Chat-Room"
            }
            let json = JSON.stringify(obj)
            let jsonparse = JSON.parse(json)
            append(jsonparse)
            messageSend(json)
            messageCount()
            $(wholemsg).removeClass('is-hidden');
            $(wholeUser).addClass('is-hidden');
        }
    });

    $(msgContain).keyup(function (e) {
        var key = e.which;
        if (key == 13 && msgContain.val())  // the enter key code
        {
            let username = $(usernameContain).val();
            let msg = $(msgContain).val().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig, "\n<a href=\"$&\" target=\"_blank\">$&</a>\n\t");
            let obj =
            {
                "username": username,
                "message": msg
            }

            let json = JSON.stringify(obj)
            let jsonparse = JSON.parse(json)
            console.log(jsonparse.message)
            append(jsonparse)
            messageSend(json)
            messageCount()
            // console.log(json)
            // console.log(obj)
            $(msgContain).val("");
        }
    });

    function append(msg) {
        let text = `<div class="board-item"><div class="board-item-content"><span>You: ${msg.message}</span></div></div>`
        $('#messages').append(text);

    }

    function messageSend(msg) {
        // console.log(msg)
        ws.send(msg)
    }

    function messageCount() {
        var count = $("#messages").children().length;
        if (count >= 50) {
            $('#messages').find("div").slice(1, 2).remove();
        }
        // console.log(count)
        scroll()
    }

    function scroll(params) {
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
});
