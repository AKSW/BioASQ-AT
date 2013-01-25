require(["app"], function(app) {
    $("#loginButton").click(function() {
        var email = $("#loginEmail").val(),
            pass = $("#loginPassword").val();

        var req = $.ajax({
            'type': 'POST',
            'url': app.data.LogicServer + 'login',
            'data': { 'email': email, 'password': pass },
            'success': function (data) {
                // set user
                app.data.user = data.usermail;
                app.data.username = data.username;
                window.location = 'createQuestion.html';
            },
            'error': function (xhr, status, httpStatus) {
                if (xhr.status == 401){
                    alert('User not found.');
                }else{
                    alert('Could not login.');
                }
            }
        });
        // prevent default action (form submit)
        return false;
    });

    $("#doRegister").click(function(){
        var email = $("#userEmail").val(),
            pass = $("#userPass").val(),
            passAgain = $("#userPassRepeat").val(),
            name = $("#userName").val();

        if(pass != passAgain){
            alert("Passwords doesn't match");
            return;
        } else {

            var regExpObj = new RegExp(window.shared.shared.login.passwordRegEx, "g");
            if (regExpObj.test(pass) == false) {
                alert("Password at least 8 characters long, 1 digit and 1 symbol.");
                return
            }
        }

        $.post(app.data.LogicServer + 'register',
            {email: email, password: pass, name: name},
            function(data){
                $("#regModal").modal("hide");
            }
        )
        .error(function (resp) {
            alert(resp.responseText);
        });
    });

    $("#forgotPassword").click(function () {
        var email = $.trim($("#loginEmail").val());

        if (email.length > 0) {
            $.get(app.data.LogicServer + 'resetPassword',
            { email: email},
            function (data) {
                alert("A new password has been created, please check your e-mail for your confirmation code.");
            })
            .error(function (resp) {
                alert(resp.responseText);
            });

        } else {
            alert("Fill in your email address.")
        }
    });
});
