import {Package} from "../model/Package.js";

const count = 6;
let pNextPage = 1;
let pCurrentPage = 0;
let packageList = null;
let packageHasPage = false;
let updatePackage = null;
let roomArray = [];
let travelArea = null;
let hotelId = null;
let vehicleId = null;
let nextPage = 1;
let currentPage = 0;
let vNextPage = 1;
let vCurrentPage = 0;
let hNextPage = 1;
let hCurrentPage = 0;
const vCount = 4;
let vehicleCategory = null;
let hotelCategory = null;
let vehicleList = null;
let vehicleHasPage = false;
let hotelList = null;
let hotelHasPage = null;
let hotel = null;
const array = ['#travel-area', '#vehicle-container', '#hotel-container', '#other-details-container'];
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/package";
export class UpdatePackageController{
    constructor() {
        $('#nextVehicleBtn').on('click', () => {
            this.handleNextVehicleList();
        });
        $('#previousVehicleBtn').on('click', () => {
            this.handlePreviousVehicleList();
        });
        $('#vehicle-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectVehicleStyle(event);
        });
        $('#hotel-container > ul').on('click', 'i', (event) => {
            this.handleAddSelectHotel(event);
        });
        $('#bookingList').on('click', 'li i:last-child', (event) => {
           this.handleUpdateBooking(event);
        });
        $('#viewCart').on('click', () => {
            this.handleShowCart();
        });
        $('#recentOrder').on('click', (event) => {
            this.handleShowCartClickEvent(event);
        });
        $("#nextOrderBtn").on('click', () => {
            this.handleNextPackageList();
        });
        $("#previousOrderBtn").on('click', () => {
            this.handlePreviousPackageList();
        });
        $('#travel-area > ul li').on('click', 'i', (event) => {
            this.handleAddSelectAreaStyle(event);
        });
        $('#nextUserUpdatePkgBtn').on('click', () => {
            this.handleNextUpdate();
        });
        $('#nextHotelBtn').on('click', () => {
            this.handleNextHotelList();
        });
        $('#previousBtn').on('click', () => {
            this.handlePreviousHotelList();
        });
        $('#addPackage-container').on('click', (event) => {
            this.handleRemoveAddEvent(event);
        });
        $('#closeBtn').on('click', () => {
            $('#addPackage-container').click();
        });
        $("#backPkgBtn").on('click', () => {
            this.handlePrevious();
        });
        $('#viewRoomCart').on('click', () => {
            this.handleViewCart();
        });
        $('#qtyAddBtn').on('click', () => {
            this.handleAddRoom();
            this.handleSetLastPrice();
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
    }

    handleSetEndMinDate() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {
            let endValue = new Date($('#startDateTxt').val());
            const end = $('#endDateTxt');
            endValue.setDate(endValue.getDate() + 1);

            endValue = endValue.toISOString().split('T')[0];
            end.attr("min", endValue);
            end.attr("value", endValue);
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

    handleRemoveAddEvent(event) {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {
            if (event.target.className === 'addPackage-container') {
                $("#addPackage-container").css({
                    "top": "100vh",
                    'background': 'none'
                });
                this.handleReset();
            }
        }
    }

    handlePrevious() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')){

            if (nextPage === 4) {
                $('#nextUserUpdatePkgBtn').text("Next");
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
    }

    handleSetLastPrice() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

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

    handleGetDateCount() {

        const start = new Date($('#startDateTxt').val());
        const end = new Date($('#endDateTxt').val());

        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    handleSetRoomPrice(hotel) {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

            const x = $('#CategoryCmb').val();
            const y = $('#priceLbl');

            x === "Full Luxury Double" ? y.text(hotel.fullDPrice) :
                x === "Half Luxury Double" ? y.text(hotel.halfDPrice) :
                    x === "Full Luxury Triple" ? y.text(hotel.fullTPrice) :
                        x === "Half Luxury Triple" ? y.text(hotel.halfTPrice) :
                            y.text(0);
        }
    }

    handleAddRoom() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

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

    handleViewCart() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

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

    handleNextHotelList() {

        if ($('#nextUserUpdatePkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (hNextPage !== 0) {
                console.log(hotelCategory)
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

        if ($('#nextUserUpdatePkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
            if (hCurrentPage !== 0) {
                hCurrentPage--;
                hNextPage--;
                this.handleGetHotelList(hCurrentPage, vCount, hotelCategory);
                this.handleSetOldHotel();
            }
        }
    }

    handleNextVehicleList() {

        if ($('#nextUserUpdatePkgBtn').is(':visible') || $('#backPkgBtn').is(':visible')) {
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

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {
            if (vCurrentPage !== 0) {
                vCurrentPage--;
                vNextPage--;
                this.handleGetVehicleList(vCurrentPage, vCount, vehicleCategory);
                this.handleSetOldVehicle();
            }
        }
    }

    handleAddSelectHotel(event) {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

            const newId = parseInt($(event.target).closest('li').find('h2').text());

            if (newId === hotelId) {
                hotelId = null;
            } else {
                hotelId = newId;
            }
        }

    }

    handleAddSelectVehicleStyle(event) {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

            const newId = parseInt($(event.target).closest('li').find('h2').text());

            if (newId === vehicleId) {
                vehicleId = null;
            } else {
                vehicleId = newId;
            }
        }
    }

    handleNextUpdate() {

        if ($('#nextUserUpdatePkgBtn').text() === "Update") {
            this.handleValidationOfUpdate();
            return;
        }
        if (nextPage !== 4) {
            if (this.handleUpdatedValidation()) {
                if (nextPage === 3) {
                    $('#nextUserUpdatePkgBtn').text("Update");
                }
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
                updatePackage.packageCategory,
                updatePackage.userNic,
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
                url: defaultGateway + "/updateUserPackage",
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
                        $('#addPackage-container').click();
                        this.handleReset();
                        this.handleShowCart();
                        //this.handleLoadAll(0, count);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleNextPackageList() {
        if (pNextPage !== 0) {
            this.handleLoadUserPackage(pNextPage, count);
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
            this.handleLoadUserPackage(pCurrentPage, count);
        }
    }

    handleUpdatedValidation() {

        console.log(travelArea)
        if (travelArea.length === 0) {
            alert('Please select your travel area !');
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

            if (parseInt(hotelId) === updatePackage.hotelId) {
                console.log(parseInt(hotelId) === updatePackage.hotelId);
                $("#withPetCmb").val(updatePackage.withPetOrNo);
                roomArray = updatePackage.roomDetailList;
                $("#totalLbl").text(updatePackage.packageValue);
            }else {
                roomArray = [];
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
            return true;
        }
    }

    handleSetFreeGuide() {

        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

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

    handleSetOldHotel() {

        hotelList.map((value, index) => {
            if (parseInt(hotelId) === value.hotelId) {
                const t = $("#hotel-container > ul li:nth-child(" + (index + 1) + ") i:nth-child(7)");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            }
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

    handleSetOldVehicle() {

        vehicleList.map((value, index) => {
            if (parseInt(vehicleId) === value.vehicleId) {
                const t = $("#vehicle-container > ul li:nth-child(" + (index + 1) + ") i");
                t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check');
            }
        });
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

    handleShowCart() {

        this.handleLoadUserPackage(0, count);

        $('#recentOrder').css({'left':'0'});
        document.body.style.overflow = 'hidden';
    }

    handleShowCartClickEvent(event) {

        if (event.target.className === 'recentOrder') {
            $("#recentOrder").css({"left": "-1600px"});
            document.body.style.overflow = 'auto';
        }
    }

    handleAddSelectAreaStyle(event) {

        const area = $(event.target).closest('li').find('p').text();
        if ($('#nextUserUpdatePkgBtn').is(':visible')) {

            const index = travelArea.indexOf(area);
            index === -1 ? travelArea.push(area) : travelArea.splice(index, 1);
            console.log(index)
        }
    }

    handleLoadUserPackage(page, count){

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getPackageByNic?page=" + page + "&count=" + count + "&nic=" + user.nic,
                method: "GET",
                processData: false,
                contentType: false,
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        packageList = resp.data;
                        console.log(packageList)
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
    handleLoadPackage(data){

        if (data.length !== 0) {
        $('#bookingList li').remove();

        data.map((value, index) => {

            let li = "<li>\n" +
                "                    <i class=\"fa-solid fa-dollar-sign\"></i>\n" +
                "                    <p>0</p>\n" +
                "                    <h3>MD-0000012</h3>\n" +
                "                    <h3>MD-0000012</h3>\n" +
                "                    <h3>MD-0000012</h3>\n" +
                "                    <h3>MD-0000012</h3>\n" +
                "                    <i class=\"fa-solid fa-pen\"></i>\n" +
                "                </li>";

            $('#bookingList').append(li);
            $('#bookingList li:last-child p').text(index);
            $('#bookingList li:last-child h3:nth-child(3)').text(value.packageId);
            $('#bookingList li:last-child h3:nth-child(4)').text(value.packageCategory);
            $('#bookingList li:last-child h3:nth-child(5)').text(value.packageValue);
            $('#bookingList li:last-child h3:nth-child(6)').text(value.paidValue);

            let nowDate = new Date();
            let bookedDate = new Date(value.bookedDate);
            let expireDate = new Date( bookedDate.getTime() + (48 * 60 * 60 * 1000));

            if (expireDate < nowDate){
                $('#bookingList li:last-child i:last-child').prop("disabled", true);
            }else {
                $('#bookingList li:last-child i:last-child').prop("disabled", false);
            }
        });
            packageHasPage = true;
        } else {
            packageHasPage = false;
        }
    }

    handleUpdateBooking(event) {

        const index = parseInt($(event.target).closest('li').find('p').text());
        updatePackage = packageList[index];
        this.handleEditDetails();
        this.handleShowContainer(array[0]);

        $('#addPackage-container').css({'top': '0',});
        this.handleHideAllButtons();
        this.handleShowButton();

        if (updatePackage.packageCategory === "Super Luxury") {
            hotelCategory = 5;
            vehicleCategory = "Super Luxury";
            return;
        }
        if (updatePackage.packageCategory === "Luxury") {
            hotelCategory = 4;
            vehicleCategory = "Luxury";
            return;
        }
        if (updatePackage.packageCategory === "Mid Leve") {
            hotelCategory = 3;
            vehicleCategory = "Mid-Range";
            return;
        }
        if (updatePackage.packageCategory === "Regular") {
            hotelCategory = 2;
            vehicleCategory = "Economy";
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

    handleEditDetails() {

        vehicleId = updatePackage.vehicleId;
        hotelId = updatePackage.hotelId;
        this.handleOldTravelArea();
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

    handleReset(){

        pNextPage = 1;
        pCurrentPage = 0;
        packageHasPage = false;
        updatePackage = null;
        roomArray = [];
        travelArea = null;
        hotelId = null;
        vehicleId = null;
        nextPage = 1;
        currentPage = 0;
        vNextPage = 1;
        vCurrentPage = 0;
        hNextPage = 1;
        hCurrentPage = 0;
        vehicleCategory = null;
        hotelCategory = null;
        vehicleList = null;
        vehicleHasPage = false;
        hotelList = null;
        hotelHasPage = null;
        hotel = null;

        const t = $("#travel-area > ul li i");
        t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

    }

    handleShowButton(){

        $('#nextUserUpdatePkgBtn').css({'display':'block'}).text('Next');
        $('#backPkgBtn').css({'display':'block'});
    }

    handleHideAllButtons(){

        $('#backBtn').css({'display':'none'});
        $('#nextBtn').css({'display':'none'});
        $('#backPkgBtn').css({'display':'none'});
        $('#nextPkgBtn').css({'display':'none'});
        $('#nextUpdatePkgBtn').css({'display':'none'});
        $('#nextUserUpdatePkgBtn').css({'display':'none'});
    }
}
new UpdatePackageController();