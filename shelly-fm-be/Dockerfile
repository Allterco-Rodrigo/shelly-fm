FROM node:18.15-slim

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

RUN apt-get update && apt-get install -y nmap

COPY . .

EXPOSE 5050

CMD [ "npm", "start"]
