import {Package} from "../model/Package.js";

let travelArea = [];
let hotelId = null;
let vehicleId = null;
let oldHotelChild = null;
let oldVehicleChild = null;
let vNextPage = 1;
let vCurrentPage = 0;
let hNextPage = 1;
let hCurrentPage = 0;
const count = 4;
const array = ['#travel-area', '#vehicle-container', '#hotel-container', '#other-details-container', "#details-div3"];
let nextPage = 1;
let currentPage = 0;
let hotel = undefined;
let roomArray = [];
let hotelHasPage = false;
let vehicleHasPage = false;
let vehicleCategory = undefined;
let hotelCategory = undefined;
let pkgCategory = undefined;
let vehicleList = null;
let hotelList = null;
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/package";

export class PackageController {
    constructor() {
        $('#packageContainer > div  ul  i').on('click', () => {
            this.handleAddItemEvent();
        });
        $('#addPackage-container').on('click', (event) => {
            this.handleRemoveAddEvent(event);
        });
        $('#travel-area > ul li').on('click', 'i', (event) => {
            this.handleAddSelectAreaStyle(event);
        });
        $('#hotel-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectHotel(event);
        });
        $('#vehicle-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectVehicleStyle(event);
        });
        $('#nextBtn').on('click', () => {
            this.handleNext();
        });
        $('#backBtn').on('click', () => {
            this.handlePrevious();
        });
        $('#closeBtn').on('click', () => {
            $('#addPackage-container').click();
        });
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
        $('#viewRoomCart').on('click', () => {
            this.handleViewCart();
        });
        $('.roomFilter').on('click', (event) => {
            this.handleHideCart(event);
        });
        $('#btnSuperLuxury').on('click', (event) => {
            this.handleGetDetails(event);
        });
        $('#btnLuxury').on('click', (event) => {
            this.handleGetDetails(event);
        });
        $('#btnMidLevel').on('click', (event) => {
            this.handleGetDetails(event);
        });
        $('#btnRegular').on('click', (event) => {
            this.handleGetDetails(event);
        });
        $('#CategoryCmb').on('change', () => {
            this.handleSetRoomPrice(hotel);
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
        $('#noOfAdultsTxt').on('keyup', () => {
            this.handleCountHeadCount($('#noOfAdultsTxt').val(), $('#noOfChildrenTxt').val());
        });
        $('#noOfChildrenTxt').on('keyup', () => {
            this.handleCountHeadCount($('#noOfChildrenTxt').val(), $('#noOfAdultsTxt').val());
        });
        $('#qtyAddBtn').on('click', () => {
            this.handleAddRoom();
            this.handleSetLastPrice();
        });
        $('#showR').on('click', 'i', (event) => {
            this.handleRemoveRoom(event);
            this.handleTotalFree();
        });
        $('#btnPlace').on('click', () => {
            this.handleSavePackage();
        });
        this.handleDefaultData();
    }

    handleNext() {

        if (nextPage !== 4) {
            if (this.handleValidation()) {
                nextPage++;
                currentPage++;
            }
        } else {
            if (this.handleAnotherValidation()) {
                this.handleShowContainer(array[nextPage])
                nextPage++;
                currentPage++;
                $("#nextBtn").css({'display': 'none'});
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

    handleSetLastPrice() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

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

    handleSavePackage() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

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

    handleSetFreeGuide() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;
                const x = $("#startDateTxt").val();
                const y = $("#endDateTxt").val();
                $.ajax({
                    url: defaultGateway + "/getFreeGuide?startDate=" + x + "&endDate=" + y,
                    method: "GET",
                    async: true,
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

        console.log(data)
        $("#guideCmb option").remove();
        $("#guideCmb").append("<option value=\"No guide\" selected>No Guide</option>");

        data.map(value => {
            $("#guideCmb").append("<option value=" + value.guideId + ">" + value.name + "</option>");
        });
    }

    handleSetEndMinDate() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            let endValue = new Date($('#startDateTxt').val());
            const end = $('#endDateTxt');
            endValue.setDate(endValue.getDate() + 1);

            endValue = endValue.toISOString().split('T')[0];
            end.attr("min", endValue);
            end.attr("value", endValue);
        }
    }

    handleGetDateCount() {

        const start = new Date($('#startDateTxt').val());
        const end = new Date($('#endDateTxt').val());

        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    handleTotalFree() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
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

    handleAddRoom() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

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

    handleCountHeadCount(x, y) {

        const z = $('#headCountLbl');
        x && y ? z.text(parseInt(x) + parseInt(y)) :
            y ? z.text(y) :
                x ? z.text(x) :
                    z.text(0);
    }

    handleSetRoomPrice(hotel) {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

            const x = $('#CategoryCmb').val();
            const y = $('#priceLbl');

            x === "Full Luxury Double" ? y.text(hotel.fullDPrice) :
                x === "Half Luxury Double" ? y.text(hotel.halfDPrice) :
                    x === "Full Luxury Triple" ? y.text(hotel.fullTPrice) :
                        x === "Half Luxury Triple" ? y.text(hotel.halfTPrice) :
                            y.text(0);
        }
    }

    handleValidation() {

        if (travelArea.length === 0) {
            alert('Please select your travel area !');
            return false;
        }
        if (travelArea.length !== 0 && array[nextPage] === '#vehicle-container') {
            this.handleGetVehicleList(0, count, vehicleCategory);
            this.handleShowContainer(array[nextPage]);
            return true;
        }
        if (vehicleId === null && array[nextPage] === '#hotel-container') {
            alert('Please select your vehicle !');
            return false;
        }
        if (vehicleId !== null && array[nextPage] === '#hotel-container') {
            this.handleGetHotelList(0, count, hotelCategory);
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
            $("#customerCmb").css({'display': 'none'});
            return true;
        }
    }

    handleReset() {

        $('#withPetCmb').prop("disabled", false);
        document.body.style.overflow = 'auto';

        travelArea = [];
        hotelId = null;
        vehicleId = null;
        oldHotelChild = null;
        oldVehicleChild = null;
        vNextPage = 1;
        vCurrentPage = 0;
        hNextPage = 1;
        hCurrentPage = 0;
        nextPage = 1;
        currentPage = 0;
        hotel = undefined;
        roomArray = [];
        hotelHasPage = false;
        vehicleHasPage = false;
        vehicleCategory = undefined;
        hotelCategory = undefined;
        pkgCategory = undefined;
        vehicleList = null;
        hotelList = null;

        $('#totalLbl').text('0');
        $('#noOfAdultsTxt').val('');
        $('#noOfChildrenTxt').val('');
        $('#pkgContactTxt').val('');
        $('#pkgEmailTxt').val('');
        $('#headCountLbl').text('0');
        $('#guideCmb').val('');
        $('#roomQtyTxt').val('');
        $('#priceLbl').text('0');
        this.handleDefaultData();

        $("#addPackage-container").css({
            "top": "100vh",
            'background': 'none'
        });
        $("#nextBtn").css({'display': 'block'});

        const t = $("#travel-area > ul li i");
        t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');
    }

    handlePrevious() {

        if (currentPage === 4) {
            $("#nextBtn").css({'display': 'block'});
        }
        if (currentPage === 3) {
            $('#withPetCmb').prop("disabled", false);
        }
        if (currentPage !== 0) {
            nextPage--;
            currentPage--;
            this.handleShowContainer(array[currentPage]);
        }
    }


    handleHideAllContainer() {

        array.map(value => {
            $(value).css({
                'display': 'none'
            });
        });
        $('#addPackageContainer').css({
            'display': 'none'
        });
    }

    handleGetDetails(event) {

        if (localStorage.getItem("USER")) {
            pkgCategory = $(event.target).closest('li').find('h3').text();
            hotelCategory = parseInt($(event.target).closest('li').find('h2:nth-child(5)').text());
            vehicleCategory = $(event.target).closest('li').find('h2:nth-child(6)').text();
            this.handleHideAllContainer();
            this.handleShowContainer(array[0]);
        }else {
            alert("Please login first");
        }
    }

    handleShowContainer(id) {

        this.handleHideAllContainer();
        $(id).css({
            'display': 'flex'
        });
    }

    handleHideCart(event) {

        if (event.target.className === 'roomFilter') {
            $("#roomFilter").css({
                'display': 'none'
            });
        }
    }

    handleViewCart() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

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
    }

    handleAddItemEvent() {

        if(localStorage.getItem("USER")) {
            $('#addPackage-container').css({
                'top': '0',
            });
            setTimeout(() => {
                $('#addPackage-container').css({
                    'background': 'rgba(0, 0, 0, 0.5)'
                });
            }, 400);
            document.body.style.overflow = 'hidden';

            $('#backBtn').css({'display': 'block',});
            $('#nextBtn').css({'display': 'block',});
            $('#backPkgBtn').css({'display': 'none',});
            $('#nextPkgBtn').css({'display': 'none',});
        }
    }

    handleRemoveAddEvent(event) {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            if (event.target.className === 'addPackage-container') {
                $("#addPackage-container").css({
                    "top": "100vh",
                    'background': 'none'
                });
                this.handleReset();
            }
        }
    }

    handleAddSelectAreaStyle(event) {

            const child = $(event.target).closest('li').val();
            const area = $(event.target).closest('li').find('p').text();

            const t = $("#travel-area > ul li:nth-child(" + child + ") i");
            t.hasClass('fa-plus') ?
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
                t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        if ($('#nextBtn').is(':visible')) {

            const index = travelArea.indexOf(area);
            index === -1 ? travelArea.push(area) : travelArea.splice(index, 1);
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

    handleAddSelectHotel(event) {

        const child = $(event.target).closest('li').find('p').text();

        const t = $("#hotel-container > ul li:nth-child(" + child + ") i:nth-child(7)");

        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        if (oldHotelChild && oldHotelChild !== child) {
            const x = $("#hotel-container > ul li:nth-child(" + oldHotelChild + ") i:nth-child(7)");
            x.css({'rotate': '0deg'}) && x.removeClass('fa-check') && x.addClass('fa-plus');
        }
        oldHotelChild = child;

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            const newId = $(event.target).closest('li').find('h2').text();

            if (newId === hotelId){
                hotelId = null;
            }else {
                hotelId = newId;
            }
        }
    }

    handleNextHotelList() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            if (hNextPage !== 0) {
                this.handleGetHotelList(hNextPage, count, hotelCategory);
                this.handleSetOldHotel();
                if (hotelHasPage) {
                    hCurrentPage++;
                    hNextPage++;
                }
            }
        }
    }

    handlePreviousHotelList() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            if (hCurrentPage !== 0) {
                hCurrentPage--;
                hNextPage--;
                this.handleGetHotelList(hCurrentPage, count, hotelCategory);
                this.handleSetOldHotel();
            }
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

    handleAddSelectVehicleStyle(event) {

        const child = $(event.target).closest('li').find('p').text();

        const t = $("#vehicle-container > ul li:nth-child(" + child + ") i");

        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        if (oldVehicleChild && oldVehicleChild !== child) {
            const x = $("#vehicle-container > ul li:nth-child(" + oldVehicleChild + ") i");
            x.css({'rotate': '0deg'}) && x.removeClass('fa-check') && x.addClass('fa-plus');
        }
        oldVehicleChild = child;
        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {

            const newId = $(event.target).closest('li').find('h2').text();

            if (newId === vehicleId){
                vehicleId = null;
            }else {
                vehicleId = newId;
            }
        }
    }

    handleNextVehicleList() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            if (vNextPage !== 0) {
                this.handleGetVehicleList(vNextPage, count, vehicleCategory);
                this.handleSetOldVehicle();
                if (vehicleHasPage) {
                    vCurrentPage++;
                    vNextPage++;
                }
            }
        }
    }

    handlePreviousVehicleList() {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            if (vCurrentPage !== 0) {
                vCurrentPage--;
                vNextPage--;
                this.handleGetVehicleList(vCurrentPage, count, vehicleCategory);
                this.handleSetOldVehicle();
            }
        }
    }

    handleRemoveRoom(event) {

        if ($('#nextBtn').is(':visible') || $('#backBtn').is(':visible')) {
            const index = parseInt($(event.target).closest('li').find('h2').text());
            roomArray.splice(index, 1);
            this.handleViewCart();
        }
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
}

new PackageController();