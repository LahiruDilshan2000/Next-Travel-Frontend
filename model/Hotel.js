export class Hotel {
    constructor(hotelId,
                hotelName,
                hotelCategory,
                hotelLocation,
                locationUrl,
                hotelEmail,
                contactList,
                isPetAllow,
                fullDPrice,
                halfDPrice,
                fullTPrice,
                halfTPrice,
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
        this.fullDPrice = fullDPrice;
        this.halfDPrice = halfDPrice;
        this.fullTPrice = fullTPrice;
        this.halfTPrice = halfTPrice;
        this.cancellationCriteria = cancellationCriteria;
        this.hotelImageLocation = hotelImageLocation;
    }
}