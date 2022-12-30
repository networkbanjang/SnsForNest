FROM node:16
WORKDIR /usr/sec/app
COPY package*.json ./

RUN npm install

COPY . .
