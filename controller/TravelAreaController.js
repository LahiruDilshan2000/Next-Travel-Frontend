export class TravelAreaController {
    constructor() {

      $('#btn-Next').on('click', () => {
          this.handleImageSlide();
        });
    }
    handleImageSlide() {

        let items = document.querySelectorAll('.item');
        document.querySelector('.slider').appendChild(items[0]);
    }
}
new TravelAreaController();