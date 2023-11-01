let packageOb = null;
let hotelOb = null;
let vehicleOb = null;
let packageId = null;
let file = null;
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/package";

export class PackageViewController {
    constructor() {
        $('#view-package').on('click', (event) => {
            this.handleRemoveViewEvent(event);
        });
        $('#packageUl').on('click', 'li', (event) => {
            this.handleShowPackageDetails(event);
        });
        $('#bookingList').on('click', 'li i:first-child', (event) => {
            this.handleAddSlipEvent(event);
        });
        $('#bellIcon').on('click', () => {
            this.handleShowNotification();
        });
        $('#addSlip').on('click', (event) => {
            this.handleHideSlipContainer(event);
        });
        $('#editPackageContainer').on('click', (event) => {
            this.handleHideNotification(event);
        });
        $("#slipFile").on('change', () => {
            this.handleAddImg();
        });
        $('#slipImg').on('click', () => {
            $("#slipFile").click();
        });
        $('#submitPaymentBtn').on('click', () => {
            this.handleUploadSlip();
        });
        $('#paymentUl').on('click', 'li i', (event) => {
            this.handleViewSlip(event);
        });
        $('#confirm-Slip').on('click', (event) => {
            this.handleHideSlip(event);
        });
        $('#confirmBtn').on('click', () => {
            this.handlePaymentConfirm(packageId);
        });
        $('#rejectBtn').on('click', () => {
            this.handlePaymentReject(packageId);
        });
        this.handleGetNotification();
    }

    handleRemoveViewEvent(event) {

        if (event.target.className === 'view-package') {
            $('#view-package').css({'right': '-1600px'});
            document.body.style.overflow = 'auto';
        }
    }

    handleShowPackageDetails(event) {

        const x = document.getElementById('showPayment');
        if (x.offsetHeight === 300) {
            $('#showPayment').css({'height': '0', 'width': '0', 'padding': '0'});
            return;
        }
        if (event.target.className !== 'button') {
            const packageId = $(event.target).closest('li').find('h3:nth-child(1)').text();
            this.handleGetPackage(packageId);
            this.handleGetHotel(packageOb.hotelId);
            this.handleGetVehicle(packageOb.vehicleId);
            $("#viewPackageImg").attr('src', `data:image/png;base64,${hotelOb.hotelImageLocation}`);
            $("#viewOrderIdLbl").text(packageOb.packageId);
            $("#viewHotelNameLbl").text(packageOb.hotelName);
            $("#viewVehicleNameLbl").text(vehicleOb.vehicleBrand);
            $("#viewUserEmailLbl").text(packageOb.email);
            $("#viewUserNicLbl").text(packageOb.userNic);

            let travelArea = "";
            packageOb.travelArea.map((value, index) => {
                console.log(value)
                if (packageOb.travelArea.length - 1 !== index) {
                    travelArea += value + ", ";
                } else {
                    travelArea += value
                }
            });
            $("#viewTravelAreaLbl").text(travelArea);

            let qty = 0;
            packageOb.roomDetailList.map(value => {
                qty += value.qty;
            });
            $("#viewRoomQtyLbl").text(qty);

            $("#viewGuideLbl").text(packageOb.guideId);
            $("#viewHeadCountLbl").text(packageOb.headCount);
            $("#viewPackageValueLbl").text(packageOb.packageValue);
            $("#viewPaidValueLbl").text(packageOb.paidValue);

            $('#view-package').css({'right': '0'});
            document.body.style.overflow = 'hidden';
        }
    }

    handleGetPackage(packageId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "?packageId=" + packageId,
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        console.log(resp.data)
                        packageOb = resp.data;
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

    handleGetVehicle(vehicleId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getVehicleById?vehicleId=" + vehicleId,
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        vehicleOb = resp.data;
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

    handleGetHotel(hotelId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/getHotelById?hotelId=" + hotelId,
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        hotelOb = resp.data;
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

    handleShowNotification() {


        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/getPending",
                method: "GET",
                processData: false,
                contentType: false,
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleSetPaymentDetails(resp.data)
                        hotelOb = resp.data;
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob)
                    alert(ob.responseJSON.message);
                },
            });

            $('#showPayment').css({'height': '300px', 'width': '300px', 'padding': '10px'});
        }

    }

    handleSetPaymentDetails(data) {

        $('#paymentUl li').remove();

        data.map(value => {
            let li = "<li>\n" +
                "                    <p>" + value.packageId + "</p>\n" +
                "                    <p>Pending</p>\n" +
                "                    <i class=\"fa-solid fa-ellipsis-vertical\"></i>\n" +
                "                </li>";
            $('#paymentUl').append(li);
        });
    }

    handleHideNotification(event) {

        const x = document.getElementById('showPayment');
        if (x.offsetHeight === 300 && event.target.className === "editPackage") {
            $('#showPayment').css({'height': '0', 'width': '0', 'padding': '0'});
        }
    }

    handleAddSlipEvent(event) {

        packageId = $(event.target).closest('li').find('h3:nth-child(3)').text();

        $("#addSlip").css({'top': '0'});
    }

    handleHideSlipContainer(event) {

        if (event.target.className === "addSlip") {
            $("#addSlip").css({'top': '-100vh'});

            $("#slipFile").val("");
            $('#slipImg').attr('src', `assets/images/defaultimage.jpg`);
        }
    }

    handleAddImg() {

        const imgFile = $('#slipFile')[0].files[0];
        file = imgFile;
        if (imgFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $('#slipImg').attr('src', event.target.result);
            };
            reader.readAsDataURL(imgFile);
        }
    }

    handleUploadSlip() {

        if (!file) {
            swal("Please upload the payment slip !");
            return;
        }
        const user = JSON.parse(localStorage.getItem("USER"));

        $('#addSlip').click();
        if (user) {

            const token = user.token;
            const formData = new FormData();

            formData.append('slip', file);
            formData.append('packageId', packageId);

            $.ajax({
                url: defaultGateway + "/payment",
                method: "PUT",
                processData: false,
                contentType: false,
                async: true,
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        swal("Payment slip upload successful !", "Click the ok !", "success");
                        $('#viewCart').click();
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

    handleViewSlip(event) {

        packageId = $(event.target).closest('li').find('p:nth-child(1)').text();

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/getPendingOne?packageId=" + packageId,
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        this.handleShowSlip(resp.data);
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

    handleShowSlip(data) {

        $('#slipConfirmImg').attr('src', `data:image/png;base64,${data.paymentSlip}`);
        $('#confirm-Slip').css({'display': 'flex'});
    }

    handleHideSlip(event) {

        if (event.target.className === 'confirm-Slip') {
            $('#confirm-Slip').css({'display': 'none'});
        }
    }

    handlePaymentConfirm(packageId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        $('#confirm-Slip').click();
        if (user) {

            const token = user.token;

            $.ajax({
                url: defaultGateway + "/confirm?packageId=" + packageId,
                method: "PUT",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        swal("Payment confirm successful !", "Click the ok !", "success");
                        $('#bellIcon').click();
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

    handlePaymentReject(packageId) {

        const user = JSON.parse(localStorage.getItem("USER"));

        $('#confirm-Slip').click();
        if (user) {

            swal({
                title: "Are you sure?",
                text: "Do you want to reject this payment details !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {

                        const token = user.token;

                        $.ajax({
                            url: defaultGateway + "/reject?packageId=" + packageId,
                            method: "PUT",
                            async: true,
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            },
                            success: (resp) => {
                                if (resp.code === 200) {
                                    swal("Payment details has been rejected!", {
                                        icon: "success",
                                    });
                                    $('#bellIcon').click();
                                    console.log(resp.message);
                                }
                            },
                            error: (ob) => {
                                console.log(ob)
                                alert(ob.responseJSON.message);
                            },
                        });
                    } else {
                        $("#hotelView").click();
                        swal("Payment details is safe!");
                    }
                });
        }
    }

    handleGetNotification() {

        setInterval((() => {
            this.handleGetUpdate();
        }), 3000);
    }

    handleGetUpdate() {

        if ($('#editPackageContainer').is(':visible')) {

            const user = JSON.parse(localStorage.getItem("USER"));

            if (user) {

                const token = user.token;
                $.ajax({
                    url: defaultGateway + "/getPending",
                    method: "GET",
                    processData: false,
                    contentType: false,
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    success: (resp) => {
                        if (resp.code === 200) {
                            if (resp.data.length !== 0) {
                                $('#updateCount').text(resp.data.length);
                            } else {
                                $('#updateCount').text('0');
                            }
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
}

new PackageViewController();