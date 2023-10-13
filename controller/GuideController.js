import {Guide} from "../model/Guide.js";

const nicImgIdsArray = ["#guideAddNicImg1", "#guideAddNicImg2"];
const guidIdImgIdsArray = ["#guideAddIdImg1", "#guideAddIdImg2"];
const nicArray = new Array(2);
const idArray = new Array(2);
let guideImgFile = undefined;
let guideId = undefined;

export class GuideController {
    constructor() {
        $('#guideAddImgFile').on('change', (event) => {
            this.handleUploadGuidImg();
        });
        $('#guideAddNicImgFile').on('change', (event) => {
            this.handleUploadGuidNicOrIdImg('#guideAddNicImgFile', nicImgIdsArray, nicArray);
        });
        $('#guideAddIdImgFile').on('change', (event) => {
            this.handleUploadGuidNicOrIdImg('#guideAddIdImgFile', guidIdImgIdsArray, idArray);
        });
        $('#guideAddFilter').on('click', (event) => {
            this.handleUpFilterClickEvent(event);
        });
        $("#addGuideBtn").on('click', () => {
            this.handleGuideAddContainerShowEvent();
        });
        $("#saveGuideBtn").on('click', () => {
            this.handleValidation('save');
        });
        $("#updateGuideBtn").on('click', () => {
            this.handleValidation('update');
        });
        $("#deleteGuideBtn").on('click', () => {
            this.handleDeleteGuide(guideId);
        });
        this.handleLoadAllGuideData();
        this.handleGuideEditeEvent();
    }

    handleUploadGuidImg() {

        const file = $('#guideAddImgFile')[0].files[0];
        const selectedImage = $('#guideAddImg');
        guideImgFile = file;
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                selectedImage.attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad");
        }
    }

    handleUploadGuidNicOrIdImg(selector, idsArray, fileArray) {

        const file = $(selector)[0].files[0];
        const selectedImage = $(idsArray[0]);
        fileArray[0] = file;
        idsArray.reverse();
        fileArray.reverse();

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                selectedImage.attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("awad");
        }
    }

    handleUpFilterClickEvent(event) {
        if (event.target.className === 'guideAdd') {
            $("#guideAddFilter").css({
                "display": "none"
            });
        }
    }

    handleGuideEditeEvent() {

        $('#guideUl').on('click', 'button', (event) => {
            guideId = parseInt($(event.target).closest('li').find('h3:nth-child(2)').text());

            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/guide/get?guideId=" + guideId,
                method: "GET",
                processData: false, // Prevent jQuery from processing the data
                contentType: false,
                async: true,
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleEditDetails(resp.data);
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

    handleGuideAddContainerShowEvent() {
        $("#guideAddFilter").css({
            "display": "flex"
        });
    }

    handleValidation(fun) {

        !/^[A-Za-z ]+$/.test($('#guideNameTxt').val()) ? alert("Guide name or empty !") :
            !/^[A-Za-z ]+$/.test($('#guideAddressTxt').val()) ? alert("Guide address or empty !") :
                !/^[0-9]+$/.test($('#guideAgeTxt').val()) ? alert("Guide age invalid or empty !") :
                    !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#guideContactTxt').val()) ? alert("Invalid contact !") :
                        !/^[0-9]+$/.test($('#guideManDayValueTxt').val()) ? alert("Man day value invalid or empty !") :
                            fun === 'update' ? this.handleUpdateGuide(guideId) :
                                !$('#guideAddImgFile')[0].files[0] ? alert("Please select the guide image !") :
                                    !nicArray[0] ? alert("Please select the Nic image !") :
                                        !nicArray[1] ? alert("Please select the Nic image !") :
                                            !idArray[0] ? alert("Please select the guid ID image !") :
                                                !idArray[1] ? alert("Please select guide ID image !") :
                                                    this.handleSaveGuide();
    }

    handleSaveGuide() {

        const guide = JSON.stringify(new Guide(
            null,
            $('#guideNameTxt').val(),
            $('#guideAddressTxt').val(),
            $('#guideAgeTxt').val(),
            $('#guideGenderCmb').val(),
            $('#guideContactTxt').val(),
            $('#guideManDayValueTxt').val(),
            null,
            null,
            null
        ));
        console.log(guide)

        const formGuideData = new FormData();

        const imageList = [$('#guideAddImgFile')[0].files[0], nicArray[0], nicArray[1], idArray[0], idArray[1]];

        console.log(imageList[0]);

        imageList.map(value => {
            formGuideData.append('imageList', value);
        });

        formGuideData.append('guide', guide);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide",
            method: "POST",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formGuideData,
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

    handleLoadAllGuideData() {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide/getAll",
            method: "GET",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadGuide(resp.data);
                    alert(resp.message);
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleLoadGuide(data) {

        $('#guideUl li').remove();

        data.map(value => {

            let li = "<li>\n" +
                "                    <img src=\"assets/images/google.png\">\n" +
                "                    <h3>null</h3>\n" +
                "                    <h3>null</h3>\n" +
                "                    <h3>null</h3>\n" +
                "                    <h3>null</h3>\n" +
                "                    <h3>null</h3>\n" +
                "                    <h3>null</h3>\n" +
                "                    <button type=\"button\">Edit</button>\n" +
                "                </li>";

            $('#guideUl').append(li);
            $('#guideUl li:last-child img').attr('src', `data:image/png;base64,${value.guideImage}`);
            $('#guideUl li:last-child h3:nth-child(2)').text(value.guideId);
            $('#guideUl li:last-child h3:nth-child(3)').text(value.name);
            $('#guideUl li:last-child h3:nth-child(4)').text(value.address);
            $('#guideUl li:last-child h3:nth-child(5)').text(value.age);
            $('#guideUl li:last-child h3:nth-child(6)').text(value.gender);
            $('#guideUl li:last-child h3:nth-child(7)').text(value.contact);
        });
    }

    handleEditDetails(data) {

        $("#guideAddImg").attr('src', `data:image/png;base64,${data.guideImage}`);
        $("#guideAddNicImg1").attr('src', `data:image/png;base64,${data.nicImageList[0]}`);
        $("#guideAddNicImg2").attr('src', `data:image/png;base64,${data.nicImageList[1]}`);
        $("#guideAddIdImg1").attr('src', `data:image/png;base64,${data.guideIdImageList[0]}`);
        $("#guideAddIdImg2").attr('src', `data:image/png;base64,${data.guideIdImageList[1]}`);
        $("#guideNameTxt").val(data.name);
        $("#guideAddressTxt").val(data.address);
        $("#guideAgeTxt").val(data.age);
        $("#guideGenderCmb").val(data.gender);
        $("#guideContactTxt").val(data.contact);
        $("#guideManDayValueTxt").val(data.manDayValue);

        guideImgFile = this.handleGetNewImgFile(data.guideImage, 'guideImage');
        nicArray[0] = this.handleGetNewImgFile(data.nicImageList[0], 'nicImage_1');
        nicArray[1] = this.handleGetNewImgFile(data.nicImageList[1], 'nicImage_2');
        idArray[0] = this.handleGetNewImgFile(data.guideIdImageList[0], 'guideIdImage_1');
        idArray[1] = this.handleGetNewImgFile(data.guideIdImageList[1], 'guideIdImage_2');

        this.handleGuideAddContainerShowEvent();
    }

    handleGetNewImgFile(base64Array, imageName) {

        const byteString = atob(base64Array);
        const blob = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }

        return new File([blob], imageName + ".jpg", {type: "image/jpeg"});
    }

    handleUpdateGuide(guideId) {

        const guide = JSON.stringify(new Guide(
            guideId,
            $('#guideNameTxt').val(),
            $('#guideAddressTxt').val(),
            $('#guideAgeTxt').val(),
            $('#guideGenderCmb').val(),
            $('#guideContactTxt').val(),
            $('#guideManDayValueTxt').val(),
            null,
            null,
            null
        ));

        const formGuideData = new FormData();

        const imageList = [guideImgFile, nicArray[0], nicArray[1], idArray[0], idArray[1]];

        console.log(imageList[0]);

        imageList.map(value => {
            formGuideData.append('imageList', value);
        });

        formGuideData.append('guide', guide);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide",
            method: "PUT",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            data: formGuideData,
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

    handleDeleteGuide(guideId) {

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide?guideId=" + guideId,
            method: "DELETE",
            processData: false, // Prevent jQuery from processing the data
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
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

new GuideController();