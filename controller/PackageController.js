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
            this.handleGetVehicleList(0, 4);
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

    handleNextContainer() {

        const containerList = ['#travel-area', '#hotel-container'];

        containerList.map(value => {
            $(value).css({'display': 'none'});
        });

        $(containerList[1]).css({'display': 'block'});
    }

    handleGetHotelList(page, count) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/getPageable?page=" + page + "&count=" + count,
            method: "GET",
            processData: false,
            contentType: false,
            async: true,
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

    handleAddHotel(event) {

        const child = $(event.target).closest('li').val();
        const area = $(event.target).closest('li').find('h2').text();

        console.log(area);

        /*const t = $("#travel-area > ul li:nth-child(" + child + ") i");
        t.hasClass('fa-plus') ?
            t.css({'rotate' : '360deg'}) && t.removeClass('fa-plus') && t.addClass('fa-check') :
            t.css({'rotate' : '0deg'}) && t.removeClass('fa-check') && t.addClass('fa-plus');

        const index = travelArea.indexOf(area);
        index === -1 ? travelArea.push(area) : travelArea.splice(index);*/
    }

    handleLoadHotels(data) {

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
        console.log(hNextPage)
        if (hNextPage !== 0) {
            this.handleGetHotelList(hNextPage, count);
            hCurrentPage++;
            hNextPage++;
        }
    }

    handlePreviousHotelList() {
        console.log(hCurrentPage)
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
            async: true,
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
            vCurrentPage++;
            vNextPage++;
        }
    }

    handlePreviousVehicleList() {
        console.log(vCurrentPage)
        if (vCurrentPage !== 0) {
            vCurrentPage--;
            vNextPage--;
            this.handleGetVehicleList(vCurrentPage, count);
        }
    }
}

new PackageController();