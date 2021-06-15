const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");
app.use(cors(), express.json());

const historyFile = "./records/history.json";
const theWeather = "./records/weather.json";
const port = 3030;
const Gpio = require("onoff").Gpio;
const gpio0 = new Gpio(17, "out", { reconfigureDirection: false });
const gpio1 = new Gpio(18, "out", { reconfigureDirection: false });
const gpio2 = new Gpio(27, "out", { reconfigureDirection: false });
const gpio3 = new Gpio(22, "out", { reconfigureDirection: false });
const gpio4 = new Gpio(23, "out", { reconfigureDirection: false });
const gpio5 = new Gpio(24, "out", { reconfigureDirection: false });
const gpio6 = new Gpio(25, "out", { reconfigureDirection: false });
const gpio7 = new Gpio(4, "out", { reconfigureDirection: false });
const gpio21 = new Gpio(5, "out", { reconfigureDirection: false });
const gpio22 = new Gpio(6, "out", { reconfigureDirection: false });
const gpio23 = new Gpio(13, "out", { reconfigureDirection: false });
const gpio24 = new Gpio(19, "out", { reconfigureDirection: false });
const gpio25 = new Gpio(26, "out", { reconfigureDirection: false });
const gpio26 = new Gpio(12, "out", { reconfigureDirection: false });
const gpio27 = new Gpio(16, "out", { reconfigureDirection: false });
const gpio28 = new Gpio(20, "out", { reconfigureDirection: false });
const gpio29 = new Gpio(21, "out", { reconfigureDirection: false });

const pins = [
    gpio0,
    gpio1,
    gpio2,
    gpio3,
    gpio4,
    gpio5,
    gpio6,
    gpio7,
    gpio21,
    gpio22,
    gpio23,
    gpio24,
    gpio25,
    gpio26,
    gpio27,
    gpio28,
    gpio29,
];

const zones = [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23, 24, 25, 26, 27, 28, 29];

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/schedule/update", (req, res) => {
    console.log("updating schedule");
    console.log(req.body);
    fs.writeFileSync("./records/schedule.json", JSON.stringify(req.body));
    res.send("ok");
    res.status(200);
});

app.post("/new-schedule/update", (req, res) => {
    console.log("updating schedule");
    console.log(req.body);
    let oldSchedule = fs.readFileSync("./records/theSchedule.json");
    oldSchedule = JSON.parse(oldSchedule);
    let newSchedule = req.body;
    oldSchedule.forEach((day) => {
        if (day.day == newSchedule.day) {
            day.active = newSchedule.active;
            day.startTime = newSchedule.startTime;
            day.zones = newSchedule.zones;
        }
    });
    fs.writeFileSync("./records/theSchedule.json", JSON.stringify(oldSchedule));
    res.send("ok");
    res.status(200);
});

app.get("/new-schedule", (req, res) => {
    const schedule = fs.readFileSync("./records/theSchedule.json");
    res.send(JSON.parse(schedule));
    res.status(200);
});

app.get("/schedule", (req, res) => {
    const schedule = fs.readFileSync("./records/schedule.json");
    res.send(JSON.parse(schedule));
    res.status(200);
});

app.get("/zones", (req, res) => {
    const zones = fs.readFileSync("./records/zones.json");
    res.send(JSON.parse(zones));
    res.status(200);
});

app.post("/zones/update", (req, res) => {
    console.log("updating zones");
    console.log(req.body);
    fs.writeFileSync("./records/zones.json", JSON.stringify(req.body));
    res.send("ok");
    res.status(200);
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

app.get("/history/all", (req, res) => {
    console.log("getting all history");
    let theHistory = JSON.parse(fs.readFileSync(historyFile));
    res.send(theHistory);
    res.status(200);
});

app.get("/history/:gpioId/history", (req, res) => {
    let zone = parseInt(req.params.gpioId);
    let theHistory = JSON.parse(fs.readFileSync(historyFile));
    let zoneHistory = [];
    for (row in theHistory) {
        if (theHistory[row].gpio == zone) {
            zoneHistory.push(theHistory[row]);
        }
    }
    res.send(zoneHistory);
    res.status(200);
});

app.get("/gpio/all", (req, res) => {
    let allArray = [];

    for (let index = 0; index < pins.length; index++) {
        allArray.push({ zone: zones[index], value: pins[index].readSync() });
    }

    res.send(allArray);

    res.status(200);
});

app.get("/turnon/:theId", (req, res) => {
    const theZone = parseInt(req.params.theId);

    triggerGpio(pins[zones.indexOf(theZone)], theZone, 0);

    res.status(200);
    res.send("ok");
});

app.get("/turnoff/:theId", (req, res) => {
    const theZone = parseInt(req.params.theId);

    triggerGpio(pins[zones.indexOf(theZone)], theZone, 1);

    res.status(200);
    res.send("ok");
});

app.get("/gpio/:gpioId", (req, res) => {
    // res.send({ gpio: parseInt(req.params.gpioId), value: gpio0.value });
    switch (parseInt(req.params.gpioId)) {
        case 0:
            res.status(200);
            res.send({ zone: 0, value: gpio0.readSync() });
            break;
        case 1:
            res.status(200);
            res.send({ zone: 1, value: gpio1.readSync() });
            break;
        case 2:
            res.status(200);
            res.send({ zone: 2, value: gpio2.readSync() });
            break;
        case 3:
            res.status(200);
            res.send({ zone: 3, value: gpio3.readSync() });
            break;
        case 4:
            res.status(200);
            res.send({ zone: 4, value: gpio4.readSync() });
            break;
        case 5:
            res.status(200);
            res.send({ zone: 5, value: gpio5.readSync() });
            break;
        case 6:
            res.status(200);
            res.send({ zone: 6, value: gpio6.readSync() });
            break;
        case 7:
            res.status(200);
            res.send({ zone: 7, value: gpio7.readSync() });
            break;
        case 21:
            res.status(200);
            res.send({ zone: 21, value: gpio21.readSync() });
            break;
        case 22:
            res.status(200);
            res.send({ zone: 22, value: gpio22.readSync() });
            break;
        case 23:
            res.status(200);
            res.send({ zone: 23, value: gpio23.readSync() });
            break;
        case 24:
            res.status(200);
            res.send({ zone: 24, value: gpio24.readSync() });
            break;
        case 25:
            res.status(200);
            res.send({ zone: 25, value: gpio25.readSync() });
            break;
        case 26:
            res.status(200);
            res.send({ zone: 26, value: gpio26.readSync() });
            break;
        case 27:
            res.status(200);
            res.send({ zone: 27, value: gpio27.readSync() });
            break;
        case 28:
            res.status(200);
            res.send({ zone: 28, value: gpio28.readSync() });
            break;
        case 29:
            res.status(200);
            res.send({ zone: 29, value: gpio29.readSync() });
            break;
        default:
            res.status(500);
            res.send("unknown endpoint");
            break;
    }
});

app.post("/gpio/:gpioId/:state", (req, res) => {
    console.log("received endpoint", req.params.gpioId);
    console.log("state", req.params.state);
    let turnOn = req.params.state == "0" ? true : false;
    console.log(req.params.gpioId, turnOn);
    switch (parseInt(req.params.gpioId)) {
        case 0:
            turnOn ? triggerGpio(gpio0, 0, 0) : triggerGpio(gpio0, 0, 1);
            res.status(200);
            res.send({ value: gpio0.readSync() });
            break;
        case 1:
            turnOn ? triggerGpio(gpio1, 1, 0) : triggerGpio(gpio1, 1, 1);
            res.status(200);
            res.send({ value: gpio1.readSync() });
            break;
        case 2:
            turnOn ? triggerGpio(gpio2, 2, 0) : triggerGpio(gpio2, 2, 1);
            res.status(200);
            res.send({ value: gpio2.readSync() });
            break;
        case 3:
            turnOn ? triggerGpio(gpio3, 3, 0) : triggerGpio(gpio3, 3, 1);
            res.status(200);
            res.send({ value: gpio3.readSync() });
            break;
        case 4:
            turnOn ? triggerGpio(gpio4, 4, 0) : triggerGpio(gpio4, 4, 1);
            res.status(200);
            res.send({ value: gpio4.readSync() });
            break;
        case 5:
            turnOn ? triggerGpio(gpio5, 5, 0) : triggerGpio(gpio5, 5, 1);
            res.status(200);
            res.send({ value: gpio5.readSync() });
            break;
        case 6:
            turnOn ? triggerGpio(gpio6, 6, 0) : triggerGpio(gpio6, 6, 1);
            res.status(200);
            res.send({ value: gpio6.readSync() });
            break;
        case 7:
            turnOn ? triggerGpio(gpio7, 7, 0) : triggerGpio(gpio7, 7, 1);
            res.status(200);
            res.send({ value: gpio7.readSync() });
            break;
        case 21:
            turnOn ? triggerGpio(gpio21, 21, 0) : triggerGpio(gpio21, 21, 1);
            res.status(200);
            res.send({ value: gpio21.readSync() });
            break;
        case 22:
            turnOn ? triggerGpio(gpio22, 22, 0) : triggerGpio(gpio22, 22, 1);
            res.status(200);
            res.send({ value: gpio22.readSync() });
            break;
        case 23:
            turnOn ? triggerGpio(gpio23, 23, 0) : triggerGpio(gpio23, 23, 1);
            res.status(200);
            res.send({ value: gpio23.readSync() });
            break;
        case 24:
            turnOn ? triggerGpio(gpio24, 24, 0) : triggerGpio(gpio24, 24, 1);
            res.status(200);
            res.send({ value: gpio24.readSync() });
            break;
        case 25:
            turnOn ? triggerGpio(gpio25, 25, 0) : triggerGpio(gpio25, 25, 1);
            res.status(200);
            res.send({ value: gpio25.readSync() });
            break;
        case 26:
            turnOn ? triggerGpio(gpio26, 26, 0) : triggerGpio(gpio26, 26, 1);
            res.status(200);
            res.send({ value: gpio26.readSync() });
            break;
        case 27:
            turnOn ? triggerGpio(gpio27, 27, 0) : triggerGpio(gpio27, 27, 1);
            res.status(200);
            res.send({ value: gpio27.readSync() });
            break;
        case 28:
            turnOn ? triggerGpio(gpio28, 28, 0) : triggerGpio(gpio28, 28, 1);
            res.status(200);
            res.send({ value: gpio28.readSync() });
            break;
        case 29:
            turnOn ? triggerGpio(gpio29, 29, 0) : triggerGpio(gpio29, 29, 1);
            res.status(200);
            res.send({ value: gpio29.readSync() });
            break;

        default:
            res.status(500);
            res.send("not found");
            break;
    }
});

app.get("/weather", (req, res) => {
    res.status(200);
    res.send(fs.readFileSync(theWeather));
});

function triggerGpio(theGpio, gpioInt, theValue) {
    theGpio.writeSync(theValue);
    updateRecord({ gpio: gpioInt, value: theValue, timestamp: Date.now() });
}

function updateRecord(newObject) {
    let oldData = JSON.parse(fs.readFileSync(historyFile));
    oldData.push(newObject);
    fs.writeFileSync(historyFile, JSON.stringify(oldData), (err) =>
        console.log(err)
    );
}

setInterval(async () => {
    console.log("getting latest dark sky");
    const res = await fetch(
        `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${process.env.LAT_LONG_CORDS}`
    );
    const fileStream = fs.createWriteStream("./records/weather.json");
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
}, 900000);
