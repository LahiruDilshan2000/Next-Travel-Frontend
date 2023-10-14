import {Guide} from "../model/Guide.js";

const imageFileList = new Array(5);
let arrayIndex = null;
let imgId = undefined;
let guideId = null;

export class GuideController {
    constructor() {
        $('#guideAddImgFile').on('change', () => {
            this.handleLoadChangeEvent(imgId, arrayIndex);
        });
        $('#guideAddImg').on('click', () => {
            this.handleLoadImageEvent('#guideAddImg', 0);
        });
        $('#guideAddNicImg1').on('click', () => {
            this.handleLoadImageEvent('#guideAddNicImg1', 1);
        });
        $('#guideAddNicImg2').on('click', () => {
            this.handleLoadImageEvent('#guideAddNicImg2', 2);
        });
        $('#guideAddIdImg1').on('click', () => {
            this.handleLoadImageEvent('#guideAddIdImg1', 3);
        });
        $('#guideAddIdImg2').on('click', () => {
            this.handleLoadImageEvent('#guideAddIdImg2', 4);
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

    handleLoadImageEvent(id, index) {

        imgId = id;
        arrayIndex = index;
        $('#guideAddImgFile').click();
    }

    handleLoadChangeEvent(imgId, arrayIndex) {

        const file = $("#guideAddImgFile")[0].files[0];
        imageFileList[arrayIndex] = file;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $(imgId).attr('src', event.target.result);
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
            this.handleReset();
        }
    }

    handleGuideEditeEvent() {

        $('#guideUl').on('click', 'button', (event) => {
            guideId = parseInt($(event.target).closest('li').find('h3:nth-child(2)').text());

            $.ajax({
                url: "http://localhost:8081/nexttravel/api/v1/guide/get?guideId=" + guideId,
                method: "GET",
                processData: false,
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
                    $('#guideGenderCmb').val() === 'default' ? alert("Guide gender invalid or empty !") :
                        !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#guideContactTxt').val()) ? alert("Invalid contact !") :
                            !/^[0-9]+$/.test($('#guideManDayValueTxt').val()) ? alert("Man day value invalid or empty !") :
                                fun === 'update' ? this.handleUpdateGuide(guideId) :
                                    !imageFileList[0] ? alert("Please select the guide image !") :
                                        !imageFileList[1] ? alert("Please select the Nic image !") :
                                            !imageFileList[2] ? alert("Please select the Nic image !") :
                                                !imageFileList[3] ? alert("Please select guide ID image !") :
                                                    !imageFileList[4] ? alert("Please select guide ID image !") :
                                                        this.handleSaveGuide();
    }

    handleGetGuideObject() {
        return JSON.stringify(new Guide(
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

    }

    handleSaveGuide() {

        const guide = this.handleGetGuideObject();

        const formGuideData = new FormData();

        imageFileList.map(value => {
            formGuideData.append('imageList', value);
        });

        formGuideData.append('guide', guide);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide",
            method: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formGuideData,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllGuideData();
                    this.handleReset();
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
            processData: false,
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    this.handleLoadGuide(resp.data);
                    console.log(resp.message);
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
            $('#guideUl li:last-child img').attr('src', `data:image/png;base64,${value.guideIdImageList[0]}`);
            $('#guideUl li:last-child h3:nth-child(2)').text(value.guideId);
            $('#guideUl li:last-child h3:nth-child(3)').text(value.name);
            $('#guideUl li:last-child h3:nth-child(4)').text(value.address);
            $('#guideUl li:last-child h3:nth-child(5)').text(value.age);
            $('#guideUl li:last-child h3:nth-child(6)').text(value.gender);
            $('#guideUl li:last-child h3:nth-child(7)').text(value.contact);
        });
    }

    handleEditDetails(data) {

        guideId = data.guideId;
        $("#guideAddImg").attr('src', `data:image/png;base64,${data.guideIdImageList[0]}`);
        $("#guideAddNicImg1").attr('src', `data:image/png;base64,${data.guideIdImageList[1]}`);
        $("#guideAddNicImg2").attr('src', `data:image/png;base64,${data.guideIdImageList[2]}`);
        $("#guideAddIdImg1").attr('src', `data:image/png;base64,${data.guideIdImageList[3]}`);
        $("#guideAddIdImg2").attr('src', `data:image/png;base64,${data.guideIdImageList[4]}`);
        $("#guideNameTxt").val(data.name);
        $("#guideAddressTxt").val(data.address);
        $("#guideAgeTxt").val(data.age);
        $("#guideGenderCmb").val(data.gender);
        $("#guideContactTxt").val(data.contact);
        $("#guideManDayValueTxt").val(data.manDayValue);

        imageFileList[0] = this.handleGetNewImgFile(data.guideIdImageList[0], 'guide_img');
        imageFileList[1] = this.handleGetNewImgFile(data.guideIdImageList[1], 'nic_img_1');
        imageFileList[2] = this.handleGetNewImgFile(data.guideIdImageList[2], 'nic_img_2');
        imageFileList[3] = this.handleGetNewImgFile(data.guideIdImageList[3], 'guide_id_img_1');
        imageFileList[4] = this.handleGetNewImgFile(data.guideIdImageList[4], 'guide_id_img_2');

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

    handleUpdateGuide() {

        const guide = this.handleGetGuideObject();

        const formGuideData = new FormData();

        imageFileList.map(value => {
            formGuideData.append('imageList', value);
        });

        formGuideData.append('guide', guide);

        $.ajax({
            url: "http://localhost:8081/nexttravel/api/v1/guide",
            method: "PUT",
            processData: false,
            contentType: false,
            async: true,
            data: formGuideData,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllGuideData();
                    this.handleReset();
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
            processData: false,
            contentType: false,
            async: true,
            success: (resp) => {
                if (resp.code === 200) {
                    console.log(resp.message);
                    this.handleLoadAllGuideData();
                    this.handleReset();
                }
            },
            error: (ob) => {
                console.log(ob)
                alert(ob.responseJSON.message);
            },
        });
    }

    handleReset() {

        $('#guideAddImg').attr('src', `assets/images/defaultimage.jpg`);
        $('#guideAddNicImg1').attr('src', `assets/images/defaultimage.jpg`);
        $('#guideAddNicImg2').attr('src', `assets/images/defaultimage.jpg`);
        $('#guideAddIdImg1').attr('src', `assets/images/defaultimage.jpg`);
        $('#guideAddIdImg2').attr('src', `assets/images/defaultimage.jpg`);
        $('#guideNameTxt').val("");
        $('#guideAddressTxt').val("");
        $('#guideAgeTxt').val("");
        $('#guideGenderCmb').val("default");
        $('#guideContactTxt').val("");
        $('#guideManDayValueTxt').val("");
        $('#guideAddImgFile').val('');
        $('#guideAddNicImgFile').val('');
        $('#guideAddIdImgFile').val('');

        guideId = null;

        for (let i = 0; i < imageFileList.length; i++){
            imageFileList[0] = undefined;
        }
        $("#guideAddFilter").css({
            "display": "none"
        });
    }
}

new GuideController();