const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");

const theSchedule = "./records/theSchedule.json";
const theWeather = "./records/weather.json";
const theZones = "./records/zones.json";
const Gpio = require("onoff").Gpio;
var moment = require("moment-timezone");
const theDay = moment().format("ddd").toLowerCase();
const dayMinute = moment().format("HH:mm").toString();

const zonesArray = [0, 1, 2, 3, 4, 5, 6, 7, 23, 24, 25, 26, 27, 28];

let scheduleJSON = fs.readFileSync(theSchedule).toString();
let zonesJSON = fs.readFileSync(theZones).toString();
let weatherJSON = fs.readFileSync(theWeather).toString();
weatherJSON = JSON.parse(weatherJSON);
scheduleJSON = JSON.parse(scheduleJSON);
zonesJSON = JSON.parse(zonesJSON);
console.log("starting:", dayMinute);
for (day in scheduleJSON) {
    // console.log(scheduleJSON[day]);
    if (scheduleJSON[day].day == theDay && scheduleJSON[day].active) {
        console.log("matching date found with active status");
        if (scheduleJSON[day].startTime == dayMinute) {
            if (weatherJSON.daily.data[0].precipIntensity < 0.005) {
                console.log("running zones");
                runZones(scheduleJSON[day].zones);
            } else {
                console.log("not running due to weather", dayMinute);
            }
        }
    }
}
// if (scheduleJSON[theDay]) {
//     if (scheduleJSON.time == dayMinute) {
//         console.log("running zones");
//         runZones();
//     }
// }

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runZones(sentZones) {
    for await (const zone of scheduleJSON[day].zones) {
        // console.log(zone);
        await fetch(`http://localhost:3030/turnon/${zone.zone}`);
        await sleep(parseInt(zone.time) * 60000);
        await fetch(`http://localhost:3030/turnoff/${zone.zone}`);
    }
}
