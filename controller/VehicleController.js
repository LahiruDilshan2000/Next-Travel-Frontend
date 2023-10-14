import {Vehicle} from "../model/Vehicle.js";

let vehicleId = null;
let imgId = undefined;
let arrayIndex = undefined;
const imageFileList = new Array(7);

export class VehicleController {
    constructor() {
        $('#vehicleAddBtn').on('click', () => {
            this.handleVehicleAddContainerShowEvent();
        });
        $('#vehicleAdd').on('click', (event) => {
            this.handleVehicleAddContainerHideEvent(event);
        });
        $('#vehicleAddImg1').on('click', () => {
            this.handleLoadImageEvent('#vehicleAddImg1', 0);
        });
        $('#vehicleAddImg2').on('click', () => {
            this.handleLoadImageEvent('#vehicleAddImg2', 1);
        });
        $('#vehicleAddImg3').on('click', () => {
            this.handleLoadImageEvent('#vehicleAddImg3', 2);
        });
        $('#vehicleAddImg4').on('click', () => {
            this.handleLoadImageEvent('#vehicleAddImg4', 3);
        });
        $('#vehicleAddImg5').on('click', () => {
            this.handleLoadImageEvent('#vehicleAddImg5', 4);
        });
        $('#driverLicenseImg1').on('click', () => {
            this.handleLoadImageEvent('#driverLicenseImg1', 5);
        });
        $('#driverLicenseImg2').on('click', () => {
            this.handleLoadImageEvent('#driverLicenseImg2', 6);
        });
        $('#vehicleAddImgFile').on('change', () => {
            this.handleLoadChangeEvent(imgId, arrayIndex);
        });
        $('#SaveVehicleBtn').on('click', () => {
            this.handleValidation("save");
        });
        $('#btnVehicleEdit').on('click', () => {
            this.handleVehicleEditDetails();
        });
        $('#updateVehicleBtn').on('click', () => {
            this.handleValidation("update");
        });
        $('#btnVehicleDelete').on('click', () => {
            this.handleVehicleDelete(vehicleId);
        });
        $("#vehicleView").on('click', (event) => {
            this.handleVehicleViewFilterClickEvent(event);
        });
        this.handleLoadAllData();
        this.handleVehicleViewEvent();
    }

    handleVehicleViewFilterClickEvent(event) {

        if (event.target.className === 'vehicleView') {
            $("#vehicleView").css({
                "display": "none"
            });
            this.handleReset();
        }
    }

    handleVehicleAddContainerShowEvent() {
        $('#vehicleAdd').css({
            "display": "flex"
        })
    }

    handleVehicleAddContainerHideEvent(event) {
        if (event.target.className === 'vehicleAdd') {
            $("#vehicleAdd").css({
                "display": "none"
            });
            this.handleReset();
        }
    }

    handleLoadImageEvent(id, index) {

        imgId = id;
        arrayIndex = index;
        $('#vehicleAddImgFile').click();
    }

    handleLoadChangeEvent(imgId, arrayIndex) {

        const file = $("#vehicleAddImgFile")[0].files[0];
        imageFileList[arrayIndex] = file;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $(imgId).attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad");
        }
    }


    handleValidation(fun) {
        !/^[A-Za-z0-9 ]+$/.test($('#vehicleAddBrandTxt').val()) ? alert("Vehicle brand invalid or empty !") :
            $('#vehicleCategoryCmb').val() === 'default' ? alert("Vehicle category is empty !") :
                $('#fuelAndTransmissionTypeCmb').val() === 'default' ? alert("Vehicle fuel and transmission is empty !") :
                    $('#vehicleTypeCmb').val() === 'default' ? alert("Vehicle type is empty !") :
                        $('#versionCmb').val() === 'default' ? alert("Vehicle version type is empty !") :
                            !/^[0-9]+$/.test($('#freeForDayTxt').val()) ? alert("Free for day invalid or empty !") :
                                !/^[0-9]+$/.test($('#freeFor1KmTxt').val()) ? alert("Free for 1 km invalid or empty !") :
                                    !/^[0-9]+$/.test($('#fuelUsageTxt').val()) ? alert("Fuel usage invalid or empty !") :
                                        !/^[0-9]+$/.test($('#seatCapacityTxt').val()) ? alert("Seat capacity invalid or empty !") :
                                            !/^[0-9]+$/.test($('#vehicleQtyTxt').val()) ? alert("Qty invalid or empty !") :
                                                !/^[A-Za-z ]+$/.test($('#driverNameTxt').val()) ? alert("Driver name invalid or empty !") :
                                                    !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#driverContactTxt').val()) ? alert("Driver contact invalid or empty !") :
                                                        fun === "update" ? this.handleUpdateVehicle() :
                                                            !imageFileList[0] ? alert("Please select vehicle image !") :
                                                                !imageFileList[1] ? alert("Please select vehicle image !") :
                                                                    !imageFileList[2] ? alert("Please select vehicle image !") :
                                                                        !imageFileList[3] ? alert("Please select vehicle image !") :
                                                                            !imageFileList[4] ? alert("Please select vehicle image !") :
                                                                                !imageFileList[5] ? alert("Please select driver license image !") :
                                                                                    !imageFileList[6] ? alert("Please select driver license image !") :
                                                                                        this.handleSaveVehicle();
    }

    handleGetObject(){

        return JSON.stringify(new Vehicle(
            vehicleId,
            $('#vehicleAddBrandTxt').val(),
            $('#vehicleCategoryCmb').val(),
            $('#fuelAndTransmissionTypeCmb').val(),
            $('#vehicleTypeCmb').val(),
            $('#versionCmb').val(),
            $('#freeForDayTxt').val(),
            $('#freeFor1KmTxt').val(),
            $('#fuelUsageTxt').val(),
            $('#seatCapacityTxt').val(),
            $('#vehicleQtyTxt').val(),
            $('#driverNameTxt').val(),
            $('#driverContactTxt').val(),
            null
        ));
    }

    handleSaveVehicle() {

        const vehicle = this.handleGetObject();
        console.log(vehicle)

        const formVehicleData = new FormData();

        imageFileList.map(value => {
            formVehicleData.append('imageList', value);
        });

        formVehicleData.append('vehicle', vehicle);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                console.log(resp)
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllData();
                    this.handleReset();
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoadAllData() {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle/getAll",
            method: "GET",
            processData: false,
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadItem(resp.data);
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoadItem(data) {
        $('#vehicleUl li').remove();

        data.map(value => {

            let li = "<li>\n" +
                "                    <img src=\"assets/images/login.jpg\">\n" +
                "                    <h2>10</h2>\n" +
                "                    <h3>Hotel Galdari</h3>\n" +
                "                    <h3>Pandura</h3>\n" +
                "                    <i class=\"fa-solid fa-arrow-right\"></i>\n" +
                "                </li>";

            $('#vehicleUl').append(li);
            $('#vehicleUl li:last-child img').attr('src', `data:image/png;base64,${value.imageList[0]}`);
            $('#vehicleUl li:last-child h2').text(value.vehicleId);
            $('#vehicleUl li:last-child h3:nth-child(3)').text(value.vehicleBrand);
            $('#vehicleUl li:last-child h3:nth-child(4)').text(value.versionType);
        });
    }

    handleVehicleViewEvent() {
        $('#vehicleUl').on('click', 'i', (event) => {
            vehicleId = parseInt($(event.target).closest('li').find('h2').text());

            console.log(vehicleId);

            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/vehicle/get?vehicleId=" + vehicleId,
                method: "GET",
                processData: false, // Prevent jQuery from processing the data
                contentType: false,
                async: true,
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleViewDetails(resp.data);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        });
    }

    handleViewDetails(data) {

        vehicleId = data.vehicleId;
        $("#vehicleAddImg1").attr('src', `data:image/png;base64,${data.imageList[0]}`);
        $("#vehicleAddImg2").attr('src', `data:image/png;base64,${data.imageList[1]}`);
        $("#vehicleAddImg3").attr('src', `data:image/png;base64,${data.imageList[2]}`);
        $("#vehicleAddImg4").attr('src', `data:image/png;base64,${data.imageList[3]}`);
        $("#vehicleAddImg5").attr('src', `data:image/png;base64,${data.imageList[4]}`);
        $("#driverLicenseImg1").attr('src', `data:image/png;base64,${data.imageList[5]}`);
        $("#driverLicenseImg2").attr('src', `data:image/png;base64,${data.imageList[6]}`);
        $("#vehicleBrandLbl").text(data.vehicleBrand);
        $("#vehicleCategoryLbl").text(data.vehicleCategory);
        $("#vehicleFuelAndTransmissionLbl").text(data.fuelAndTransmissionType);
        $("#vehicleTypeLbl").text(data.vehicleType);
        $("#vehicleVersionTypeLbl").text(data.versionType);
        $("#freeForDayTxt").text(data.freeForDay);
        $("#freeFor1KmTxt").text(data.freeFor1Km);
        $("#vehicleFuelUsageLbl").text(data.fuelUsage);
        $("#vehicleSeatCapacityLbl").text(data.seatCapacity);
        $("#vehicleQtyLbl").text(data.qty);
        $("#driverNameTxt").text(data.driverName);
        $("#driverContactTxt").text(data.driverContact);

        imageFileList[0] = this.handleGetNewImgFile(data.imageList[0], 'vehicle_img_1');
        imageFileList[1] = this.handleGetNewImgFile(data.imageList[1], 'vehicle_img_2');
        imageFileList[2] = this.handleGetNewImgFile(data.imageList[2], 'vehicle_img_3');
        imageFileList[3] = this.handleGetNewImgFile(data.imageList[3], 'vehicle_img_4');
        imageFileList[4] = this.handleGetNewImgFile(data.imageList[4], 'vehicle_img_5');
        imageFileList[5] = this.handleGetNewImgFile(data.imageList[5], 'driving_license_img_1');
        imageFileList[6] = this.handleGetNewImgFile(data.imageList[6], 'driving_license_img_2');


        $('#vehicleView').css({
            "display": "flex"
        });
    }

    handleGetNewImgFile(base64Array, imageName) {

        const byteString = atob(base64Array);
        const blob = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }

        return new File([blob], imageName + ".jpg", {type: "image/jpeg"});
    }

    handleVehicleEditDetails() {

        $(".vehicleAddImg").attr('src', `${$(".vehicleViewImg").attr('src')}`);
        $('#vehicleAddBrandTxt').val($("#vehicleBrandLbl").text());
        $('#vehicleCategoryCmb').val($("#vehicleCategoryLbl").text());
        $('#fuelAndTransmissionTypeCmb').val($("#vehicleFuelAndTransmissionLbl").text());
        $('#versionCmb').val($("#vehicleVersionTypeLbl").text());
        $('#fuelUsageTxt').val($("#vehicleFuelUsageLbl").text());
        $('#seatCapacityTxt').val($("#vehicleSeatCapacityLbl").text());
        $('#vehicleTypeCmb').val($("#vehicleTypeLbl").text());
        $('#vehicleQtyTxt').val($("#vehicleQtyLbl").text());

        $('#vehicleView').css({
            "display": "none"
        });
        this.handleVehicleAddContainerShowEvent();
    }

    handleUpdateVehicle() {

        const vehicle = this.handleGetObject();

        const formVehicleData = new FormData();

        imageFileList.map(value => {
            formVehicleData.append('imageList', value);
        });

        formVehicleData.append('vehicle', vehicle);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle",
            method: "PUT",
            processData: false,
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                console.log(resp)
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllData();
                    this.handleReset();
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleVehicleDelete(vehicleId) {

        if (vehicleId) {
            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/vehicle?vehicleId=" + vehicleId,
                method: "DELETE",
                dataType: "json",
                async: true,
                success: (resp) => {
                    console.log(resp)
                    if (resp.code === 200) {
                        console.log(resp.message);
                        this.handleLoadAllData();
                        this.handleReset();
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleReset() {

        $("#vehicleAddImg1").attr('src', `assets/images/defaultimage.jpg`);
        $("#vehicleAddImg2").attr('src', `assets/images/defaultimage.jpg`);
        $("#vehicleAddImg3").attr('src', `assets/images/defaultimage.jpg`);
        $("#vehicleAddImg4").attr('src', `assets/images/defaultimage.jpg`);
        $("#vehicleAddImg5").attr('src', `assets/images/defaultimage.jpg`);
        $("#driverLicenseImg1").attr('src', `assets/images/defaultimage.jpg`);
        $("#driverLicenseImg2").attr('src', `assets/images/defaultimage.jpg`);
        $('#vehicleAddBrandTxt').val("");
        $('#vehicleCategoryCmb').val("default");
        $('#fuelAndTransmissionTypeCmb').val("default");
        $('#vehicleTypeCmb').val("default");
        $('#versionCmb').val("default");
        $('#freeForDayTxt').val("");
        $('#freeFor1KmTxt').val("");
        $('#fuelUsageTxt').val("");
        $('#seatCapacityTxt').val("");
        $('#vehicleQtyTxt').val("");
        $('#driverNameTxt').val("");
        $('#driverContactTxt').val("");

        for (let i = 0; i < imageFileList.length; i++){
            imageFileList[i] = undefined;
        }
        vehicleId = null;

        $("#vehicleView").css({
            "display": "none"
        });
        $("#vehicleAdd").css({
            "display": "none"
        });
    }
}

new VehicleController();