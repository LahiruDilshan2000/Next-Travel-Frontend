import {Package} from "../model/Package.js";

let pNextPage = 1;
let pCurrentPage = 0;
const count = 10;
const vCount = 4;
let packageId = null;
let packageHasPage = false;
let vehicleCategory = null;
let hotelCategory = undefined;
let pkgCategory = null;
let oldPkgChild = null;
let nextPage = 1;
let currentPage = 0;
let hotel = undefined;
let roomArray = [];
let travelArea = [];
let vehicleId = null;
let hNextPage = 1;
let hCurrentPage = 0;
let vNextPage = 1;
let vCurrentPage = 0;
let hotelHasPage = false;
let vehicleHasPage = false;
let hotelId = null;
let user = null;
let updatePackage = null;
let vehicleList = null;
let hotelList = null;
const array = ['#addPackageContainer', '#travel-area', '#vehicle-container', '#hotel-container', '#other-details-container', "#details-div3"];
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/package";

export class EditPackageController {
    constructor() {
        $('#nextHotelBtn').on('click', () => {
            this.handleNextHotelList();
        });
        $('#previousBtn').on('click', () => {
            this.handlePreviousHotelList();
        });
        $('#nextVehicleBtn').on('click', () => {
            this.handleNextVehicleList();
        });
        $('#previousVehicleBtn').on('click', () => {
            this.handlePreviousVehicleList();
        });
        $("#nextAddPackageBtn").on('click', () => {
            this.handleNextPackageList();
        });
        $("#previousAddPackageBtn").on('click', () => {
            this.handlePreviousPackageList();
        });
        $("#addPackageBtn").on('click', () => {
            this.handleReset();
            this.handleAddItemEvent();
        });
        $("#addPackageContainer > div > ul li > i").on('click', (event) => {
            this.handleGetDetails(event);
        });
        $('#travel-area > ul li').on('click', 'i', (event) => {
            this.handleAddSelectAreaStyle(event);
        });
        $('#vehicle-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectVehicleStyle(event);
        });
        $('#hotel-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectHotel(event);
        });
        $('#CategoryCmb').on('change', () => {
            this.handleSetRoomPrice(hotel);
        });
        $("#nextPkgBtn").on('click', () => {
            this.handleNext();
        });
        $("#backPkgBtn").on('click', () => {
            this.handlePrevious();
        });
        $('#closeBtn').on('click', () => {
            this.handleRemoveAddForm();
        });
        $('#qtyAddBtn').on('click', () => {
            this.handleAddRoom();
            this.handleSetLastPrice();
        });
        $('#viewRoomCart').on('click', () => {
            this.handleViewCart();
        });
        $('#showR').on('click', 'i', (event) => {
            this.handleRemoveRoom(event);
            this.handleTotalFree();
        });
        $('#startDateTxt').on('change', () => {
            this.handleSetEndMinDate();
            this.handleDefaultData();
            this.handleSetLastPrice();
        });
        $('#endDateTxt').on('change', () => {
            this.handleSetFreeGuide();
            this.handleSetLastPrice();
        });
        $('#guideCmb').on('change', () => {
            this.handleSetLastPrice();
        });
        $('#btnPlace').on('click', () => {
            this.handleSavePackage();
        });
        $("#pkgCustomerCmb").on('change', () => {
            this.setCustomerEmail();
        });
        $('#nextUpdatePkgBtn').on('click', () => {
            this.handleNextUpdate();
        });
        this.handleLoadAll(0, count);
        this.handlePackageEditeEvent();
    }

    handleSetEndMinDate() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            let endValue = new Date($('#startDateTxt').val());
            const end = $('#endDateTxt');
            endValue.setDate(endValue.getDate() + 1);

            endValue = endValue.toISOString().split('T')[0];
            end.attr("min", endValue);
            end.attr("value", endValue);
        }
    }

    handleAddRoom() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const x = $('#roomQtyTxt').val();
            const cmbVal = $('#CategoryCmb').val();

            if (x && cmbVal !== 'default') {
                for (let i = 0; i < roomArray.length; i++) {
                    if (roomArray[i].roomType === cmbVal) {
                        roomArray[i].qty += parseInt(x);
                        return;
                    }
                }
                const r = {
                    roomType: cmbVal,
                    qty: parseInt(x),
                    price: $('#priceLbl').text()
                }
                roomArray.push(r);
            }
        }
    }

    handleTotalFree() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (roomArray.length !== 0) {

                let tot = 0;

                const days = this.handleGetDateCount();

                roomArray.map(value => {
                    tot += value.qty * parseInt(value.price) * days;
                });

                $('#totalLbl').text(tot);

            } else {
                $('#totalLbl').text(0.00);
            }
        }
    }

    handleSetRoomPrice(hotel) {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const x = $('#CategoryCmb').val();
            const y = $('#priceLbl');

            x === "Full Luxury Double" ? y.text(hotel.fullDPrice) :
                x === "Half Luxury Double" ? y.text(hotel.halfDPrice) :
                    x === "Full Luxury Triple" ? y.text(hotel.fullTPrice) :
                        x === "Half Luxury Triple" ? y.text(hotel.halfTPrice) :
                            y.text(0);
        }
    }

    handleRemoveRoom(event) {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            const index = parseInt($(event.target).closest('li').find('h2').text());
            roomArray.splice(index, 1);
            this.handleViewCart();
        }
    }

    handleGetDateCount() {

        const start = new Date($('#startDateTxt').val());
        const end = new Date($('#endDateTxt').val());

        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    handleNextHotelList() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (hNextPage !== 0) {
                this.handleGetHotelList(hNextPage, vCount, hotelCategory);
                this.handleSetOldHotel();
                if (hotelHasPage) {
                    hCurrentPage++;
                    hNextPage++;
                }
            }
        }
    }

    handlePreviousHotelList() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (hCurrentPage !== 0) {
                hCurrentPage--;
                hNextPage--;
                this.handleGetHotelList(hCurrentPage, vCount, hotelCategory);
                this.handleSetOldHotel();
            }
        }
    }

    handleNextVehicleList() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (vNextPage !== 0) {
                this.handleGetVehicleList(vNextPage, vCount, vehicleCategory);
                this.handleSetOldVehicle();
                if (vehicleHasPage) {
                    vCurrentPage++;
                    vNextPage++;
                }
            }
        }
    }

    handlePreviousVehicleList() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (vCurrentPage !== 0) {
                vCurrentPage--;
                vNextPage--;
                this.handleGetVehicleList(vCurrentPage, vCount, vehicleCategory);
                this.handleSetOldVehicle();
            }
        }
    }

    handleAddSelectHotel(event) {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const newId = $(event.target).closest('li').find('h2').text();

            if (newId === hotelId) {
                hotelId = null;
            } else {
                hotelId = newId;
            }
        }

    }

    handleAddSelectVehicleStyle(event) {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const newId = $(event.target).closest('li').find('h2').text();

            if (newId === vehicleId) {
                vehicleId = null;
            } else {
                vehicleId = newId;
            }
        }
    }

    handleSavePackage() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;
                let pkg = JSON.stringify(new Package(
                    $('#orderIdLbl').text(),
                    pkgCategory,
                    user.nic,
                    vehicleId,
                    hotelId,
                    hotel.hotelName,
                    travelArea,
                    $('#pkgContactTxt').val(),
                    $('#pkgEmailTxt').val(),
                    parseInt($('#totLbl').text()),
                    0,
                    $('#startDateTxt').val(),
                    $('#endDateTxt').val(),
                    new Date().toISOString(),
                    roomArray,
                    parseInt($('#noOfAdultsTxt').val()),
                    parseInt($('#noOfChildrenTxt').val()),
                    parseInt($('#headCountLbl').text()),
                    $('#withPetCmb').val(),
                    $('#guideCmb').val(),
                ));

                console.log(pkg)

                $.ajax({
                    url: defaultGateway,
                    method: "POST",
                    async: true,
                    contentType: "application/json",
                    data: pkg,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            console.log(resp.message);
                            alert(resp.message);
                            this.handleReset();
                            this.handleLoadAll(0, count);
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

    handleReset() {

        $('#withPetCmb').prop("disabled", false);
        document.body.style.overflow = 'auto';

        pNextPage = 1;
        pCurrentPage = 0;
        packageId = null;
        packageHasPage = false;
        vehicleCategory = null;
        hotelCategory = undefined;
        pkgCategory = null;
        oldPkgChild = null;
        nextPage = 1;
        currentPage = 0;
        hotel = undefined;
        roomArray = [];
        travelArea = [];
        vehicleId = null;
        hNextPage = 1;
        hCurrentPage = 0;
        vNextPage = 1;
        vCurrentPage = 0;
        hotelHasPage = false;
        vehicleHasPage = false;
        hotelId = null;
        user = null;
        updatePackage = null;
        vehicleList = null;
        hotelList = null;

        $("#addPackage-container").css({
            "top": "100vh",
            'background': 'none'
        });
        $("#nextPkgBtn").css({'display': 'block'});
        $("#nextUpdatePkgBtn").css({'display': 'none'});
        $("#nextUpdatePkgBtn").text('Next');
        $('#totalLbl').text('0');
        $('#noOfAdultsTxt').val('');
        $('#noOfChildrenTxt').val('');
        $('#pkgContactTxt').val('');
        $('#pkgEmailTxt').val('');
        $('#headCountLbl').text('0');
        $('#pkgCustomerCmb').val('');
        $('#guideCmb').val('');
        $('#roomQtyTxt').val('');
        $('#priceLbl').text('0');
        this.handleDefaultData();

        const t = $("#travel-area > ul li i");
        t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');
    }

    handleDefaultData() {

        const currentDate = new Date().toISOString().split('T')[0];
        const start = $("#startDateTxt");
        const end = $("#endDateTxt");
        start.attr("min", currentDate);
        start.attr("value", currentDate);

        let endValue = new Date();
        endValue.setDate(endValue.getDate() + 1);

        endValue = endValue.toISOString().split('T')[0];
        end.attr("min", endValue);
        end.attr("value", endValue);
        console.log(endValue);
        console.log($("#endDateTxt").val());
    }

    handleSetFreeGuide() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;

                const x = $("#startDateTxt").val();
                const y = $("#endDateTxt").val();
                $.ajax({
                    url: defaultGateway + "/getFreeGuide?startDate=" + x + "&endDate=" + y,
                    method: "GET",
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            this.handleAddGuide(resp.data);
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
    }

    handleAddGuide(data) {

        $("#guideCmb option").remove();
        $("#guideCmb").append("<option value=\"No guide\" selected>No Guide</option>");

        data.map(value => {
            $("#guideCmb").append("<option value=" + value.guideId + ">" + value.name + "</option>");
        });
    }

    handleGetHotelList(page, count, category) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getHotels?page=" +
                    page + "&count=" + count + "&category=" + category,
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        hotelList = resp.data;
                        this.handleLoadHotels(resp.data);
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

    handleGetVehicleList(page, count, category) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getVehicles?page=" +
                    page + "&count=" + count + "&category=" + category,
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        vehicleList = resp.data;
                        this.handleLoadVehicles(resp.data);
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

    handleAddItemEvent() {

        const t = $("#addPackageContainer > div > ul li > i");
        t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        this.handleShowContainer(array[0]);
        $('#addPackage-container').css({
            'top': '0',
        });
        setTimeout(() => {
            $('#addPackage-container').css({
                'background': 'rgba(0, 0, 0, 0.5)'
            });
        }, 400);
        document.body.style.overflow = 'hidden';

        $('#backBtn').css({'display': 'none',});
        $('#nextBtn').css({'display': 'none',});
        $('#backPkgBtn').css({'display': 'block',});
        $('#nextPkgBtn').css({'display': 'block',});
    }

    handleNext() {

        if (nextPage !== 5) {
            if (this.handleValidation()) {
                nextPage++;
                currentPage++;
            }
        } else {
            if (this.handleAnotherValidation()) {
                this.handleShowContainer(array[nextPage])
                nextPage++;
                currentPage++;
                $("#nextPkgBtn").css({'display': 'none'});
            }
        }
    }

    handleAnotherValidation() {

        if (roomArray.length === 0) {
            alert('Please add the rooms for package !');
            return false;
        }
        if (!/^[0-9]+$/.test($('#noOfAdultsTxt').val())) {
            alert("Adult count invalid or empty !");
            return false;
        }
        if (!/^[0-9]+$/.test($('#noOfChildrenTxt').val())) {
            alert("Children count invalid or empty !");
            return false;
        }
        if ($('#pkgCustomerCmb').val() === 'default') {
            alert("Please select the customer !");
            return false;
        }
        if (!/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#pkgContactTxt').val())) {
            alert("Invalid contact !");
            return false;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#pkgEmailTxt').val())) {
            alert("Invalid email !");
            return false;
        }
        this.handleSetLastPrice();
        return true;

    }

    handlePrevious() {

        if (nextPage === 5) {
            $('#nextUpdatePkgBtn').text("Next");
        }
        if (currentPage === 5) {
            $("#nextPkgBtn").css({'display': 'block'});
        }
        if (currentPage === 4) {
            $('#withPetCmb').prop("disabled", false);
        }
        if (currentPage !== 0) {
            nextPage--;
            currentPage--;
            this.handleShowContainer(array[currentPage]);
        }
    }

    handleAddSelectAreaStyle(event) {

        const area = $(event.target).closest('li').find('p').text();
        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            const index = travelArea.indexOf(area);
            index === -1 ? travelArea.push(area) : travelArea.splice(index, 1);
            console.log(index)
        }
    }

    handleValidation() {

        console.log(travelArea)
        if (pkgCategory === null) {
            alert('Please select the package category !');
            return false;
        }
        if (array[nextPage] === '#travel-area') {
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (travelArea.length === 0) {
            alert('Please select our travel area !');
            return false;
        }
        if (travelArea.length !== 0 && array[nextPage] === '#vehicle-container') {
            this.handleGetVehicleList(0, vCount, vehicleCategory);
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (vehicleId === null && array[nextPage] === '#hotel-container') {
            alert('Please select your vehicle !');
            return false;
        }
        if (vehicleId !== null && array[nextPage] === '#hotel-container') {
            this.handleGetHotelList(0, vCount, hotelCategory);
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (hotelId === null && array[nextPage] === '#other-details-container') {
            alert('Please select your hotel !')
            return false;
        }
        if (hotelId !== null && array[nextPage] === '#other-details-container') {
            this.handleGetHotel(hotelId);
            this.handleShowContainer(array[nextPage]);
            $("#customerCmb").css({'display': 'block'});
            this.handleGetUser();
            return true;
        }
    }

    handleSetLastPrice() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            $('#orderIdLbl').text(this.handleGetOrderId());

            let tot = 0;
            let days = this.handleGetDateCount();

            roomArray.map(value => {
                tot += ((value.price * days) * value.qty);
            });

            const vehicle = this.HandleGetVehicle(vehicleId);

            tot += (vehicle.freeForDay * days);

            let guide = "NoGuide";

            if ($('#guideCmb').val() !== 'No guide') {
                guide = this.handleGetGuide($('#guideCmb').val());
            }
            if (guide !== "NoGuide") {
                tot += (guide.manDayValue * days);
            }
            $('#totLbl').text(tot);
            $('#totalLbl').text(tot);
        }
    }

    handleGetGuide(guideId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            let guide = undefined;
            $.ajax({
                url: defaultGateway + "/getGuideById?guideId=" + guideId,
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        guide = resp.data;
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
            return guide;
        }
    }

    HandleGetVehicle(vehicleId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            let vehicle = undefined;
            $.ajax({
                url: defaultGateway + "/getVehicleById?vehicleId=" + vehicleId,
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        vehicle = resp.data;
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
            return vehicle;
        }
    }

    handleGetOrderId() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            let id = 0;
            $.ajax({
                url: defaultGateway + "/getNextPk",
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.message);
                        id = resp.data;
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
            return id;
        }
    }

    handleGetHotel(hotelId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/getHotelById?hotelId=" + hotelId,
                method: "GET",
                processData: false,
                contentType: false,
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleHotelDetails(resp.data);
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

    handleViewCart() {

        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {

            $('#showR li').remove();

            roomArray.map((value, index) => {

                let li = "<li>\n" +
                    "                    <h2>1</h2>\n" +
                    "                    <p>10</p>\n" +
                    "                    <p>10</p>\n" +
                    "                    <i class=\"fa-solid fa-delete-left\"></i>\n" +
                    "                </li>";
                $('#showR').append(li);
                $('#showR li:last-child h2').text(index);
                $('#showR li:last-child p:nth-child(2)').text(value.roomType);
                $('#showR li:last-child p:nth-child(3)').text(value.qty);

            });
            $('#roomFilter').css({
                'display': 'block'
            });
        }
    }

    handleHotelDetails(data) {

        $('.hotel-div section').remove();

        const section = "<section>\n" +
            "                    <img src=\"assets/images/login.jpg\">\n" +
            "                    <h3>1</h3>\n" +
            "                    <h3>10</h3>\n" +
            "                </section>";
        $('.hotel-div').append(section);
        $('.hotel-div section img').attr('src', `data:image/png;base64,${data.hotelImageLocation}`);
        $('.hotel-div h3:nth-child(2)').text(data.hotelName);
        $('.hotel-div h3:last-child').text(data.hotelLocation);

        if (data.isPetAllow !== "Is-Allow") {
            $('#withPetCmb').prop("disabled", true);
        }
        hotel = data;

    }

    handleLoadVehicles(data) {

        if (data.length !== 0) {


            $('#pkgVehicle li').remove();

            let count = 1;
            data.map(value => {
                let li = "<li>\n" +
                    "                    <img src=\"assets/images/login.jpg\">\n" +
                    "                    <p>1</p>\n" +
                    "                    <h2>10</h2>\n" +
                    "                    <h3>Hotel Galdari</h3>\n" +
                    "                    <h3>Pandura</h3>\n" +
                    "                    <i class=\"fa-solid fa-plus\"></i>\n" +
                    "                </li>";


                $('#pkgVehicle').append(li);
                $('#pkgVehicle li:last-child img').attr('src', `data:image/png;base64,${value.imageList[0]}`);
                $('#pkgVehicle li:last-child h2').text(value.vehicleId);
                $('#pkgVehicle li:last-child p').text(count);
                $('#pkgVehicle li:last-child h3:nth-child(4)').text(value.vehicleBrand);
                $('#pkgVehicle li:last-child h3:nth-child(5)').text(value.versionType);
                count++;
            });

            vehicleHasPage = true;
        } else {
            vehicleHasPage = false;
        }
    }

    handleLoadHotels(data) {

        if (data.length !== 0) {

            $('#pkgHotel li').remove();

            let count = 1;
            data.map(value => {
                let li = "<li>\n" +
                    "                    <img src=\"assets/images/login.jpg\">\n" +
                    "                    <p>1</p>\n" +
                    "                    <h2>10</h2>\n" +
                    "                    <h3>Hotel Galdari</h3>\n" +
                    "                    <h3>Pandura</h3>\n" +
                    "                    <div class=\"form-group col-md-12 star-selector\">\n" +
                    "                        <div class=\"hotelView-card-stars\">\n" +
                    "                            <i class=\"fa-solid fa-star\"></i>\n" +
                    "                            <i class=\"fa-solid fa-star\"></i>\n" +
                    "                            <i class=\"fa-solid fa-star\"></i>\n" +
                    "                            <i class=\"fa-solid fa-star\"></i>\n" +
                    "                            <i class=\"fa-solid fa-star\"></i>\n" +
                    "                         </div>\n" +
                    "                    </div>\n" +
                    "                    <i class=\"fa-solid fa-plus\"></i>\n" +
                    "                </li>";


                $('#pkgHotel').append(li);
                $('#pkgHotel li:last-child img').attr('src', `data:image/png;base64,${value.hotelImageLocation}`);
                $('#pkgHotel li:last-child h2').text(value.hotelId);
                $('#pkgHotel li:last-child p').text(count);
                $('#pkgHotel li:last-child h3:nth-child(4)').text(value.hotelName);
                $('#pkgHotel li:last-child h3:nth-child(5)').text(value.hotelLocation);
                count++;

                for (let i = 1; i <= value.hotelCategory; i++) {
                    $('#pkgHotel li:last-child > div > div > i:nth-child(' + i + ')').addClass('activeView');
                }
            });
            hotelHasPage = true;
        } else {
            hotelHasPage = false;
        }
    }

    handleGetDetails(event) {

        const newPkgCategory = $(event.target).closest('li').find('h3').text();
        hotelCategory = parseInt($(event.target).closest('li').find('h2:nth-child(5)').text());
        vehicleCategory = $(event.target).closest('li').find('h2:nth-child(6)').text();

        const child = $(event.target).closest('li').val();
        console.log(child)

        const t = $("#addPackageContainer > div > ul > li:nth-child(" + child + ") > i");

        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');


        if (oldPkgChild && oldPkgChild !== child) {
            const x = $("#addPackageContainer > div > ul > li:nth-child(" + oldPkgChild + ") > i");
            x.css({'rotate': '0deg'}) && x.removeClass('fa-check') && x.addClass('fa-plus');
        }
        oldPkgChild = child;

        if (newPkgCategory === pkgCategory) {
            pkgCategory = null;
        } else {
            pkgCategory = newPkgCategory;
        }
    }

    handleShowContainer(id) {

        this.handleHideAllContainer();
        $(id).css({
            'display': 'flex'
        });
    }

    handleHideAllContainer() {

        array.map(value => {
            $(value).css({
                'display': 'none'
            });
        });
    }

    handleNextPackageList() {
        if (pNextPage !== 0) {
            this.handleLoadAll(pNextPage, count);
            if (packageHasPage) {
                pCurrentPage++;
                pNextPage++;
            }
        }
    }

    handlePreviousPackageList() {
        if (pCurrentPage !== 0) {
            pCurrentPage--;
            pNextPage--;
            this.handleLoadAll(pCurrentPage, count);
        }
    }

    handlePackageEditeEvent() {

        $('#packageUl').on('click', 'button:nth-child(1)', (event) => {
            packageId = $(event.target).closest('li').find('h3:nth-child(1)').text();

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;

                $.ajax({
                    url: defaultGateway + "?packageId=" + packageId,
                    method: "GET",
                    processData: false,
                    contentType: false,
                    async: true,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            console.log(resp.data)
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

        $('#packageUl').on('click', 'button:nth-child(2)', (event) => {
            packageId = $(event.target).closest('li').find('h3:nth-child(1)').text();

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;
                $.ajax({
                    url: defaultGateway + "?packageId=" + packageId,
                    method: "DELETE",
                    processData: false,
                    contentType: false,
                    async: true,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            alert(resp.message);
                            this.handleLoadAll(0, count);
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


        updatePackage = data;
        pkgCategory = updatePackage.packageCategory;
        vehicleId = updatePackage.vehicleId;
        hotelId = updatePackage.hotelId;
        this.handleAddItemEvent();
        $('#nextPkgBtn').css({'display': 'none'});
        $('#nextUpdatePkgBtn').css({'display': 'block'});

        if (data.packageCategory === "Super Luxury") {
            const t = $("#addPackageContainer > div > ul > li:nth-child(1) > i");
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            hotelCategory = parseInt($('#addPackageContainer > div > ul > li:nth-child(1) > h2:nth-child(5)').text());
            vehicleCategory = $('#addPackageContainer > div > ul > li:nth-child(1) > h2:nth-child(6)').text();
            oldPkgChild = 1;
            return;
        }
        if (data.packageCategory === "Luxury") {
            const t = $("#addPackageContainer > div > ul > li:nth-child(2) > i");
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            hotelCategory = parseInt($('#addPackageContainer > div > ul > li:nth-child(2) > h2:nth-child(5)').text());
            vehicleCategory = $('#addPackageContainer > div > ul > li:nth-child(2) > h2:nth-child(6)').text();
            oldPkgChild = 2;
            return;
        }
        if (data.packageCategory === "Mid Leve") {
            const t = $("#addPackageContainer > div > ul > li:nth-child(3) > i");
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            hotelCategory = parseInt($('#addPackageContainer > div > ul > li:nth-child(3) > h2:nth-child(5)').text());
            vehicleCategory = $('#addPackageContainer > div > ul > li:nth-child(3) > h2:nth-child(6)').text();
            oldPkgChild = 3;
            return;
        }
        if (data.packageCategory === "Regular") {
            const t = $("#addPackageContainer > div > ul > li:nth-child(4) > i");
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            hotelCategory = parseInt($('#addPackageContainer > div > ul > li:nth-child(4) > h2:nth-child(5)').text());
            vehicleCategory = $('#addPackageContainer > div > ul > li:nth-child(4) > h2:nth-child(6)').text();
            oldPkgChild = 4;
        }
    }

    handleLoadAll(page, count) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getAll?page=" + page + "&count=" + count,
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleLoadPackage(resp.data);
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

    handleLoadPackage(data) {

        if (data.length !== 0) {

            $('#packageUl li').remove();

            data.map(value => {

                let li = "<li>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <h3>null</h3>\n" +
                    "                    <div class=\"btn-div\">\n" +
                    "                       <button type=\"button\">Edit</button>\n" +
                    "                       <button type=\"button\">Delete</button>\n" +
                    "                    </div>\n" +
                    "                </li>";

                $('#packageUl').append(li);
                $('#packageUl li:last-child h3:nth-child(1)').text(value.packageId);
                $('#packageUl li:last-child h3:nth-child(2)').text(value.userNic);
                $('#packageUl li:last-child h3:nth-child(3)').text(value.packageCategory);
                $('#packageUl li:last-child h3:nth-child(4)').text(value.email);
                $('#packageUl li:last-child h3:nth-child(5)').text(new Date(value.bookedDate).toISOString().split('T')[0]);
                $('#packageUl li:last-child h3:nth-child(6)').text(value.packageValue);
                $('#packageUl li:last-child h3:nth-child(7)').text(value.paidValue);
            });
            packageHasPage = true;
        } else {
            packageHasPage = false;
        }
    }

    handleGetUser() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getUsers",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleLoadUsers(resp.data);
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

    handleLoadUsers(data) {

        $("#pkgCustomerCmb option").remove();
        $("#pkgCustomerCmb").append("<option value=\"default\" selected>Select</option>");

        data.map(value => {
            $("#pkgCustomerCmb").append("<option value=" + value.nic + ">" + value.username + "</option>");
        });
    }

    setCustomerEmail() {

        const users = JSON.parse(localStorage.getItem("USER"));

        if (users) {

            const token = users.token;

            const nic = $('#pkgCustomerCmb').val();
            if (nic !== 'default') {
                $.ajax({
                    url: defaultGateway + "/getUserByNic?nic=" + nic,
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            user = resp.data;
                            $('#pkgEmailTxt').val(resp.data.email)
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
    }

    handleNextUpdate() {

        if ($('#nextUpdatePkgBtn').text() === "Update") {
            this.handleValidationOfUpdate();
            return;
        }
        if (nextPage === 4) {
            $('#nextUpdatePkgBtn').text("Update");
        }
        if (nextPage !== 5) {
            if (this.handleUpdatedValidation()) {
                nextPage++;
                currentPage++;
            }
        }
    }

    handleValidationOfUpdate() {

        roomArray.length === 0 ?
            alert('Please add the rooms for package !') :
            !/^[0-9]+$/.test($('#noOfAdultsTxt').val()) ?
                alert("Adult count invalid or empty !") :
                !/^[0-9]+$/.test($('#noOfChildrenTxt').val()) ?
                    alert("Children count invalid or empty !") :
                    $('#pkgCustomerCmb').val() === 'default' ?
                        alert("Please select the customer !") :
                        !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#pkgContactTxt').val()) ?
                            alert("Invalid contact !") :
                            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#pkgEmailTxt').val()) ?
                                alert("Invalid email !") :
                                this.handleUpdatePackage();

    }

    handleUpdatePackage() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            let pkg = JSON.stringify(new Package(
                updatePackage.packageId,
                pkgCategory,
                $('#pkgCustomerCmb').val(),
                vehicleId,
                hotelId,
                hotel.hotelName,
                travelArea,
                $('#pkgContactTxt').val(),
                $('#pkgEmailTxt').val(),
                parseInt($('#totalLbl').text()),
                0,
                $('#startDateTxt').val(),
                $('#endDateTxt').val(),
                new Date(updatePackage.bookedDate).toISOString(),
                roomArray,
                parseInt($('#noOfAdultsTxt').val()),
                parseInt($('#noOfChildrenTxt').val()),
                parseInt($('#headCountLbl').text()),
                $('#withPetCmb').val(),
                $('#guideCmb').val(),
            ));

            $.ajax({
                url: defaultGateway,
                method: "PUT",
                async: true,
                contentType: "application/json",
                data: pkg,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.message);
                        alert(resp.message);
                        this.handleReset();
                        this.handleLoadAll(0, count);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleUpdatedValidation() {

        if (pkgCategory === null) {
            alert('Please select the package category !');
            return false;
        }
        if (array[nextPage] === '#travel-area') {
            this.handleShowContainer(array[nextPage]);
            this.handleOldTravelArea();
            return true;
        }
        if (travelArea.length === 0) {
            alert('Please select our travel area !');
            return false;
        }
        if (travelArea.length !== 0 && array[nextPage] === '#vehicle-container') {
            this.handleGetVehicleList(0, vCount, vehicleCategory);
            this.handleSetOldVehicle();
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (vehicleId === null && array[nextPage] === '#hotel-container') {
            alert('Please select your vehicle !');
            return false;
        }
        if (vehicleId !== null && array[nextPage] === '#hotel-container') {
            this.handleGetHotelList(0, vCount, hotelCategory);
            this.handleSetOldHotel();
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (hotelId === null && array[nextPage] === '#other-details-container') {
            alert('Please select your hotel !')
            return false;
        }
        if (hotelId !== null && array[nextPage] === '#other-details-container') {
            this.handleGetHotel(hotelId);
            this.handleShowContainer(array[nextPage]);
            $("#customerCmb").css({'display': 'block'});
            this.handleGetUser();
            if (parseInt(hotelId) === updatePackage.hotelId) {
                console.log(parseInt(hotelId) === updatePackage.hotelId);
                $("#withPetCmb").val(updatePackage.withPetOrNo);
                roomArray = updatePackage.roomDetailList;
                $("#totalLbl").text(updatePackage.packageValue);
            }
            $("#pkgCustomerCmb").val(updatePackage.userNic);
            $("#pkgEmailTxt").val(updatePackage.email);
            $("#startDateTxt").val(new Date(updatePackage.startDate).toISOString().split('T')[0]);
            $("#endDateTxt").val(new Date(updatePackage.endDate).toISOString().split('T')[0]);
            $("#noOfAdultsTxt").val(updatePackage.adultCount);
            $("#noOfChildrenTxt").val(updatePackage.childrenCount);
            $("#headCountLbl").text(updatePackage.headCount);
            $("#pkgContactTxt").val(updatePackage.contact);
            this.handleSetFreeGuide();
            $("#guideCmb").val(updatePackage.guideId);
            console.log($("#guideCmb").val())
            console.log(updatePackage.guideId)
            return true;
        }
    }

    handleOldTravelArea() {

        travelArea = updatePackage.travelArea;

        travelArea.map(value => {

            if (value === 'Kandy and Upcountry') {
                const t = $("#travel-area > ul li:nth-child(1) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Eastern Coast') {
                const t = $("#travel-area > ul li:nth-child(2) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Capital Colombo') {
                const t = $("#travel-area > ul li:nth-child(3) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Western Coast') {
                const t = $("#travel-area > ul li:nth-child(4) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'North Peninsula') {
                const t = $("#travel-area > ul li:nth-child(5) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Down South') {
                const t = $("#travel-area > ul li:nth-child(6) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Sigiriya and Dambulla') {
                const t = $("#travel-area > ul li:nth-child(7) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Anuradhapura and Polonnaruwa') {
                const t = $("#travel-area > ul li:nth-child(8) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
                return;
            }
            if (value === 'Matale') {
                const t = $("#travel-area > ul li:nth-child(9) i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            }
        });
    }

    handleSetOldVehicle() {

        vehicleList.map((value, index) => {
            if (parseInt(vehicleId) === value.vehicleId) {
                const t = $("#vehicle-container > ul li:nth-child(" + (index + 1) + ") i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            }
        });
    }

    handleSetOldHotel() {

        hotelList.map((value, index) => {
            if (parseInt(hotelId) === value.hotelId) {
                const t = $("#hotel-container > ul li:nth-child(" + (index + 1) + ") i:nth-child(7)");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            }
        });
    }

    handleRemoveAddForm() {
        if ($('#nextPkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            $("#addPackage-container").css({
                "top": "100vh",
                'background': 'none'
            });
            this.handleReset();
        }
    }
}

new EditPackageController();