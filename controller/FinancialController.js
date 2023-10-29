
const defaultGateway = "http://localhost:8080/nexttravel/api/v1/financial";

export class FinancialController {
    constructor() {
        $('#financialNavBtn').on('click', () => {
            this.handleLoadAll();
        });
    }

    handleLoadAll(){
        this.handleGetDailyIncome();
        this.handleGetWeeklyIncome();
        this.handleGetMonthlyIncome();
        this.handleGetAnnualIncome();
        this.handleGetAnnualIncome();
        this.handleGetTodaySalesCont();
        this.handleBarChart();
    }

    handleGetDailyIncome() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/daily",
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        const tot = resp.data.toLocaleString(undefined, {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                        });
                        $('#dailyIncomeLbl').text(tot);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleGetWeeklyIncome() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/weekly",
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        const tot = resp.data.toLocaleString(undefined, {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                        });
                        $('#weeklyIncomeLbl').text(tot);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleGetMonthlyIncome() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/monthly",
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        const tot = resp.data.toLocaleString(undefined, {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                        });
                        $('#monthlyIncomeLbl').text(tot);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleGetAnnualIncome() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/annual",
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        const tot = resp.data.toLocaleString(undefined, {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                        });
                        $('#annualIncomeLbl').text(tot);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleBarChart() {

        const label = this.handleGetPastDayNames();
        const data = this.handleGetPastDaySales();

        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: label,
                datasets: [{
                    label: 'Past day summery',
                    data: data,
                    backgroundColor: [
                        'rgba(255,99,132,0.56)',
                         'rgba(54,162,235,0.6)',
                         'rgba(204,101,254,0.65)',
                         'rgba(255,206,86,0.61)',
                         'rgba(95,39,205,0.58)',
                         'rgba(1,163,164,0.58)',
                         'rgba(60,64,198,0.55)'
                    ],
                    borderWidth: 1
                },
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const ctx2 = document.getElementById('myChart2');

        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: 'Past day summery',
                    data: data,
                    backgroundColor: [
                        'rgb(255,99,132)',
                        'rgb(54,162,235)',
                        'rgba(204,101,254,0.65)',
                        'rgba(255,206,86,0.61)',
                        'rgba(95,39,205,0.58)',
                        'rgba(1,163,164,0.58)',
                        'rgba(60,64,198,0.55)'
                    ],
                    borderWidth: 1
                },
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    handleGetTodaySalesCont() {

        const user = JSON.parse(localStorage.getItem("USER"));

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/sales",
                method: "GET",
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        $('#saleContLbl').text(resp.data);
                        console.log(resp.message);
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
        }
    }

    handleGetPastDayNames() {

        const today = new Date();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const pastWeekDayNames = [];

        for (let i = 0; i < 7; i++) {
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);
            const dayOfWeek = pastDate.getDay();
            pastWeekDayNames.unshift(dayNames[dayOfWeek]);
        }

        return pastWeekDayNames;
    }

    handleGetPastDaySales() {

        const user = JSON.parse(localStorage.getItem("USER"));
        let array = [];

        if (user) {

            const token = user.token;
            $.ajax({
                url: defaultGateway + "/pastDayIncome",
                method: "GET",
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                success: (resp) => {
                    if (resp.code === 200) {
                        array = resp.data;
                    }
                },
                error: (ob) => {
                    console.log(ob);
                    alert(ob.responseJSON.message);
                },
            });
            return array;
        }
    }
}

new FinancialController();