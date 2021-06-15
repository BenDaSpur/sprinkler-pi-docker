<script>
    import Chart from "svelte-frappe-charts";
    import moment from "moment";
    export let weatherJSON;
    let daily = weatherJSON.daily;
    let dayNames = [];
    let highTemps = [];
    let lowTemps = [];
    let precipChance = [];
    let precipIntensity = [];

    // DAY NAMES
    daily.data.forEach((day) => {
        dayNames.push(moment.unix(day.time).format("ddd"));
        precipChance.push(day.precipProbability * 100);
        precipIntensity.push(day.precipIntensity * 100);
    });
    let data = {
        labels: dayNames,
        title: "precip data",
        colors: ["#fff", "#000"],
        datasets: [
            {
                name: "Precip in inches",
                values: precipIntensity,
                chartType: "bar",
            },
            {
                name: "Precip Chance",
                values: precipChance,
                chartType: "line",
            },
        ],
    };
    let colors = ["rgb(230,34,34)", "rgb(35,35,216)"];
</script>

<Chart {data} type="axis-mixed" {colors} />
