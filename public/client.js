$(document).ready(function () {
    let msgContain = $("#msgBox")
    let token = $("#token").html()

// $(selector).html();
    //const ws = new WebSocket('ws://ottoline.madissia.com.au:1025/');
    const ws = new WebSocket('ws://localhost:1025/');
    ws.onopen = function () {
        let joinobj = {
            "type": "message",
            "token": token,
            "message": "Joined The Chat-Room"
        }
        let json = JSON.stringify(joinobj)
        messageSend(json)
    };
    ws.onmessage = function (e) {
        let content = JSON.parse(e.data)
        if (content.type == "add_message") {
            appendReceived()
        }
        if (content.type == "userCount") {
            $("#userCount").text(`Global Users: ${content.payload}`)

        }
        function appendReceived() {
            let text = `<div class="board-item"><div class="board-item-content break-word"><span class="break-word">${content.payload}</span></div></div>`
            $('#messages').append(text);
            messageCount()
        }
    };



    $(msgContain).keyup(function (e) {
        var key = e.which;
        if (key == 13 && msgContain.val())  // the enter key code
        {
            let msg = $(msgContain).val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let obj =
            {
                "type": "message",
                "token": token,
                "message": msg
            }
            let json = JSON.stringify(obj)
            let jsonparse = JSON.parse(json)
            messageSend(json)
            messageCount()
            $(msgContain).val("");
        }
    });

    function messageSend(msg) {
        ws.send(msg)
    }

    function messageCount() {
        var count = $("#messages").children().length;
        if (count >= 50) {
            $('#messages').find("div").slice(1, 2).remove();
        }
        scroll()
    }

    function scroll() {
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
});
