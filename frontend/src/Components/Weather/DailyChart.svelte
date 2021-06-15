<script>
    import Chart from "svelte-frappe-charts";
    import moment from "moment";
    export let weatherJSON;
    let hourly = weatherJSON.hourly;
    let dayNames = [];
    let highTemps = [];
    let lowTemps = [];
    let precip = [];
    let count = 0;
    // DAY NAMES
    hourly.data.forEach((hour) => {
        if (count % 2 && count < 28) {
            dayNames.push(moment.unix(hour.time).format("hh a"));
            highTemps.push(hour.temperature);
            precip.push(hour.precipProbability * 100);
        }
        count++;
    });
    let data = {
        labels: dayNames,
        colors: ["#fff", "#000"],
        datasets: [
            {
                values: highTemps,
                name: "High",
            },
            // {
            //     values: precip,
            //     name: "Precip Chance",
            // },
        ],
    };
    let colors = ["rgb(230,34,34)", "rgb(35,35,216)"];
    let tooltipOptions = {
        formatTooltipX: (d) => (d + "").toUpperCase(),
        // formatTooltipY: (d) => d + " pts",
    };
</script>

<Chart {data} type="line" {colors} {tooltipOptions} />
