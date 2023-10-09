import {Hotel} from "../model/Hotel.js";

let hotelCategory;

export class HotelController {
    constructor() {
        $("#hotelImage").on('change', () => {
            this.handleImageLoadEvent();
        });
        $("#saveHotelBtn").on('click', () => {
            this.handleValidation();
        });
        $("#addHotelBtn").on('click', () => {
            this.handleAddHotelContainer();
        });
        $(".hotel-add").on('click', (event) => {
            this.handleHotelAddContainerClickEvent(event);
        });
        this.handleHotelCategoryClickEvent();
        this.handleLoadAllData();

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

        const file = $('#hotelImage')[0].files[0];
        const selectedImage = $('#hotel-img');
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
        !/^[A-Za-z ]+$/.test($('#hotelNameTxt').val()) ? alert("Hotel name invalid or empty !") :
            !hotelCategory ? alert("Hotel category or empty !") :
                !/^[A-Za-z ]+$/.test($('#hotelLocationTxt').val()) ? alert("Hotel location invalid or empty !") :
                    !/^[A-Za-z ]+/.test($('#hotelUrlTxt').val()) ? alert("Hotel location url empty !") :
                        !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test($('#hotelEmailTxt').val()) ? alert("Invalid email !") :
                            !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#hotelContactTxt1').val()) ? alert("Invalid contact 1 !") :
                                !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#hotelContactTxt2').val()) ? alert("Invalid contact 2") :
                                    !/^[0-9]+/.test($('#hotelFreeTxt').val()) ? alert("Hotel free invalid or empty !") :
                                        !$('#hotelImage')[0].files[0] ? alert("Please select the image !") :
                                            $.trim($('#hotelRemakesTxt').val()) === '' ? alert("Remarks is empty !") :
                                                this.handleSaveHotel();


    }

    handleSaveHotel() {

        const contact1 = {
            contact: $('#hotelContactTxt1').val()
        }
        const contact2 = {
            contact: $('#hotelContactTxt2').val()
        }

        const isPetAllow = $('#hotelPetAllowCheck').is(':checked') ? "Yes" : "No";

        const contactList = [contact1, contact2];

        const hotel = JSON.stringify(new Hotel(null,
            $('#hotelNameTxt').val(),
            hotelCategory,
            $('#hotelLocationTxt').val(),
            $('#hotelUrlTxt').val(),
            $('#hotelEmailTxt').val(),
            contactList,
            isPetAllow,
            parseInt($('#hotelFreeTxt').val()),
            $('#hotelCriteriaCmb').val(),
            $('#hotelRemakesTxt').val(),
            null));

        console.log(hotel);

        const formHotelData = new FormData();
        const fileInput = $('#hotelImage')[0].files[0];

        formHotelData.append('file', fileInput);
        formHotelData.append('hotel', hotel);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel",
            method: "POST",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formHotelData,
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

    handleAddHotelContainer() {
        $(".hotel-add").css({
            "display": "block"
        });
    }

    handleHotelAddContainerClickEvent(event) {
        if (event.target.className === 'hotel-add') {
            $(".hotel-add").css({
                "display": "none"
            });
        }
    }

    handleLoadAllData() {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/hotel/getAll",
            method: "GET",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            success: (resp) => {
                console.log(resp)
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
        // $('#hotelUl li').remove();

        var img = "<img src='#'>"
        var li = "<li><img src='#'></li>";

        /*const imgElement = $("#wwwww");
        imgElement.attr("src", "assets/images/login.jpg");*/

        data.map(value => {
            console.log(value)
            $('#wwwww').attr('src', `data:image/png;base64,${value.hotelImageLocation}`);

            $('#hotelUl').append(li);
        });
    }
}

new HotelController();