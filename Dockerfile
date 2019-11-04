FROM node:10

RUN apt-get update && apt-get install -y git-crypt

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 3000

ENV NODE_ENV=local
CMD npm start