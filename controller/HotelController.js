import {Hotel} from "../model/Hotel.js";

let hotelId = null;
let hotelCategory = undefined;
let hotelImageFile = undefined;

export class HotelController {
    constructor() {
        $("#hotelAddImgFile").on('change', () => {
            this.handleImageLoadEvent();
        });
        $(".hotelAddImg").on('click', () => {
            $("#hotelAddImgFile").click();
        });
        $("#saveHotelBtn").on('click', () => {
            this.handleValidation('save');
        });
        $("#updateHotelBtn").on('click', () => {
            this.handleValidation('update');
        });
        $("#addHotelBtn").on('click', () => {
            this.handleAddHotelContainer();
        });
        $(".hotelAdd").on('click', (event) => {
            this.handleHotelAddContainerClickEvent(event);
        });
        $("#hotelView").on('click', (event) => {
            this.handleHotelViewFilterClickEvent(event);
        });
        $("#hotelView div.form-group.col-md-2 i").on('click', () => {
            this.handleHotelViewEditOptions();
        });
        $("#btnHotelEdit").on('click', () => {
            this.handleHotelEdit(hotelId);
        });
        $("#btnHotelDelete").on('click', () => {
            this.handleHotelDelete(hotelId);
        });
        this.handleHotelCategoryClickEvent();
        this.handleLoadAllData();
        this.handleHotelContainerClickEvent();


    }

    handleHotelViewFilterClickEvent(event) {
        if (event.target.className === 'hotelView') {
            $("#hotelView").css({
                "display": "none"
            });
            this.handleReset();
        }
    }

    handleHotelContainerClickEvent() {
        //#hotelUl > li:nth-child(2) > i
        $('#hotelUl').on('click', 'i:nth-child(6)', (event) => {
            const hotelId = parseInt($(event.target).closest('li').find('h2').text());

            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/hotel/get?hotelId=" + hotelId,
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

        hotelId = data.hotelId;
        $(".hotelViewImg").attr('src', `data:image/png;base64,${data.hotelImageLocation}`);
        $("#hotelViewNameLbl").text(data.hotelName);
        $("#hotelViewLocationLbl").text(data.hotelLocation);
        $("#fullDPriceLbl").text(data.fullDPrice);
        $("#halfDPriceLbl").text(data.halfDPrice);
        $("#fullTPriceLbl").text(data.fullTPrice);
        $("#halfTPriceLbl").text(data.halfTPrice);
        $("#hotelViewCriteriaTxtLbl").text(data.cancellationCriteria);
        $("#petAllowLbl").text(data.isPetAllow);
        $("#hotelViewContact1Lbl").text(data.contactList[0].contact);
        $("#hotelViewContact2Lbl").text(data.contactList[1].contact);
        $("#hotelViewEmailLbl").text(data.hotelEmail);

        for (let i = 1; i <= data.hotelCategory; i++) {
            $('.star-selector > div > i:nth-child(' + i + ')').addClass('activeStar');
        }

        $('#hotelView').css({
            "display": "flex"
        });

        document.body.style.overflow = 'hidden';

    }

    handleHotelCategoryClickEvent() {

        const stars = document.querySelectorAll(".stars i");

        stars.forEach((star, index1) => {
            $(star).on('click', () => {
                hotelCategory = index1 + 1;
                stars.forEach((star, index2) => {
                    index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
                });
            });
        });
    }

    handleImageLoadEvent() {

        const file = $('#hotelAddImgFile')[0].files[0];
        hotelImageFile = file;
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $('.hotelAddImg').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad")
        }
    }

    handleValidation(fun) {

        !/^[A-Za-z ]+$/.test($('#hotelNameTxt').val()) ? alert("Hotel name invalid or empty !") :
            !hotelCategory ? alert("Hotel category or empty !") :
                !/^[A-Za-z ]+$/.test($('#hotelLocationTxt').val()) ? alert("Hotel location invalid or empty !") :
                    !/^\bhttps?:\/\/\S+\b/.test($('#hotelUrlTxt').val()) ? alert("Hotel location url empty !") :
                        !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#hotelEmailTxt').val()) ? alert("Invalid email !") :
                            !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#hotelContactTxt1').val()) ? alert("Invalid contact 1 !") :
                                !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#hotelContactTxt2').val()) ? alert("Invalid contact 2") :
                                    $('#hotelIsPetAllowCmb').val() === 'default' ? alert("Please select the pet allow section !") :
                                        !/^[0-9]+$/.test($('#fullDFreeTxt').val()) ? alert("Full Luxury-D free invalid or empty !") :
                                            !/^[0-9]+$/.test($('#halfDFreeTxt').val()) ? alert("Half Luxury-D free invalid or empty !") :
                                                !/^[0-9]+$/.test($('#fullTFreeTxt').val()) ? alert("Full Luxury-T free invalid or empty !") :
                                                    !/^[0-9]+$/.test($('#halfTFreeTxt').val()) ? alert("Half Luxury-T free invalid or empty !") :
                                                        $('#hotelCriteriaCmb').val() === 'default' ? alert("Please select Cancellation criteria section !") :
                                                            fun === 'update' ? this.handleUpdateHotel() :
                                                                !$('#hotelAddImgFile')[0].files[0] ? alert("Please select the image !") :
                                                                    this.handleSaveHotel();
    }

    handleGetHotelObject() {

        const contact1 = {
            contact: $('#hotelContactTxt1').val()
        }
        const contact2 = {
            contact: $('#hotelContactTxt2').val()
        }

        const contactList = [contact1, contact2];

        return JSON.stringify(new Hotel(
            hotelId,
            $('#hotelNameTxt').val(),
            hotelCategory,
            $('#hotelLocationTxt').val(),
            $('#hotelUrlTxt').val(),
            $('#hotelEmailTxt').val(),
            contactList,
            $('#hotelIsPetAllowCmb').val(),
            parseInt($('#fullDFreeTxt').val()),
            parseInt($('#halfDFreeTxt').val()),
            parseInt($('#fullTFreeTxt').val()),
            parseInt($('#halfTFreeTxt').val()),
            $('#hotelCriteriaCmb').val(),
            null
        ));
    }

    handleSaveHotel() {

        const hotel = this.handleGetHotelObject();
        const formHotelData = new FormData();

        formHotelData.append('file', hotelImageFile);
        formHotelData.append('hotel', hotel);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formHotelData,
            success: (resp) => {
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

    handleAddHotelContainer() {
        $(".hotelAdd").css({
            "display": "flex"
        });
        document.body.style.overflow = 'hidden';
    }

    handleHotelAddContainerClickEvent(event) {
        if (event.target.className === 'hotelAdd') {
            $(".hotelAdd").css({
                "display": "none"
            });
            this.handleReset();
        }
    }

    handleLoadAllData() {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/getAll",
            method: "GET",
            processData: false,
            contentType: false,
            async: true,
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

    handleLoadItem(data) {
        $('#hotelUl li').remove();

        data.map(value => {
            let li = "<li>\n" +
                "                    <img src=\"assets/images/login.jpg\">\n" +
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
                "                    <i class=\"fa-solid fa-arrow-right\"></i>\n" +
                "                </li>";


            $('#hotelUl').append(li);
            $('#hotelUl li:last-child img').attr('src', `data:image/png;base64,${value.hotelImageLocation}`);
            $('#hotelUl li:last-child h2').text(value.hotelId);
            $('#hotelUl li:last-child h3:nth-child(3)').text(value.hotelName);
            $('#hotelUl li:last-child h3:nth-child(4)').text(value.hotelLocation);

            for (let i = 1; i <= value.hotelCategory; i++) {
                $('#hotelUl li:last-child > div > div > i:nth-child(' + i + ')').addClass('activeView');
            }
        });
    }

    handleReset() {

        $('.hotelAddImg').attr('src', `assets/images/defaultimage.jpg`);
        $('#hotelNameTxt').val("");
        $('#hotelLocationTxt').val("");
        $('#hotelUrlTxt').val("");
        $('#hotelEmailTxt').val("");
        $('#hotelContactTxt1').val("");
        $('#hotelContactTxt2').val("");
        $('#hotelIsPetAllowCmb').val("default");
        $('#fullDFreeTxt').val("");
        $('#halfDFreeTxt').val("");
        $('#fullTFreeTxt').val("");
        $('#halfTFreeTxt').val("");
        $('#hotelCriteriaCmb').val("default");
        $('#hotelAddImgFile').val('');


        hotelId = null;
        hotelCategory = undefined;
        hotelImageFile = undefined;

        $('.stars i').removeClass('active');
        $('.star-selector > div > i').removeClass('activeStar');
        this.handleRemoveStyles();

        document.body.style.overflow = 'auto';

        $("#hotelView").css({
            "display": "none"
        });
        $("#hotelAdd").css({
            "display": "none"
        });
    }

    handleHotelViewEditOptions() {

        $("#hotelView div.form-group.col-md-2 i").hasClass('remove') ? this.handleRemoveStyles() : this.handleAddStyles();

    }

    handleAddStyles() {

        $('#hotelView > div > form > div > div:nth-child(12) span').css({
            'width': '100%',
            'height': '100%'
        });

        $('#hotelView > div > form > div > div.form-group.col-md-2 i').css({
            'transform': `rotate(${46}deg)`,
            'background': 'rgba(255, 0, 0, 0.5)',
            'color': 'rgba(255, 255, 255, 0.8)'

        });

        $("#hotelView div.form-group.col-md-2 i").addClass('remove');
    }

    handleRemoveStyles() {

        $('#hotelView > div > form > div > div:nth-child(12) span').css({
            'width': '0',
            'height': '0'
        });

        $('#hotelView > div > form > div > div.form-group.col-md-2 i').css({
            'transform': `rotate(${0}deg)`,
            'background': 'none',
            'color': 'rgba(0, 0, 0, 0.7)'
        });

        $("#hotelView div.form-group.col-md-2 i").removeClass('remove');
    }

    handleHotelEdit(hotelId) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/get?hotelId=" + hotelId,
            method: "GET",
            processData: false,
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleReset();
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

    handleHotelDelete(hotelId) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel?hotelId=" + hotelId,
            method: "DELETE",
            processData: false,
            contentType: false,
            async: true,
            success: (resp) => {
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

    handleEditDetails(data) {

        $(".hotelAddImg").attr('src', `data:image/png;base64,${data.hotelImageLocation}`);
        $("#hotelNameTxt").val(data.hotelName);
        $("#hotelLocationTxt").val(data.hotelLocation);
        $("#hotelUrlTxt").val(data.locationUrl);
        $("#hotelEmailTxt").val(data.hotelEmail);
        $("#hotelContactTxt1").val(data.contactList[0].contact);
        $("#hotelContactTxt2").val(data.contactList[1].contact);
        $("#hotelIsPetAllowCmb").val(data.isPetAllow);
        $("#fullDFreeTxt").val(data.fullDPrice);
        $("#halfDFreeTxt").val(data.halfDPrice);
        $("#fullTFreeTxt").val(data.fullTPrice);
        $("#halfTFreeTxt").val(data.halfTPrice);
        $("#hotelCriteriaCmb").val(data.cancellationCriteria);

        hotelCategory = data.hotelCategory;

        for (let i = 1; i <= data.hotelCategory; i++) {
            $('#hotelAdd .star-selector i:nth-child(' + i + ')').addClass('active');
        }

        hotelId = data.hotelId;
        hotelImageFile = this.handleGetNewImgFile(data.hotelImageLocation, 'hotelImage');

        this.handleAddHotelContainer();
    }

    handleGetNewImgFile(base64Array, imageName) {

        const byteString = atob(base64Array);
        const blob = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }

        return new File([blob], imageName + ".jpg", {type: "image/jpeg"});
    }

    handleUpdateHotel() {

        const hotel = this.handleGetHotelObject();
        const formHotelData = new FormData();

        formHotelData.append('file', hotelImageFile);
        formHotelData.append('hotel', hotel);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel",
            method: "PUT",
            processData: false,
            contentType: false,
            async: true,
            data: formHotelData,
            success: (resp) => {
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

new HotelController();