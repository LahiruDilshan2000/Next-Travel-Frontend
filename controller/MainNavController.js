export class MainNavController{
    constructor() {
        $('#hotelNavBtn').on('click', () => {
            this.handleNavContainer("#hotelContainer");
        });
        $('#vehicleNavBtn').on('click', () => {
            this.handleNavContainer("#vehicleContainer");
        });
        $('#packageNavBtn').on('click', () => {
            this.handleNavContainer("#packageContainer");
        });
        this.handleNavContainer("#packageContainer");
        this.handleVehicleContainerClickEvent();
    }

    handleNavContainer(id) {
        this.handleHideAllContainer();
        $(id).css({
            "display": "block"
        });

    }
    handleHideAllContainer() {
        $('#vehicleContainer').css({
            "display": "none"
        });
        $('#hotelContainer').css({
            "display": "none"
        });
        $('#packageContainer').css({
            "display": "none"
        });
    }

    handleVehicleContainerClickEvent() {
        $('#vehicleUl').on('click', 'li', (event) => {
            console.log($(event.target).find('h3').text());
        });
    }
}
new MainNavController();