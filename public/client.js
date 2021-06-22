$(document).ready(function () {
    let msgContain = $("#msgBox")
    let wholemsg = $('#msg')
    let usernameContain = $("#usernameBox")
    let wholeUser = $('#username')


    const ws = new WebSocket('ws://ottoline.madissia.com.au:1025/');
    ws.onopen = function () {
        console.log('WebSocket Client Connected');
        // ws.send('Hi this is web client.');
    };
    ws.onmessage = function (e) {
        console.log(e.data)
        appendReceived()
        function appendReceived() {
            let text = `<div class="board-item"><div class="board-item-content"><span>${e.data}</span></div></div>`
        $('#messages').append(text);
        messageCount()
            
        }
    };
    $(usernameContain).keyup(function (e) { 
        var key = e.which;
        if (key == 13 && usernameContain.val()){
            $(wholemsg).removeClass('is-hidden');
            $(wholeUser).addClass('is-hidden');
        }
    });

    $(msgContain).keyup(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            let username = $(usernameContain).val();
            let msg = $(msgContain).val();
            let obj =
                {
                    "username":username,
                    "message":msg
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

    function messageCount(){
        var count = $("#messages").children().length;
        if(count >= 20){
            $('#messages').find("div").slice(1,2).remove();
        }
        console.log(count)
    }
});
