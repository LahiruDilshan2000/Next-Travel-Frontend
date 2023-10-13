import {Vehicle} from "../model/Vehicle.js";

let vehicleId = undefined;

export class VehicleController {
    constructor() {
        $('#vehicleAddBtn').on('click', () => {
            this.handleVehicleAddContainerShowEvent();
        });
        $('#vehicleAdd').on('click', (event) => {
            this.handleVehicleAddContainerHideEvent(event);
        });
        $('#vehicleAddImgFile').on('change', () => {
            this.handleImageLoadEvent();
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
        }
    }

    handleImageLoadEvent() {

        const file = $('#vehicleAddImgFile')[0].files[0];
        const selectedImage = $('.vehicleAddImg');
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                selectedImage.attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad")
        }
    }

    handleValidation(fun) {
        !/^[A-Za-z0-9 ]+$/.test($('#vehicleAddBrandTxt').val()) ? alert("Vehicle brand invalid or empty !") :
            !/^[0-9]+$/.test($('#fuelUsageTxt').val()) ? alert("Fuel usage invalid or empty !") :
                !/^[0-9]+$/.test($('#seatCapacityTxt').val()) ? alert("Seat capacity invalid or empty !") :
                    !/^[0-9]+$/.test($('#vehicleQtyTxt').val()) ? alert("Qty invalid or empty !") :
                        fun === "update" ? this.handleUpdateVehicle() :
                            !$('#vehicleAddImgFile')[0].files[0] ? alert("Please select the image !") :
                                this.handleSaveVehicle();
    }

    handleSaveVehicle() {

        const vehicle = JSON.stringify(new Vehicle(
            null,
            $('#vehicleAddBrandTxt').val(),
            $('#vehicleCategoryCmb').val(),
            $('#fuelAndTransmissionTypeCmb').val(),
            $('#versionCmb').val(),
            $('#fuelUsageTxt').val(),
            $('#seatCapacityTxt').val(),
            $('#vehicleTypeCmb').val(),
            $('#vehicleQtyTxt').val(),
            null
        ));
        console.log(vehicle)

        const formVehicleData = new FormData();
        const fileInput = $('#vehicleAddImgFile')[0].files[0];

        formVehicleData.append('file', fileInput);
        formVehicleData.append('vehicle', vehicle);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle",
            method: "POST",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                console.log(resp)
                if (resp.code === 200) {
                    alert(resp.message);
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
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadItem(resp.data);
                    alert(resp.message);
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
            $('#vehicleUl li:last-child img').attr('src', `data:image/png;base64,${value.imageLocation}`);
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

        $(".vehicleViewImg").attr('src', `data:image/png;base64,${data.imageLocation}`);
        $("#vehicleBrandLbl").text(data.vehicleBrand);
        $("#vehicleCategoryLbl").text(data.vehicleCategory);
        $("#vehicleFuelAndTransmissionLbl").text(data.fuelAndTransmissionType);
        $("#vehicleTypeLbl").text(data.vehicleType);
        $("#vehicleVersionTypeLbl").text(data.versionType);
        $("#vehicleFuelUsageLbl").text(data.fuelUsage);
        $("#vehicleSeatCapacityLbl").text(data.seatCapacity);
        $("#vehicleQtyLbl").text(data.qty);


        $('#vehicleView').css({
            "display": "flex"
        });
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

        $("#vehicleAdd").css({
            "display": "flex"
        });
    }

    handleUpdateVehicle() {

        const vehicle = JSON.stringify(new Vehicle(
            vehicleId,
            $('#vehicleAddBrandTxt').val(),
            $('#vehicleCategoryCmb').val(),
            $('#fuelAndTransmissionTypeCmb').val(),
            $('#versionCmb').val(),
            $('#fuelUsageTxt').val(),
            $('#seatCapacityTxt').val(),
            $('#vehicleTypeCmb').val(),
            $('#vehicleQtyTxt').val(),
            null
        ));

        if ($('#vehicleAddImgFile')[0].files[0]){
            this.handleVehicleUpdateWithImg(vehicle);
        }else {
            this.handleVehicleUpdateWithoutImg(vehicle);
        }
    }

    handleVehicleUpdateWithImg(vehicle) {

        const formVehicleData = new FormData();
        const fileInput = $('#vehicleAddImgFile')[0].files[0];

        formVehicleData.append('file', fileInput);
        formVehicleData.append('vehicle', vehicle);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle",
            method: "PUT",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formVehicleData,
            success: (resp) => {
                console.log(resp)
                if (resp.code === 200) {
                    alert(resp.message);
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleVehicleUpdateWithoutImg(vehicle) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle/without",
            method: "PUT",
            dataType: "json",
            contentType: "application/json",
            async: true,
            data: vehicle,
            success: (resp) => {
                console.log(resp)
                if (resp.code === 200) {
                    alert(resp.message);
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleVehicleDelete(vehicleId) {

        if (vehicleId){
            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/vehicle?vehicleId=" + vehicleId,
                method: "DELETE",
                dataType: "json",
                async: true,
                success: (resp) => {
                    console.log(resp)
                    if (resp.code === 200) {
                        alert(resp.message);
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

new VehicleController();