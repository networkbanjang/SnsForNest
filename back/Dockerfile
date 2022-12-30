FROM node
WORKDIR /usr/sec/app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 3065
CMD ["node","dist/main"]
