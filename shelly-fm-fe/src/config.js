// define where the server running nodejs is
export const BE_IP = 'localhost'
export const PORT = 5050;

// define the network that will host the devices

// export const NMAP_IP_RANGE = "192.168.0-255.0-255"
export const NMAP_IP_RANGE = "192.168.0-15.0-255"

// export const NMAP_OPTIONS = '-sL --dns-server 192.168.0.1'
export const NMAP_OPTIONS = '-n -sn -T5 --max-rtt-timeout 1s --min-parallelism 100'

// MQTT server
export const BROKER_IP = '192.168.15.226:2022'     //LINUX MACHINE
// export const BROKER_IP = '192.168.0.179:2022'    //WINDOWS MACHINE