const travelArea = [];
let hotelId = null;
let vehicleId = null;
let oldHotelChild = null;
let oldVehicleChild = null;
let vNextPage = 1;
let vCurrentPage = 0;
let hNextPage = 1;
let hCurrentPage = 0;
const count = 4;
const array = ['#travel-area', '#other-details-container', '#hotel-container', '#vehicle-container'];
let hotel = undefined;
const roomArray = [];
let hotelHasPage = false;
let vehicleHasPage = false;

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
            this.handleValidation();
            //this.handleGetVehicleList(0, 4);
            //this.handleGetHotelList(0, 4);
        });
        $('#backBtn').on('click', () => {
            console.log(array[array.length - 2]);
            this.handlePreviousContainer();
            //this.handleValidation();
            //this.handleGetVehicleList(0, 4);
            //this.handleGetHotelList(0, 4);
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
        $('#btnSuperLuxury').on('click', () => {
            this.handleGetDetails();
        });
        $('#btnLuxury').on('click', () => {

        });
        $('#btnMidLevel').on('click', () => {

        });
        $('#btnRegular').on('click', () => {

        });
        $('#CategoryCmb').on('change', () => {
            this.handleSetRoomPrice(hotel);
        });
        $('#startDateTxt').on('change', () => {
            this.handleSetEndMinDate();
            this.handleTotalFree();
        });
        $('#endDateTxt').on('change', () => {
            this.handleTotalFree();
        });
        $('#noOfAdultsTxt').on('keyup', () => {
            this.handleCountHeadCount($('#noOfAdultsTxt').val(), $('#noOfChildrenTxt').val());
        });
        $('#noOfChildrenTxt').on('keyup', () => {
            this.handleCountHeadCount($('#noOfChildrenTxt').val(), $('#noOfAdultsTxt').val());
        });
        $('#qtyAddBtn').on('click', () => {
            this.handleAddRoom();
            this.handleTotalFree();
        });
        $('#showR').on('click', 'i', (event) => {
            this.handleRemoveRoom(event);
            this.handleTotalFree();
        });

        this.handleDefaultData();

    }

    handleSetEndMinDate() {

        let endValue = new Date($('#startDateTxt').val());
        const end = $('#endDateTxt');
        endValue.setDate(endValue.getDate() + 1);

        endValue = endValue.toISOString().split('T')[0];
        end.attr("min", endValue);
        end.attr("value", endValue);
    }

    handleTotalFree() {

        console.log(roomArray.length)
        if (roomArray.length !== 0) {

            let tot = 0;
            const start = new Date($('#startDateTxt').val());
            const end = new Date($('#endDateTxt').val());

            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            roomArray.map(value => {
                tot += value.qty * parseInt(value.price) * days;
            });

            $('#totalLbl').text(tot);

        } else {
            $('#totalLbl').text(0.00);
        }
    }

    handleAddRoom() {

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

    handleCountHeadCount(x, y) {

        const z = $('#headCountLbl');
        x && y ? z.text(parseInt(x) + parseInt(y)) :
            y ? z.text(y) :
                x ? z.text(x) :
                    z.text(0);
    }

    handleSetRoomPrice(hotel) {

        const x = $('#CategoryCmb').val();
        const y = $('#priceLbl');

        x === "Full Luxury Double" ? y.text(hotel.fullDPrice) :
            x === "Half Luxury Double" ? y.text(hotel.halfDPrice) :
                x === "Full Luxury Triple" ? y.text(hotel.fullTPrice) :
                    x === "Half Luxury Triple" ? y.text(hotel.halfTPrice) :
                        y.text(0);

    }

    handleValidation() {

        travelArea.length === 0 ? alert('Please select our travel area !') :
            vehicleId === null && array[0] === '#vehicle-container' ?
                (this.handleGetVehicleList(0, count), this.handleNextContainer()) :
                vehicleId === null && array[0] === '#hotel-container' ? alert('Please select your vehicle !') :
                    vehicleId !== null && array[0] === '#hotel-container' ?
                        (this.handleGetHotelList(0, count), this.handleNextContainer()) :
                        hotelId === null && array[0] === '#other-details-container' ? alert('Please select your hotel !') :
                            vehicleId !== null && array[0] === '#other-details-container' ?
                                (this.handleGetMoreDetails(), this.handleNextContainer()) :
                                this.handleNextContainer();

    }

    handleReset(){
        $('#withPetCmb').prop("disabled", false);
    }

    handleNextContainer() {

        this.handleShowContainer(array[0]);
        array.unshift(array.pop());
    }

    handlePreviousContainer() {

        if (array[array.length - 2] !== '#other-details-container'){
            this.handleShowContainer(array[array.length - 2]);
            array.push(array.shift());
            this.handleReset();
        }
    }


    handleHideAllContainer() {

        array.map(value => {
            $(value).css({
                'display': 'none'
            });
        });
    }

    handleGetDetails() {

        this.handleHideAllContainer();
        this.handleNextContainer('#travel-area');
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

        $('#addPackage-container').css({
            'top': '0',
        });
        setTimeout(() => {
            $('#addPackage-container').css({
                'background': 'rgba(0, 0, 0, 0.5)'
            });
        }, 400);
        document.body.style.overflow = 'hidden';
    }

    handleRemoveAddEvent(event) {

        if (event.target.className === 'addPackage-container') {
            $("#addPackage-container").css({
                "top": "100vh",
                'background': 'none'
            });
            document.body.style.overflow = 'auto';
            //this.handleReset();
        }
    }

    handleAddSelectAreaStyle(event) {

        const child = $(event.target).closest('li').val();
        const area = $(event.target).closest('li').find('p').text();

        const t = $("#travel-area > ul li:nth-child(" + child + ") i");
        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        const index = travelArea.indexOf(area);
        index === -1 ? travelArea.push(area) : travelArea.splice(index);

    }

    handleGetMoreDetails() {

        this.handleGetHotel(hotelId);
    }

    handleGetHotel(hotelId) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/get?hotelId=" + hotelId,
            method: "GET",
            processData: false,
            contentType: false,
            async: true,
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

    handleGetHotelList(page, count) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/getPageable?page=" + page + "&count=" + count,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
            success: (resp) => {
                if (resp.code === 200) {
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
        }else {
            hotelHasPage = false;
        }
    }

    handleAddSelectHotel(event) {

        const child = $(event.target).closest('li').find('p').text();
        hotelId = $(event.target).closest('li').find('h2').text();


        const t = $("#hotel-container > ul li:nth-child(" + child + ") i:nth-child(7)");

        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        if (oldHotelChild && oldHotelChild !== child) {
            const x = $("#hotel-container > ul li:nth-child(" + oldHotelChild + ") i:nth-child(7)");
            x.css({'rotate': '0deg'}) && x.removeClass('fa-check') && x.addClass('fa-plus');
        }
        oldHotelChild = child;
    }

    handleNextHotelList() {

        if (hNextPage !== 0) {
            this.handleGetHotelList(hNextPage, count);
            if (hotelHasPage){
                hCurrentPage++;
                hNextPage++;
            }
        }
    }

    handlePreviousHotelList() {

        if (hCurrentPage !== 0) {
            hCurrentPage--;
            hNextPage--;
            this.handleGetHotelList(hCurrentPage, count);
        }
    }

    handleGetVehicleList(page, count) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/vehicle/getPageable?page=" + page + "&count=" + count,
            method: "GET",
            processData: false,
            contentType: false,
            async: false,
            success: (resp) => {
                if (resp.code === 200) {
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

    handleLoadVehicles(data) {

        if(data.length !== 0) {


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
        }else {
            vehicleHasPage = false;
        }
    }

    handleAddSelectVehicleStyle(event) {

        const child = $(event.target).closest('li').find('p').text();
        vehicleId = $(event.target).closest('li').find('h2').text();

        const t = $("#vehicle-container > ul li:nth-child(" + child + ") i");

        t.hasClass('fa-plus') ?
            t.css({'rotate': '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate': '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        if (oldVehicleChild && oldVehicleChild !== child) {
            const x = $("#vehicle-container > ul li:nth-child(" + oldVehicleChild + ") i");
            x.css({'rotate': '0deg'}) && x.removeClass('fa-check') && x.addClass('fa-plus');
        }
        oldVehicleChild = child;
    }

    handleNextVehicleList() {
        if (vNextPage !== 0) {
            this.handleGetVehicleList(vNextPage, count);
            if(vehicleHasPage){
                vCurrentPage++;
                vNextPage++;
            }
        }
    }

    handlePreviousVehicleList() {
        if (vCurrentPage !== 0) {
            vCurrentPage--;
            vNextPage--;
            this.handleGetVehicleList(vCurrentPage, count);
        }
    }

    handleRemoveRoom(event) {

        const index = parseInt($(event.target).closest('li').find('h2').text());
        roomArray.splice(index, 1);
        this.handleViewCart();
    }
}

new PackageController();