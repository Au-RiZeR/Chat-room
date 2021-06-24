$(document).ready(function () {
    let Password = $('#password')
    let usernameContain = $('#username')
    let login = $('#login')
    // let token = Math.random()
    //const ws = new WebSocket('ws://ottoline.madissia.com.au:1025/');
    const ws = new WebSocket('ws://localhost:1025/');
    ws.onopen = function () {
        console.log('WebSocket Client Connected');
    };
    ws.onmessage = function (e) {
        // console.log(e)
        let content = JSON.parse(e.data)
        console.log(content)
        if (content.type == "success") {
            let token = content.payload
            window.location.href = `/chat.html?Token=${token}`;
            console.log('logged in')
            $(usernameContain).addClass("is-success");
            $(Password).addClass("is-success");
        }
        if (content.type == "failed") {
            console.log('Username or Password incorrect')
            $(usernameContain).addClass("is-danger");
            $(Password).addClass("is-danger");
        }
    };
    $(login).click(function (e) { 
        e.preventDefault();
        let username = $(usernameContain).val();
        let password = $(Password).val()
        let obj =
        {
            "type": "loginRequest",
            "username": username,
            "password": password,
        }
        let json = JSON.stringify(obj)
        let jsonparse = JSON.parse(json)
        console.log(json)
        messageSend(json)
    });
    // $(usernameContain).keyup(function (e) {
    //     var key = e.which;
    //     if (key == 13 && usernameContain.val()) {
    //         let username = $(usernameContain).val();
    //         let obj =
    //         {
    //             "username": username,
    //             "message": "Joined The Chat-Room"
    //         }
    //         let json = JSON.stringify(obj)
    //         let jsonparse = JSON.parse(json)
    //         messageSend(json)
    //     }
    // });




    function messageSend(msg) {
        ws.send(msg)
    }

});
