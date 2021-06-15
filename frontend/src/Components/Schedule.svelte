<script>
    import moment from "moment";
    import { onMount } from "svelte";
    import zones from "../zones";
    import {
        Row,
        Col,
        Form,
        FormGroup,
        Label,
        Input,
        Accordion,
        AccordionItem,
        Button,
        Spinner,
    } from "sveltestrap";

    import { writable } from "svelte/store";
    const schedule = writable(localStorage.getItem("schedule") || "");

    schedule.subscribe((val) => localStorage.setItem("schedule", val));

    let doW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    export let scheduleResponse;
    export let theZones;
    let spinner = false;
    let totalTime = 0;
    export let serverUrl;
    // let runsTo;

    for (const zoneObject in theZones) {
        totalTime += parseInt(theZones[zoneObject]);
    }

    onMount(async () => {
        console.log(scheduleResponse);
        // setInterval(() => {
        //     scheduleResponse.forEach((day) => {
        //         if (day.active == true) {
        //             if (document.querySelector(`[name=${day.day}]`) !== null) {
        //                 document.querySelector(
        //                     `[name=${day.day}]`
        //                 ).checked = true;
        //             }
        //         }
        //     });
        // }, 1000);
    });

    async function postSchedule(theDay) {
        spinner = true;
        console.log(theDay);
        let dayRow = `.row.day-${theDay}`;
        let dayActive = document.querySelector(`#switch-${theDay}`);
        var dayZoneInputs = document.querySelectorAll(
            dayRow + " input.zone-minutes"
        );
        let dayTime = document.querySelector(dayRow + " #time-picker");
        var dayZones = [];
        for (let i = 0; i < dayZoneInputs.length; i++) {
            var doW = dayZoneInputs[i].getAttribute("id");
            var dowValue = dayZoneInputs[i].value;
            var zoneDesc = dayZoneInputs[i].getAttribute("desc");
            var zoneId = dayZoneInputs[i].getAttribute("zone");
            dayZones[i] = { zone: zoneId, desc: zoneDesc, time: dowValue };
        }
        let finalDayUpdate = {
            day: theDay,
            active: dayActive.checked,
            startTime: dayTime.value,
            zones: dayZones,
        };

        const theUpdate = await fetch(
            `${serverUrl}:6969/new-schedule/update`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalDayUpdate),
            }
        );

        await theUpdate;
        spinner = false;
    }

    function updateTime(e) {
        let selector = document.querySelector(
            `[day=${e.originalTarget.attributes.day.value}]#time-picker`
        );
        console.log(selector);
        console.log(e);

        if (selector !== null) {
            const inputTime = selector.value;
            const runsTo = moment(inputTime, "H:mm")
                .add(totalTime, "minutes")
                .format("LTS");
            document.querySelector(
                `span[day=${e.originalTarget.attributes.day.value}]`
            ).textContent = runsTo;
        }
    }

    function getRunsTo(time, zones) {
        let dayTimes = 0;
        zones.forEach((zone) => {
            dayTimes += parseInt(theZones[zoneObject]);
        });
        return moment(time, "H:mm").add(dayTimes, "minutes").format("LTS");
    }

    let accordionDay = {
        id: null,
        open: false,
    };
</script>

<Label>Days to run</Label>
<Row>
    <Col md={12}>
        <Accordion stayOpen>
            {#each scheduleResponse as day}
                <AccordionItem
                    header={day.day}
                    on:toggle={(e) => {
                        accordionDay.id = day;
                        accordionDay.open = e.detail;
                        console.log(e);
                        console.log(accordionDay);
                    }}
                >
                    <Row class="day-{day.day}">
                        <Col md={2}>
                            <Input
                                class="schedule-days"
                                type="switch"
                                id={"switch-" + day.day}
                                name={day.day}
                                label={day.day}
                                checked={day.active}
                            />
                        </Col>
                        <!-- {#if scheduleResponse[`${day}`] == true} -->
                        <Col md={6}>
                            {#each day.zones as zone}
                                <Row>
                                    <Col md={8}>
                                        <Label
                                            for="exampleNumber"
                                            class="zone-id"
                                        >
                                            {zone.zone} -
                                            <span class="text-primary zone-desc"
                                                >{zone.desc}</span
                                            >
                                        </Label>
                                    </Col>
                                    <Col md={4}>
                                        <Input
                                            zone={zone.zone}
                                            desc={zone.desc}
                                            class="zone-minutes"
                                            type="number"
                                            name="number"
                                            id={"zone-" + zone.zone}
                                            value={zone.time}
                                        />
                                    </Col>
                                </Row>
                            {/each}
                            <!-- content here -->
                        </Col>
                        <!-- {/if} -->
                        <Col md={4}>
                            <FormGroup>
                                <Label for="time-picker">Time</Label>
                                <Input
                                    type="time"
                                    name="time"
                                    id="time-picker"
                                    {day}
                                    value={day.startTime}
                                    on:change={updateTime(
                                        day.startTime,
                                        day.zones
                                    )}
                                />
                            </FormGroup>
                            <Row>
                                <Col>
                                    {#if spinner}
                                        <Button
                                            ><Spinner color="primary" /></Button
                                        >
                                    {:else}
                                        <Button
                                            color="primary"
                                            day={day.day}
                                            on:click={postSchedule(day.day)}
                                            >Update</Button
                                        >
                                    {/if}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </AccordionItem>
            {/each}
        </Accordion>
    </Col>
</Row>
