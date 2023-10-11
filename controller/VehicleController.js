import {Vehicle} from "../model/Vehicle.js";

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
            this.handleValidation();
        });
        this.handleLoadAllData();
        this.handleVehicleViewEvent();
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

    handleValidation() {
        !/^[A-Za-z0-9 ]+$/.test($('#vehicleAddBrandTxt').val()) ? alert("Vehicle brand invalid or empty !") :
            !/^[0-9]+$/.test($('#fuelUsageTxt').val()) ? alert("Fuel usage invalid or empty !") :
                !/^[0-9]+$/.test($('#seatCapacityTxt').val()) ? alert("Seat capacity invalid or empty !") :
                !/^[0-9]+$/.test($('#vehicleQtyTxt').val()) ? alert("Qty invalid or empty !") :
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
            const vehicleId = parseInt($(event.target).closest('li').find('h2').text());
            console.log(vehicleId)
        });
    }
}

new VehicleController();