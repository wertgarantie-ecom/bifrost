FROM node:latest

RUN apt-get update && apt-get install -y git-crypt

WORKDIR /app/bifrost/
COPY package*.json /app/bifrost/
RUN npm install

COPY . /app/bifrost/

EXPOSE 3000

CMD NODE_ENV=local npm start