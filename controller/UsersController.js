import {User} from "../model/User.js";

let userImg = undefined;
let userId = null;
let nic = null;
const defaultImg = 'assets/images/defaultimage.jpg';
let uNextPage = 1;
let uCurrentPage = 0;
const count = 10;
let userHasPage = false;
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/auth";

export class UsersController {
    constructor() {
        $('#addUserForm').on('click', (event) => {
            this.handleUserViewAddFilterClickEvent(event);
        });
        $('#addUserBtn').on('click', () => {
            this.handleUserAddEvent();
        });
        $('#userImage').on('click', () => {
            $('#userImgFile').click();
        });
        $('#userImgFile').on('change', () => {
            this.handleImageSetEvent();
        });
        $('#saveUserBtn').on('click', () => {
            this.handleValidation('save');
        });
        $('#updateUserBtn').on('click', () => {
            this.handleValidation('update');
        });
        $('#deleteUserBtn').on('click', () => {
            this.handleDeleteUser(userId);
        });
        $("#nextAddUserBtn").on('click', () => {
            this.handleNextUserList();
        });
        $("#previousAddUserBtn").on('click', () => {
            this.handlePreviousUserList();
        });
        this.handleNavContainer(".user-list", "#usersNavBtn");
        this.handleUserEditeEvent();
    }

    handleNextUserList() {
        if (uNextPage !== 0) {
            this.handleLoadAllData(uNextPage, count);
            if (userHasPage) {
                uCurrentPage++;
                uNextPage++;
            }
        }
    }

    handlePreviousUserList() {
        if (uCurrentPage !== 0) {
            uCurrentPage--;
            uNextPage--;
            this.handleLoadAllData(uCurrentPage, count);
        }
    }

    handleUserAddEvent() {
        $("#addUserForm").css({
            "display": "flex"
        });
        document.body.style.overflow = 'hidden';
    }

    handleUserViewAddFilterClickEvent(event) {
        if (event.target.className === 'addUser') {
            $("#addUserForm").css({
                "display": "none"
            });
            this.handleReset();
        }
    }

    handleImageSetEvent() {

        const file = $('#userImgFile')[0].files[0];
        userImg = file;
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $('#userImage').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad")
        }
    }

    handleNavContainer(id, btn) {
        this.handleHideAllContainer();
        $(id).css({
            "display": "block"
        });
        this.handleSetNavBtnSelectedStyle(btn);
    }

    handleHideAllContainer() {
        $('.user-list').css({
            "display": "none"
        });
        $('.admins-list').css({
            "display": "none"
        });
    }

    handleSetNavBtnSelectedStyle(btn) {
        this.handleRestAllNavBtnStyles();
        $(btn).css({
            "color": "rgb(255, 0, 0)",
        });
    }

    handleRestAllNavBtnStyles() {
        $('.users .usersNav ul li').css({
            "color": "rgba(0, 0, 0, 0.6)",
        });
    }

    handleLoadAllData(page, count) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/user/getAll?page=" + page + "&count=" + count,
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleLoadUser(resp.data);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleValidation(fun) {

        !/^([A-Za-z ]{3,})$/.test($('#nameTxt').val()) ? alert("User name invalid or empty !") :
            !/^([A-Za-z0-9]{10,})$/.test($('#nicTxt').val()) ? alert("Nic invalid or empty !") :
                !/^[A-Za-z ]+$/.test($('#addressTxt').val()) ? alert("Address invalid or empty !") :
                    !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#emailTxt').val()) ? alert("Email invalid or empty !") :
                        !/^([A-Za-z0-9@]{4,})$/.test($('#passwordTxt').val()) ? alert("Password invalid or empty !") :
                            fun === 'update' ? this.handleUpdateUser() :
                                !$('#userImgFile')[0].files[0] ? alert("Please select the image !") :
                                    this.handleSaveUser();
    }

    handleSaveUser() {

        const user = this.handleGetObject();

        const userFormData = new FormData();

        userFormData.append('file', userImg);
        userFormData.append('user', user);

        $.ajax({
            url: defaultGateway + "/register",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: userFormData,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllData(0, count);
                    this.handleReset();
                    $('#addUserForm').click();
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleGetObject() {

        return JSON.stringify(new User(
            userId,
            $('#nameTxt').val(),
            $('#nicTxt').val(),
            $('#addressTxt').val(),
            $('#emailTxt').val(),
            $('#passwordTxt').val(),
            null,
            null
        ));
    }

    handleLoadUser(data) {

        if (data.length !== 0) {

            $('#userUl li').remove();

            data.map(value => {

                let li = "<li>\n" +
                    "                    <img src=\"assets/images/google.png\">\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <button type=\"button\">Edit</button>\n" +
                    "                </li>";

                $('#userUl').append(li);
                $('#userUl li:last-child img').attr('src', `data:image/png;base64,${value.userImage}`);
                $('#userUl li:last-child h3:nth-child(2)').text(value.userId);
                $('#userUl li:last-child h3:nth-child(3)').text(value.userName);
                $('#userUl li:last-child h3:nth-child(4)').text(value.nic);
                $('#userUl li:last-child h3:nth-child(5)').text(value.address);
                $('#userUl li:last-child h3:nth-child(6)').text(value.email);
            });
            userHasPage = true;
        } else {
            userHasPage = false;
        }
    }

    handleReset() {

        userId = null;
        $('#userImage').attr('src', `${defaultImg}`);
        $('#nameTxt').val("");
        $('#nicTxt').val("");
        $('#addressTxt').val("");
        $('#emailTxt').val("");
        $('#passwordTxt').val("");
        $('#userImgFile').val("");
        userImg = undefined;
        nic = null;
        document.body.style.overflow = 'auto';

        $('#saveUserBtn').css({'display': 'block'});
        $('#updateUserBtn').css({'display': 'none'});
        $('#deleteUserBtn').css({'display': 'none'});

        uNextPage = 1;
        uCurrentPage = 0;
    }

    handleUserEditeEvent() {

        $('#userUl').on('click', 'button', (event) => {
            nic = $(event.target).closest('li').find('h3:nth-child(4)').text();

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;

                $.ajax({
                    url: defaultGateway + "/user/get?nic=" + nic,
                    method: "GET",
                    processData: false,
                    contentType: false,
                    async: true,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            this.handleEditDetails(resp.data);
                            console.log(resp.message);
                        }
                    },
                    error: (ob) => {
                        console.log(ob)
                        alert(ob.responseJSON.message);
                    },
                });
            }
        });
    }

    handleEditDetails(data) {

        userId = data.userId;
        $("#userImage").attr('src', `data:image/png;base64,${data.userImage}`);
        $("#nameTxt").val(data.userName);
        $("#nicTxt").val(data.nic);
        $("#addressTxt").val(data.address);
        $("#emailTxt").val(data.email);
        $("#passwordTxt").val(data.password);

        userImg = this.handleGetNewImgFile(data.userImage, 'user_img');

        $('#saveUserBtn').css({'display': 'none'});
        $('#updateUserBtn').css({'display': 'block'});
        $('#deleteUserBtn').css({'display': 'block'});

        this.handleUserAddEvent();
    }

    handleGetNewImgFile(base64Array, imageName) {

        const byteString = atob(base64Array);
        const blob = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }

        return new File([blob], imageName + ".jpg", {type: "image/jpeg"});
    }

    handleUpdateUser() {

        const userLog = JSON.parse(localStorage.getItem("USER"));

        if (userLog) {

            const token = userLog.token;

            const user = this.handleGetObject();

            const userFormData = new FormData();

            userFormData.append('file', userImg);
            userFormData.append('user', user);

            $.ajax({
                url: defaultGateway + "/user",
                method: "PUT",
                processData: false,
                contentType: false,
                async: true,
                data: userFormData,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.message);
                        this.handleLoadAllData(0, count);
                        this.handleReset();
                        $('#addUserForm').click();
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleDeleteUser(userId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/user?userId=" + userId,
                method: "DELETE",
                processData: false,
                contentType: false,
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.message);
                        this.handleLoadAllData(0, count);
                        this.handleReset();
                        $('#addUserForm').click();
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }
}
export function loadUser() {
    this.handleLoadAllData(0, count);
}
new UsersController();