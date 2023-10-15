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
            this.handleNavContainer("#guideContainer", "#guideNavBtn");
        });
        $('#userNavBtn').on('click', () => {
            this.handleNavContainer("#usersContainer", "#userNavBtn");
        });
        $('#financialNavBtn').on('click', () => {
            this.handleNavContainer("#financialContainer", "#financialNavBtn");
        });
        this.handleNavContainer("#packageContainer", "#packageNavBtn");
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
            '#guideContainer',
            '#usersContainer',
            '#financialContainer'];

        arr.map(id => {
            $(id).css({
                "display": "none"
            });
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