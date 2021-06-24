$(document).ready(function () {
    let Password = $('#password')
    let usernameContain = $('#username')
    let passwordConfirmContain = $('#passwordConfirm')
    let signup = $('#signup')
    
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
            window.location.href = '/Login.html';
            console.log('Signed Up')
            $(usernameContain).addClass("is-success");
            $(Password).addClass("is-success");
            $(passwordConfirmContain).addClass("is-success");
        }
        if (content.type == "failed") {
            console.log('Username Taken')
            $(usernameContain).addClass("is-danger");
            // $(Password).addClass("is-danger");
        }
        if (content.type == "passNoMatch") {
            console.log('Password\'s don\'t match')
            $(Password).addClass("is-danger");
            $(passwordConfirmContain).addClass("is-danger");
            // $(Password).addClass("is-danger");
        }
    };
    $(signup).click(function (e) { 
        e.preventDefault();
        let username = $(usernameContain).val();
        let passwordConfirm = $(passwordConfirmContain).val();
        let password = $(Password).val()
        let token = Math.random()
        console.log(token)
        let obj =
        {
            "type": "signupRequest",
            "username": username,
            "password": password,
            "passwordC": passwordConfirm,
            "Token": token
        }
        let json = JSON.stringify(obj)
        let jsonparse = JSON.parse(json)
        console.log(json)
        messageSend(json)
    });

    $(usernameContain).change(function (e) { 
        e.preventDefault();
        $(usernameContain).removeClass("is-danger");
    });
    $(Password).change(function (e) { 
        e.preventDefault();
        $(Password).removeClass("is-danger");
        $(passwordConfirmContain).removeClass("is-danger");
    });
    $(passwordConfirmContain).change(function (e) { 
        e.preventDefault();
        $(Password).removeClass("is-danger");
        $(passwordConfirmContain).removeClass("is-danger");
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
