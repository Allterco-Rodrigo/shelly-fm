FROM node:18.15-slim

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

RUN apt-get update 
RUN apt-get install -y nmap

# attempt to find ssids that are broadcasting using the wi-fi interface
# RUN apt-get install -y network-manager dbus iw wireless-tools
# RUN service dbus start
# RUN service network-manager start
# RUN systemctl start dbus
# RUN systemctl restart NetworkManager


COPY . .

EXPOSE 5050

CMD [ "npm", "start"]

