import {User} from "../model/User.js";

export class UserController {
    constructor() {
        $('#create').on('click', () => {
            this.handleCreatAccount();
        });
        $('#spanSingIn').on('click', () => {
            this.handleLoadFrom(".signIn");
        });
        $('#imgSignIn').on('click', () => {
            this.handleLoadFrom(".signIn");
        });
        $('#spanSignUp').on('click', () => {
            this.handleDefaultLoad();
        });
        this.handleDefaultLoad();
    }

    handleCreatAccount() {

        !/^[A-Za-z ]+/.test($('#userName').val()) ? alert("User name invalid or empty !") :
            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#createEmail').val()) ? alert("Invalid email !") :
                !/^[a-zA-Z0-9@]{3,}$/.test($('#creatPassword').val()) ? alert("Invalid password !") :
                    !/^[0-9]{10}$/.test($('#nic').val()) ? alert("Invalid Nic !") :
                        !$("#imageFile")[0].files[0] ? alert("Please select the image !") : this.handleSaveUser();
    }

    handleSaveUser() {

        const user = JSON.stringify(new User(undefined,
            $('#userName').val(),
            $('#createEmail').val(),
            $('#creatPassword').val(),
            $('#nic').val(),
            $('#address').val()));

        console.log(user)

        const formData = new FormData();
        const fileInput = $('#imageFile')[0].files[0];

        formData.append('file', fileInput);
        formData.append('user', user);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/user",
            method: "POST",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formData,
            success: (resp) => {
                console.log(resp)
                if (resp.code == 200) {
                    alert(resp.message);
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleDefaultLoad() {
        $(".signIn").css({
            "display":"none"
        });
    }

    handleLoadFrom(id) {
        $(id).css({
            "display":"block"
        });
    }
}

new UserController();