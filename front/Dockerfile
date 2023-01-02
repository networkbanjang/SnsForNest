FROM node
WORKDIR /usr/sec/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3060

CMD ["npm","run","dev"]
