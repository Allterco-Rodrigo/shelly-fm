FROM node:18.15-slim

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci


RUN apt-get update && apt-get install -y nmap 
RUN apt-get install -y iw
RUN apt-get install -y iproute2


COPY . .

EXPOSE 5050

CMD [ "npm", "start"]
