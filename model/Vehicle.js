export class Vehicle{
    constructor(vehicleId,
                vehicleBrand,
                vehicleCategory,
                fuelAndTransmissionType,
                vehicleType,
                versionType,
                freeForDay,
                freeFor1Km,
                fuelUsage,
                seatCapacity,
                qty,
                driverName,
                driverContact,
                imageList) {
        this.vehicleId = vehicleId;
        this.vehicleBrand = vehicleBrand;
        this.vehicleCategory = vehicleCategory;
        this.fuelAndTransmissionType = fuelAndTransmissionType;
        this.vehicleType = vehicleType;
        this.versionType = versionType;
        this.freeForDay = freeForDay;
        this.freeFor1Km = freeFor1Km;
        this.fuelUsage = fuelUsage;
        this.seatCapacity = seatCapacity;
        this.qty = qty;
        this.driverName = driverName;
        this.driverContact = driverContact;
        this.imageList = imageList;
    }
}