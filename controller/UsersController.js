export class UsersController{
    constructor() {
        $('#usersNavBtn').on('click', () => {
            this.handleNavContainer(".user-list", "#usersNavBtn");
        });
        $('#adminsNavBtn').on('click', () => {
            this.handleNavContainer(".admins-list", "#adminsNavBtn");
        });
        this.handleNavContainer(".user-list", "#usersNavBtn");
    }

    handleNavContainer(id, btn) {
        this.handleHideAllContainer();
        $(id).css({
            "display": "block"
        });
        this.handleSetNavBtnSelectedStyle(btn);
    }

    handleHideAllContainer() {
        $('.user-list').css({
            "display": "none"
        });
        $('.admins-list').css({
            "display": "none"
        });
    }

    handleSetNavBtnSelectedStyle(btn) {
        this.handleRestAllNavBtnStyles();
        $(btn).css({
            "color": "rgb(255, 0, 0)",
        });
    }

    handleRestAllNavBtnStyles() {
        $('.users .usersNav ul li').css({
            "color": "rgba(0, 0, 0, 0.6)",
        });
    }
}
new UsersController();