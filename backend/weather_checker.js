const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");

const theSchedule = "./records/schedule.json";
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

if (weatherJSON.daily.data[0].precipIntensity > 0.005) {
    if (weatherJSON.daily.data[1].precipIntensity > 0.005) {
        console.log(weatherJSON.daily.data[1].precipIntensity);
    }
}

// precipIntensity
