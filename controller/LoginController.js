import {User} from "../model/User.js";
import {handleHideHotelEdit, handleShowHotelEdit} from "./HotelController.js";
import {handleHideVehicleEdit, handleShowVehicleEdit} from "./VehicleController.js";
import {loadGuide} from "./GuideController.js";
import {loadUser} from "./UsersController.js";
import {loadPackage} from "./EditPackageController.js";


const defaultGateway = "http://localhost:8080/nexttravel/api/v1/auth";

export class LoginController {
    constructor() {
        $('.backLogin').on('click', () => {
            this.handleRemoveLog();
        });
        $('#loginBtn').on('click', () => {
            this.handleShowLog();
        });
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
        $('#logIn').on('click', () => {
            this.handleLoginValidation();
        });
        $('#signOutBtn').on('click', () => {
            this.handleSignOut();
        });
        $('#updateProfileBtn').on('click', () => {
            this.handleUpdateUser();
        });
        this.handleLoginExpiration();
        this.handleRemoveLog();
    }

    handleLoginExpiration(){

        const user = JSON.parse(localStorage.getItem("USER"));
        if (user !== null){
            $.ajax({
                url: defaultGateway + "/validate",
                method: "GET",
                async: true,
                success: (resp) => {
                    console.log(resp)
                    if (resp.code === 200) {
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    //localStorage.removeItem("USER");
                    //swal("Oops...", "Something went wrong!", ob.responseJSON);
                },
            });
        }
    }

    handleRemoveLog() {

        const user = JSON.parse(localStorage.getItem("USER"));
        if (user === null || user.role === "USER"){
            handleHideHotelEdit();
            handleHideVehicleEdit();
            this.handleHideAllNav();
            if (user !== null && user.role === "USER"){
                this.handleShowCart();
            }
        }
        if (user !== null && user.role === "ADMIN_HOTEL"){
            handleShowHotelEdit();
            handleHideVehicleEdit();
            this.handleHideAllNav();
            this.handleHideCart();
        }
        if (user !== null && user.role === "ADMIN_VEHICLE"){
            handleShowVehicleEdit()
            handleHideHotelEdit();
            this.handleHideAllNav();
            this.handleHideCart();
            this.handleShowNavBtn('#financialNavBtn');
        }
        if (user !== null && user.role === "ADMIN_PACKAGE"){
            handleHideHotelEdit();
            handleHideVehicleEdit();
            loadPackage();
            this.handleHideAllNav();
            this.handleHideCart();
            this.handleShowNavBtn('#editPackageNavBtn');
            this.handleShowNavBtn('#financialNavBtn');
        }
        if (user !== null && user.role === "ADMIN_USER"){
            handleHideHotelEdit();
            handleHideVehicleEdit();
            loadUser();
            this.handleHideAllNav();
            this.handleHideCart();
            this.handleShowNavBtn('#userNavBtn');
            this.handleShowNavBtn('#financialNavBtn');
        }
        if (user !== null && user.role === "ADMIN_GUIDE"){
            handleHideHotelEdit();
            handleHideVehicleEdit();
            loadGuide();
            this.handleHideAllNav();
            this.handleHideCart();
            this.handleShowNavBtn('#guideNavBtn');
            this.handleShowNavBtn('#financialNavBtn');
        }
        $('.log').css({'display': 'none'});
        $('.signIn').css({'display': 'none'});
        document.body.style.overflow = 'auto';
        $('#packageNavBtn').click();
    }

    handleShowCart(){
        $('#viewCart').css({'display':'flex'});
    }
    handleHideCart(){
        $('#viewCart').css({'display':'none'});
    }

    handleShowNavBtn(id){

        $(id).css({'display':'block'});
    }

    handleHideAllNav(){

        const array = ['#guideNavBtn', '#userNavBtn', '#editPackageNavBtn', '#financialNavBtn'];

        array.map(value => {
            $(value).css({'display':'none'});
        });
    }

    handleShowLog() {

        const user = localStorage.getItem("USER");
        if (user){
            this.handleSetProfile();
            this.handleShowContainer('.profile');
        }else {
            this.handleShowContainer('.signUp');
        }
    }

    handleShowContainer(id){

        this.handleHideAll();
        $('.log').css({'display': 'block'});
        $(id).css({'display' : 'block'});
        document.body.style.overflow = 'hidden';
    }

    handleHideAll(){

        const array = ['.profile', '.signUp', '.signIn'];

        array.map(value => {
            $(value).css({'display' : 'none'});
        });
    }

    handleCreatAccount() {

        !/^[A-Za-z ]+/.test($('#userName').val()) ? swal("User name invalid or empty !") :
            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#createEmail').val()) ? swal("Invalid email !") :
                !/^[a-zA-Z0-9@]{3,}$/.test($('#creatPassword').val()) ? swal("Invalid password !") :
                    !/^[0-9]{10}$/.test($('#nic').val()) ? swal("Invalid Nic !") :
                        !$("#imageFile")[0].files[0] ? swal("Please select the image !") : this.handleSaveUser();
    }

    handleSaveUser() {

        const user = JSON.stringify(new User(
            null,
            $('#userName').val(),
            $('#nic').val(),
            $('#address').val(),
            $('#createEmail').val(),
            $('#creatPassword').val(),
            null,
            null
        ));


        const formData = new FormData();
        const fileInput = $('#imageFile')[0].files[0];

        formData.append('file',  fileInput);
        formData.append('user',  new Blob([user], { type: "application/json" }));

        $.ajax({
            url: defaultGateway + "/register",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formData,
            success: (resp) => {
                console.log(resp)
                if (resp.code == 200) {
                    swal("Register successful !", "Click the ok !", "success");
                    this.handleReset();
                    this.handleDefaultLoad();
                    this.handleLoadFrom('.signUp');
                }
            },
            error: (ob) => {
                console.log(ob)
                swal("Oops...", "Something went wrong!", ob.responseJSON.message);
            },
        });
    }

    handleReset() {

        $('#email').val('');
        $('#password').val('');
        $('#userName').val('');
        $('#createEmail').val('');
        $('#creatPassword').val('');
        $('#nic').val('');
        $('#address').val('');
        $('#imageFile').val('');
    }

    handleDefaultLoad() {
        $(".signIn").css({
            "display": "none"
        });
    }

    handleLoadFrom(id) {
        $(id).css({
            "display": "block"
        });
    }

    handleLogin() {

        const authRequest = JSON.stringify({
            email:$('#email').val(),
            password:$('#password').val()
        });

        $.ajax({
            url: defaultGateway + "/token",
            method: "POST",
            contentType: "application/json",
            async: true,
            data: authRequest,
            success: (resp) => {
                console.log(resp)
                if (resp.code == 200) {
                    console.log(resp.message);
                    localStorage.setItem("USER", JSON.stringify(resp.data));
                    this.handleSetProfile();
                    /*this.handleReset();
                    this.handleDefaultLoad();
                    this.handleLoadFrom('.signUp');*/
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoginValidation() {

        !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#email').val()) ? alert("Invalid email !") :
            !/^[a-zA-Z0-9@]{3,}$/.test($('#password').val()) ? alert("Invalid password !") :
                this.handleLogin();
    }

    handleSetProfile() {

        const data = JSON.parse(localStorage.getItem("USER"));

        $('#emailLbl').text(data.email);
        $('#profileUsername').val(data.username);
        this.handleShowContainer('.profile');

        if (data.imgArray){
            $("#profileImg").attr('src', `data:image/png;base64,${data.imgArray}`);
            $("#navImg").attr('src', `data:image/png;base64,${data.imgArray}`);
        }
        else {
            $('#profileImg').attr('src', `assets/images/defaultUser.jpg`);
            $('#navImg').attr('src', `assets/images/defaultUser.jpg`);
        }
    }

    handleSignOut() {

        localStorage.removeItem("USER");
        this.handleShowContainer('.signUp');
        $('#profileImg').attr('src', `assets/images/defaultUser.jpg`);
        $('#navImg').attr('src', `assets/images/defaultUser.jpg`);
        this.handleReset();
        this.handleHideCart();
    }

    handleUpdateUser() {

        if (!/^[A-Za-z ]+/.test($('#profileUsername').val())){
            swal("User name invalid or empty !");
            return;
        }
         if (!/^[a-zA-Z0-9@]{3,}$/.test($('#aldPasswordTxt').val())){
             swal("Old password invalid oe empty !");
             return;
         }
        if (!/^[a-zA-Z0-9@]{3,}$/.test($('#newPasswordTxt').val())){
            swal("New password invalid oe empty !");
            return;
        }

        const updateObj = JSON.stringify({
            email:$('#emailLbl').text(),
            userName:$('#profileUsername').val(),
            oldPassword:$('#aldPasswordTxt').val(),
            newPassword:$('#newPasswordTxt').val()
        });

        const user = JSON.parse(localStorage.getItem("USER"));

        console.log(updateObj)
        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/user/update",
                method: "PUT",
                contentType: "application/json",
                async: true,
                data:updateObj,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.message);
                        swal("Update successful !", "Click the ok !", "success");
                        user.username = resp.data.userName;
                        localStorage.setItem("USER", JSON.stringify(user));
                        $('#aldPasswordTxt').val('');
                        $('#newPasswordTxt').val('');
                        this.handleShowLog();
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
export function reLogin(){
    loginController.handleRemoveLog();
}

let loginController = new LoginController();