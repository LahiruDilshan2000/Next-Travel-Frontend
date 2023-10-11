export class Vehicle{
    constructor(vehicleId,
                vehicleBrand,
                vehicleCategory,
                fuelAndTransmissionType,
                versionType,
                fuelUsage,
                seatCapacity,
                vehicleType,
                qty,
                imageLocation) {
        this.vehicleId = vehicleId;
        this.vehicleBrand = vehicleBrand;
        this.vehicleCategory = vehicleCategory;
        this.fuelAndTransmissionType = fuelAndTransmissionType;
        this.versionType = versionType;
        this.fuelUsage = fuelUsage;
        this.seatCapacity = seatCapacity;
        this.vehicleType = vehicleType;
        this.qty = qty;
        this.imageLocation = imageLocation;
    }
}