FROM node:latest

RUN apt-get update && apt-get install -y git-crypt

RUN mkdir -p /app/bifrost
WORKDIR /app/bifrost/
COPY package*.json /app/bifrost/
RUN npm install

COPY . /app/bifrost/

EXPOSE 3000

CMD npm run start-docker-compose