// export const MONGO = "mongodb://mongo_local:27017"; // running with docker container 
export const MONGO = "mongodb://127.0.0.1:27017";   // running without docker

// define where the server running nodejs is
export const BE_IP = 'localhost'
export const PORT = 5050;

// define the network that will host the devices
// export const NMAP_IP_RANGE = "192.168.0-255.0-255"   // The correct range can be found by getting the gateway 

export const NMAP_IP_RANGE = "192.168.0-255.0-255"    // Office
// export const NMAP_IP_RANGE = "192.168.0-5.0-255"    // Home

//
export const NMAP_OPTIONS = '-n -sn -T5 --max-rtt-timeout 1s --min-parallelism 100'

// MQTT server
export const BROKER_IP = '192.168.15.226:2022'     // Office
// export const BROKER_IP = '192.168.0.139:1883'    // Home
