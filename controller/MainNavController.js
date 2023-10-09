export class MainNavController {
    constructor() {
        $('#hotelNavBtn').on('click', () => {
            this.handleNavContainer("#hotelContainer", "#hotelNavBtn");
        });
        $('#vehicleNavBtn').on('click', () => {
            this.handleNavContainer("#vehicleContainer", "#vehicleNavBtn");
        });
        $('#packageNavBtn').on('click', () => {
            this.handleNavContainer("#packageContainer", "#packageNavBtn");
        });
        $('#guideNavBtn').on('click', () => {
            this.handleNavContainer("#guidContainer", "#guideNavBtn");
        });
        $('#driverNavBtn').on('click', () => {
            this.handleNavContainer("#driverContainer", "#driverNavBtn");
        });
        $('#userNavBtn').on('click', () => {
            this.handleNavContainer("#usersContainer", "#userNavBtn");
        });
        $('#financialNavBtn').on('click', () => {
            this.handleNavContainer("#financialContainer", "#financialNavBtn");
        });
        this.handleNavContainer("#packageContainer", "#packageNavBtn");
        this.handleVehicleContainerClickEvent();
    }

    handleNavContainer(id, btn) {
        this.handleHideAllContainer();
        $(id).css({
            "display": "block"
        });
        this.handleSetNavBtnSelectedStyle(btn);

    }

    handleHideAllContainer() {
        const arr = ['#vehicleContainer',
            '#hotelContainer',
            '#packageContainer',
            '#guidContainer',
            '#guidContainer',
            '#driverContainer',
            '#usersContainer',
            '#financialContainer'];

        arr.map(id => {
            $(id).css({
                "display": "none"
            });
        });
    }

    handleVehicleContainerClickEvent() {
        $('#vehicleUl').on('click', 'li', (event) => {
            console.log($(event.target).find('h3').text());
        });
    }

    handleSetNavBtnSelectedStyle(id) {
        this.handleRestAllNavBtnStyles();
        $(id).css({
            "color": "rgb(255, 0, 0)",
            "borderBottom": "2px solid rgb(255, 0, 0)"
        });
    }

    handleRestAllNavBtnStyles() {
        $('.mainNav .mainNavBar ul li').css({
            "color": "rgba(0, 0, 0, 0.6)",
            "borderBottom": "none"
        });
    }
}

new MainNavController();