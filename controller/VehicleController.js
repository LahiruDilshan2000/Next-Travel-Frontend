import {Vehicle} from "../model/Vehicle.js";

let vehicleId = null;
let imgId = undefined;
let arrayIndex = undefined;
const imageFileList = new Array(7);
const defaultImg = 'assets/images/defaultimage.jpg';
let qty = null;
let vNextPage = 1;
let vCurrentPage = 0;
const count = 8;
let vehicleHasPage = false;
const defaultGateway = "http://localhost:8080/vehicle-service/";

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
        $("#vehicleView div.form-group.col-md-2 > i").on('click', () => {
            this.handleHotelViewEditOptions();
        });
        $("#nextAddVehicleBtn").on('click', () => {
            this.handleNextVehicleList();
        });
        $("#previousAddVehicleBtn").on('click', () => {
            this.handlePreviousVehicleList();
        });
        $("#searchVehicleBtn").on('click', () => {
            this.handleSearchVehicle(0, count);
        });
        $("#restVehicle").on('click', () => {
            this.handleRestSearch();
        });
        this.handleLoadAllData(0, count);
        this.handleVehicleViewEvent();
    }

    handleRestSearch(){

        const seat = $('#searchVehicleSeatTxt');
        const fuel = $('#searchVehicleFuelAndTransmissionCmb');
        if (seat.val() || fuel.val() !== 'default'){
            this.handleLoadAllData(0, 8);
            seat.val("");
            fuel.val('default');
            vNextPage = 1;
            vCurrentPage = 0;
        }
    }

    handleNextVehicleList() {

        if (!$('#searchVehicleSeatTxt').val() && $('#searchVehicleFuelAndTransmissionCmb').val() === 'default') {
            if (vNextPage !== 0) {
                this.handleLoadAllData(vNextPage, count);
                if (vehicleHasPage) {
                    vCurrentPage++;
                    vNextPage++;
                }
            }
        }else {
            this.handleSearchVehicle(vNextPage, count);
            if (vehicleHasPage) {
                vCurrentPage++;
                vNextPage++;
            }
        }
    }

    handlePreviousVehicleList() {

        if (!$('#searchVehicleSeatTxt').val() && $('#searchVehicleFuelAndTransmissionCmb').val() === 'default') {
            if (vCurrentPage !== 0) {
                vCurrentPage--;
                vNextPage--;
                this.handleLoadAllData(vCurrentPage, count);
            }
        }else {
            if (vCurrentPage !== 0) {
                vCurrentPage--;
                vNextPage--;
                this.handleSearchVehicle(vCurrentPage, count);
            }
        }
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
        });
        document.body.style.overflow = 'hidden';
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

    handleSearchVehicle(page, count){

        const  seat = $('#searchVehicleSeatTxt').val();
        const  fuelAndTrans = $('#searchVehicleFuelAndTransmissionCmb').val();

        if(seat && fuelAndTrans !== 'default'){
            this.handleSearchVehicleBySeatCapacityAndFelAndTransmission(page, count, parseInt(seat), fuelAndTrans);
        }else if(seat){
            this.handleSearchVehicleBySeatCapacity(page, count, parseInt(seat));
        }else if (fuelAndTrans !== 'default'){
            this.handleSearchVehicleByFelAndTransmission(page, count, fuelAndTrans);
        }
    }
    handleSearchVehicleBySeatCapacityAndFelAndTransmission(page, count, seatCapacity, fuelAndTrans){

        console.log(page)
        console.log(count)
        console.log(seatCapacity)
        console.log(fuelAndTrans)
        $.ajax({
            url: defaultGateway + "nexttravel/api/v1/vehicle/getAllWithSeatAndFulWithTrans?page=" +
                page + "&count=" + count + "&seatCapacity=" + seatCapacity + "&fuelAndTrans=" + fuelAndTrans,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadItem(resp.data);
                    console.log(resp.message);

                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleSearchVehicleBySeatCapacity(page, count, seatCapacity){

        $.ajax({
            url: defaultGateway + "nexttravel/api/v1/vehicle/getAllWithSeatCapacity?page=" +
                page + "&count=" + count + "&seatCapacity=" + seatCapacity,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadItem(resp.data);
                    console.log(resp.message);

                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleSearchVehicleByFelAndTransmission(page, count, fuelAndTrans){

        $.ajax({
            url: defaultGateway + "nexttravel/api/v1/vehicle/getAllWithFuelAndTransmission?page=" +
                page + "&count=" + count + "&fuelAndTrans=" + fuelAndTrans,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadItem(resp.data);
                    console.log(resp.message);

                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoadChangeEvent(imgId, arrayIndex) {

        const selector = $("#vehicleAddImgFile");
        const file = selector[0].files[0];
        imageFileList[arrayIndex] = file;
        selector.val('');

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

        const formVehicleData = new FormData();

        imageFileList.map(value => {
            formVehicleData.append('imageList', value);
        });

        formVehicleData.append('vehicle', vehicle);

        $.ajax({
            url: defaultGateway + "nexttravel/api/v1/vehicle",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllData(0, count);
                    this.handleReset();
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoadAllData(page, count) {

        $.ajax({
            url: defaultGateway + "nexttravel/api/v1/vehicle/getAll?page=" + page + "&count=" + count,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
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

        if (data.length !== 0) {

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
            vehicleHasPage = true;
        }else {
            vehicleHasPage = false;
        }
    }

    handleVehicleViewEvent() {
        $('#vehicleUl').on('click', 'i', (event) => {
            vehicleId = parseInt($(event.target).closest('li').find('h2').text());

            $.ajax({
                url: defaultGateway + "nexttravel/api/v1/vehicle/get?vehicleId=" + vehicleId,
                method: "GET",
                processData: false,
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
        $("#vehicleViewImg1").attr('src', `data:image/png;base64,${data.imageList[0]}`);
        $("#vehicleViewImg2").attr('src', `data:image/png;base64,${data.imageList[1]}`);
        $("#vehicleViewImg3").attr('src', `data:image/png;base64,${data.imageList[2]}`);
        $("#vehicleViewImg4").attr('src', `data:image/png;base64,${data.imageList[3]}`);
        $("#vehicleViewImg5").attr('src', `data:image/png;base64,${data.imageList[4]}`);
        $("#drivingLicenseImg1").attr('src', `data:image/png;base64,${data.imageList[5]}`);
        $("#drivingLicenseImg2").attr('src', `data:image/png;base64,${data.imageList[6]}`);
        $("#vehicleBrandLbl").text(data.vehicleBrand);
        $("#vehicleCategoryLbl").text(data.vehicleCategory);
        $("#vehicleTypeLbl").text(data.vehicleType);
        $("#vehicleFuelAndTransmissionLbl").text(data.fuelAndTransmissionType);
        $("#vehicleVersionTypeLbl").text(data.versionType);
        $("#vehicleFuelUsageLbl").text(data.fuelUsage);
        $("#vehicleFreeForDayLbl").text(data.freeForDay);
        $("#vehicleFreeFor1KmLbl").text(data.freeFor1Km);
        $("#vehicleDriverNameLbl").text(data.driverName);
        $("#vehicleDriverContactLbl").text(data.driverContact);
        $("#vehicleSeatCapacityLbl").text(data.seatCapacity);
        qty = data.qty;

        imageFileList[0] = this.handleGetNewImgFile(data.imageList[0], 'vehicle_img_1');
        imageFileList[1] = this.handleGetNewImgFile(data.imageList[1], 'vehicle_img_2');
        imageFileList[2] = this.handleGetNewImgFile(data.imageList[2], 'vehicle_img_3');
        imageFileList[3] = this.handleGetNewImgFile(data.imageList[3], 'vehicle_img_4');
        imageFileList[4] = this.handleGetNewImgFile(data.imageList[4], 'vehicle_img_5');
        imageFileList[5] = this.handleGetNewImgFile(data.imageList[5], 'driving_license_img_1');
        imageFileList[6] = this.handleGetNewImgFile(data.imageList[6], 'driving_license_img_2');


        document.body.style.overflow = 'hidden';

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

        $("#vehicleAddImg1").attr('src', `${$("#vehicleViewImg1").attr('src')}`);
        $("#vehicleAddImg2").attr('src', `${$("#vehicleViewImg2").attr('src')}`);
        $("#vehicleAddImg3").attr('src', `${$("#vehicleViewImg3").attr('src')}`);
        $("#vehicleAddImg4").attr('src', `${$("#vehicleViewImg4").attr('src')}`);
        $("#vehicleAddImg5").attr('src', `${$("#vehicleViewImg5").attr('src')}`);
        $("#driverLicenseImg1").attr('src', `${$("#drivingLicenseImg1").attr('src')}`);
        $("#driverLicenseImg2").attr('src', `${$("#drivingLicenseImg2").attr('src')}`);
        $('#vehicleAddBrandTxt').val($("#vehicleBrandLbl").text());
        $('#vehicleCategoryCmb').val($("#vehicleCategoryLbl").text());
        $('#vehicleTypeCmb').val($("#vehicleTypeLbl").text());
        $('#fuelAndTransmissionTypeCmb').val($("#vehicleFuelAndTransmissionLbl").text());
        $('#versionCmb').val($("#vehicleVersionTypeLbl").text());
        $('#fuelUsageTxt').val($("#vehicleFuelUsageLbl").text());
        $('#freeForDayTxt').val($("#vehicleFreeForDayLbl").text());
        $('#freeFor1KmTxt').val($("#vehicleFreeFor1KmLbl").text());
        $('#driverNameTxt').val($("#vehicleDriverNameLbl").text());
        $('#driverContactTxt').val($("#vehicleDriverContactLbl").text());
        $('#seatCapacityTxt').val($("#vehicleSeatCapacityLbl").text());
        $('#vehicleQtyTxt').val(qty);

        $('#vehicleView').css({
            "display": "none"
        });
        $('#SaveVehicleBtn').css({
            "display": "none"
        });
        $('#updateVehicleBtn').css({
            "display": "block"
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
            url: defaultGateway + "nexttravel/api/v1/vehicle",
            method: "PUT",
            processData: false,
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllData(0, count);
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
                url: defaultGateway + "nexttravel/api/v1/vehicle?vehicleId=" + vehicleId,
                method: "DELETE",
                dataType: "json",
                async: true,
                success: (resp) => {
                    console.log(resp)
                    if (resp.code === 200) {
                        console.log(resp.message);
                        this.handleLoadAllData(0, count);
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

        $("#vehicleAddImg1").attr('src', `${defaultImg}`);
        $("#vehicleAddImg2").attr('src', `${defaultImg}`);
        $("#vehicleAddImg3").attr('src', `${defaultImg}`);
        $("#vehicleAddImg4").attr('src', `${defaultImg}`);
        $("#vehicleAddImg5").attr('src', `${defaultImg}`);
        $("#driverLicenseImg1").attr('src', `${defaultImg}`);
        $("#driverLicenseImg2").attr('src', `${defaultImg}`);
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

        this.handleRemoveStyles();

        for (let i = 0; i < imageFileList.length; i++){
            imageFileList[i] = undefined;
        }
        vehicleId = null;

        document.body.style.overflow = 'auto';

        $("#vehicleView").css({
            "display": "none"
        });
        $("#vehicleAdd").css({
            "display": "none"
        });
        $('#SaveVehicleBtn').css({
            "display": "block"
        });
        $('#updateVehicleBtn').css({
            "display": "none"
        });

        vNextPage = 1;
        vCurrentPage = 0;
    }

    handleHotelViewEditOptions() {

        $("#vehicleView div.form-group.col-md-2 > i").hasClass('remove') ? this.handleRemoveStyles() : this.handleAddStyles();

    }

    handleAddStyles() {

        $('#vehicleView > div > form > div > div:nth-child(14) span').css({
            'width': '100%',
            'height': '100%'
        });

        $('#vehicleView div.form-group.col-md-2 > i').css({
            'transform': `rotate(${46}deg)`,
            'background': 'rgba(255, 0, 0, 0.5)',
            'color': 'rgba(255, 255, 255, 0.8)'

        });

        $("#vehicleView div.form-group.col-md-2 > i").addClass('remove');
    }

    handleRemoveStyles() {

        $('#vehicleView > div > form > div > div:nth-child(14) span').css({
            'width': '0',
            'height': '0'
        });

        $($('#vehicleView div.form-group.col-md-2 > i')).css({
            'transform': `rotate(${0}deg)`,
            'background': 'none',
            'color': 'rgba(0, 0, 0, 0.7)'
        });

        $("#vehicleView div.form-group.col-md-2 > i").removeClass('remove');
    }
}

new VehicleController();