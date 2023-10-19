export class Package {
    constructor(
        packageId,
        packageCategory,
        userNic,
        vehicleId,
        hotelId,
        hotelName,
        travelArea,
        contact,
        email,
        packageValue,
        paidValue,
        startDate,
        endDate,
        bookedDate,
        roomDetailList,
        adultCount,
        childrenCount,
        headCount,
        withPetOrNo,
        guideId) {

        this.packageId = packageId;
        this.packageCategory = packageCategory;
        this.userNic = userNic;
        this.vehicleId = vehicleId;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.travelArea = travelArea;
        this.contact = contact;
        this.email = email;
        this.packageValue = packageValue;
        this.paidValue = paidValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bookedDate = bookedDate;
        this.roomDetailList = roomDetailList;
        this.adultCount = adultCount;
        this.childrenCount = childrenCount;
        this.headCount = headCount;
        this.withPetOrNo = withPetOrNo;
        this.guideId = guideId;
    }
}