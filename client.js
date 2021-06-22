$(document).ready(function () {
    let msgContain = $("#msgBox")
    let usernameContain = $("#username")


    const ws = new WebSocket('ws://localhost:80/');
    ws.onopen = function () {
        console.log('WebSocket Client Connected');
        // ws.send('Hi this is web client.');
    };
    ws.onmessage = function (e) {
        console.log(e.data);
    };


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
            
            messageSend(json)
            // console.log(json)
            // console.log(obj)
            $(msgContain).val("");
        }
    });

    function messageSend(msg) {
        // console.log(msg)
        ws.send(msg)
    }
});
