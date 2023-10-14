export class Hotel {
    constructor(hotelId,
                hotelName,
                hotelCategory,
                hotelLocation,
                locationUrl,
                hotelEmail,
                contactList,
                isPetAllow,
                price,
                cancellationCriteria,
                hotelImageLocation) {
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.hotelCategory = hotelCategory;
        this.hotelLocation = hotelLocation;
        this.locationUrl = locationUrl;
        this.hotelEmail = hotelEmail;
        this.contactList = contactList;
        this.isPetAllow = isPetAllow;
        this.price = price;
        this.cancellationCriteria = cancellationCriteria;
        this.hotelImageLocation = hotelImageLocation;
    }
}