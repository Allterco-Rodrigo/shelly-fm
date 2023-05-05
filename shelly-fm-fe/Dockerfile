FROM node:18.15-slim

WORKDIR /usr/src/app

RUN rm -rf /usr/src/app/node_modules

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
