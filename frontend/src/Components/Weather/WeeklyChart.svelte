<script>
    import Chart from "svelte-frappe-charts";
    import moment from "moment";
    export let weatherJSON;
    let daily = weatherJSON.daily;
    let dayNames = [];
    let highTemps = [];
    let lowTemps = [];
    let precip = [];

    // DAY NAMES
    daily.data.forEach((day) => {
        dayNames.push(moment.unix(day.time).format("ddd"));
        highTemps.push(day.temperatureMax);
        lowTemps.push(day.temperatureMin);
    });
    let data = {
        labels: dayNames,
        colors: ["#fff", "#000"],
        datasets: [
            {
                values: highTemps,
                name: "High",
            },
            {
                values: lowTemps,
                name: "Low",
            },
        ],
    };
    let colors = ["rgb(230,34,34)", "rgb(35,35,216)"];
</script>

<Chart {data} type="line" {colors} />
