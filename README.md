# Sprinkler Pi Docker System

## Setup
- User must have a darksky api key. System is built on that but will have to change at the end of this year
    - Insert api key, and lat/long into `docker-compose.yml`
- install docker and docker-compose on raspberry pi
- inside this repo type `docker compose up --build` and docker will build each container
- once finished user should be able to go to port 5000 on pi and see dashboard running
- user will need to find/replace zone descriptions and zone numbers to align with their system