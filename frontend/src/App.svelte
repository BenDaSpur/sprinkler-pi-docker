<script>
    import zones from "./zones";
    import { onMount, onDestroy } from "svelte";
    import WeeklyChart from "./Components/Weather/WeeklyChart.svelte";
    import PrecipitationChart from "./Components/Weather/PrecipitationChart.svelte";
    import DailyPrecipChart from "./Components/Weather/DailyPrecipChart.svelte";
    import moment from "moment";
    import {
        Row,
        Col,
        Container,
        NavbarBrand,
        Navbar,
        Button,
        NavItem,
        NavLink,
        NavbarToggler,
        Nav,
        Collapse,
        Table,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "sveltestrap";
    import Schedule from "./Components/Schedule.svelte";
    import ZonesConfig from "./Components/ZonesConfig.svelte";
    import DailyChart from "./Components/Weather/DailyChart.svelte";

    import { writable } from "svelte/store";
    const store = writable(localStorage.getItem("store") || "");

    store.subscribe((val) => localStorage.setItem("store", val));

    onMount(() => {
        setInterval(() => {
            if (updates.length > 0) {
                updates.forEach((zone) => {
                    const isActive = zone.value == 0 ? true : false;
                    if (zone.zone != 21 && zone.zone != 22 && zone.zone != 29) {
                        document
                            .querySelector(`[zone="${zone.zone}"]`)
                            .setAttribute("active", isActive);
                        if (isActive) {
                            document
                                .querySelector(`[zone="${zone.zone}"] button`)
                                .classList.add("bg-success");
                        } else {
                            document
                                .querySelector(`[zone="${zone.zone}"] button`)
                                .classList.remove("bg-success");
                        }
                    }
                });
            }
        }, 500);
    });

    let seconds = 0;
    let updates = [];

    let serverUrl = __myapp.env.SERVER_URL;

    async function getWeather() {
        const weather = await fetch(`${serverUrl}:6969/weather`);
        const weatherText = await weather.text();
        return JSON.parse(weatherText);
    }

    const interval = setInterval(async () => {
        const res = await fetch(`${serverUrl}:6969/gpio/all`);
        const theData = await res.text();
        updates = JSON.parse(theData);
    }, 500);

    onDestroy(async () => clearInterval(interval));

    async function toggleZone(theZone) {
        const isActive = document
            .querySelector(`[zone="${theZone}"]`)
            .getAttribute("active");
        const opposite = isActive == "true" ? 1 : 0;
        const res = await fetch(
            `${serverUrl}:6969/gpio/${theZone}/${opposite}`,
            {
                method: "POST",
                body: {},
            }
        );
        const json = await res;
        // console.log(json);
    }

    async function getHistory() {
        const history = await fetch(`${serverUrl}:6969/history/all`);
        const historyText = await history.text();
        return JSON.parse(historyText);
    }

    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    let open = false;
    let size;
    let showSchedule = true;

    const toggle = () => {
        size = undefined;
        open = !open;
    };

    const toggleLg = () => {
        size = "lg";
        open = !open;
        showSchedule = true;
    };

    const toggleZoneModal = () => {
        size = "lg";
        open = !open;
        showSchedule = false;
    };

    const passwordToggle = () => {
        var passwordInput = prompt("Enter password");
        $store = passwordInput;
    };

    async function updateSchedule() {
        let scheduleJson = {};
        var inputs = document.querySelectorAll(".schedule-days input");
        scheduleJson.time = document.querySelector("#time-picker").value;
        for (let i = 0; i < inputs.length; i++) {
            var doW = inputs[i].getAttribute("name");
            var dowValue = inputs[i].checked;

            scheduleJson[doW] = dowValue;
        }

        const theUpdate = await fetch(
            `${serverUrl}:6969/schedule/update`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(scheduleJson),
            }
        );
        toggle();
        return await theUpdate;
    }

    async function updateZones() {
        let scheduleJson = {};
        var inputs = document.querySelectorAll(".zone-row input");
        for (let i = 0; i < inputs.length; i++) {
            var doW = inputs[i].getAttribute("id");
            var dowValue = inputs[i].value;

            scheduleJson[doW] = dowValue;
        }

        const theUpdate = await fetch(`${serverUrl}:6969/zones/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleJson),
        });
        toggle();
        return await theUpdate;
    }

    async function getZones() {
        const theZones = await fetch(`${serverUrl}:6969/zones`);
        const theZonesText = await theZones.text();
        return JSON.parse(theZonesText);
    }

    async function getSchedule() {
        const theSchedule = await fetch(
            `${serverUrl}:6969/new-schedule`
        );
        const theScheduleText = await theSchedule.text();
        return JSON.parse(theScheduleText);
    }
</script>

<main>
    <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Sprinkler Dashboard</NavbarBrand>

        <NavbarToggler on:click={() => (isOpen = !isOpen)} />
        <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
            {#await getWeather() then theWeather}
                <NavItem>
                    <span class="navbar-summary"
                        >{theWeather.hourly.summary}</span
                    >
                    <span class="navbar-summary ms-1 text-danger">
                        {theWeather.daily.data[0].temperatureMax}
                    </span>
                    <span class="navbar-summary ms-1 text-primary">
                        {theWeather.daily.data[0].temperatureMin}
                    </span>
                </NavItem>

                <!-- promise was fulfilled -->
            {/await}
            <Nav class="ms-auto" navbar>
                <NavItem>
                    <NavLink on:click={passwordToggle}>Password</NavLink>
                </NavItem>
                {#if $store == "spurlock"}
                    <!-- <NavItem>
                        <NavLink href="#">Charts</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink on:click={toggleZoneModal}>Zones</NavLink>
                    </NavItem> -->
                    <NavItem>
                        <NavLink on:click={toggleLg}>Schedule</NavLink>
                    </NavItem>
                {/if}
            </Nav>
        </Collapse>
    </Navbar>
    {#if $store == "spurlock"}
        <!-- content here -->
        <Container fluid>
            <Modal isOpen={open} {toggle} {size}>
                <ModalHeader {toggle}
                    >{showSchedule ? "Schedule" : "Zones Runtime"}</ModalHeader
                >
                <ModalBody>
                    {#if showSchedule}
                        {#await getSchedule() then scheduleResponse}
                            {#await getZones() then theZones}
                                <Schedule {scheduleResponse} {theZones} />
                            {/await}
                        {/await}
                    {:else}
                        {#await getZones() then zonesResponse}
                            <!-- promise was fulfilled -->
                            <ZonesConfig {zonesResponse} />
                        {/await}
                    {/if}
                </ModalBody>
                <ModalFooter>
                    <!-- <Button
                        color="primary"
                        on:click={() =>
                            showSchedule ? updateSchedule() : updateZones()}
                        >Update</Button
                    > -->
                    <Button color="secondary" on:click={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Row
                ><Col class="text-center"
                    ><h4 class="display-5">Daily Weather</h4></Col
                ></Row
            >
            <Row>
                {#await getWeather() then weatherJSON}
                    <Col md={6}>
                        <DailyChart {weatherJSON} />
                    </Col>
                    <Col md={6}>
                        <DailyPrecipChart {weatherJSON} />
                    </Col>
                {/await}
            </Row>

            <Row
                ><Col class="text-center"
                    ><h4 class="display-5">Weekly Weather</h4></Col
                ></Row
            >

            <Row>
                {#await getWeather() then weatherJSON}
                    <Col md={6}>
                        <WeeklyChart {weatherJSON} />
                    </Col>
                    <Col md={6}>
                        <PrecipitationChart {weatherJSON} />
                    </Col>
                {/await}
            </Row>

            <Row>
                <Col md={6}>
                    <Row
                        ><Col class="text-center"
                            ><h4 class="display-5">Zones</h4></Col
                        ></Row
                    >
                    <Row
                        ><Col>
                            {#each zones as zone}
                                <!-- let key = getZoneUpdate(zone.id); -->

                                <!-- {#await getZoneUpdate(zone.id) then returnZone} -->
                                <Col class="zone-card" md={12} zone={zone.id}>
                                    <Button
                                        size="lg"
                                        on:click={() => {
                                            toggleZone(zone.id);
                                        }}
                                    >
                                        {#if zone.id.toString().length === 2}
                                            {zone.id}
                                        {:else}
                                            &nbsp;{zone.id}&nbsp;
                                        {/if}
                                    </Button>
                                    <span>{zone.desc}</span>
                                </Col>
                                <!-- {/await} -->
                            {/each}
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row
                        ><Col class="text-center"
                            ><h4 class="display-5">History</h4></Col
                        ></Row
                    >
                    <Row>
                        <Col class="history-table">
                            {#await getHistory() then history}
                                <!-- promise was fulfilled -->
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>zone</th>
                                            <th>value</th>
                                            <th>timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each [...history].reverse() as row}
                                            <tr>
                                                <th scope="row">{row.gpio}</th>
                                                <th
                                                    >{row.value == 0
                                                        ? "on"
                                                        : "off"}</th
                                                >
                                                <th
                                                    >{moment(
                                                        row.timestamp
                                                    ).format("LLL")}</th
                                                >
                                            </tr>
                                        {/each}
                                    </tbody>
                                </Table>
                            {/await}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    {/if}
</main>

<style>
    :global(.zone-card) {
        margin: 0.5rem 0;
    }
    :global(.zone-card[active="true"] button) {
        /* background: cyan; */
    }
    .navbar-summary {
        color: #ccc;
    }
    :global(.history-table) {
        max-height: 500px;
        overflow: auto;
    }
    :global(.display-5) {
        font-size: 2.5rem;
        font-weight: 300;
        line-height: 1.2;
        text-decoration: underline;
    }
</style>
