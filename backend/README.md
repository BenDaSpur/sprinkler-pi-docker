### Sprinkler Pi Backend Server

## Setup
- `npm install`
- you should be able to run commands like `gpio read 0` and get a response on your pi
- Add your dark sky api to the .env and your lat long

## Run
- `node app.js` to run backend express server
- every fifteen minutes the server will update the latest weather update
- *./records* will hold all data from calls