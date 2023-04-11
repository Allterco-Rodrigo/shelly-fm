import pkg from 'node-nmap';
import { addShellyDevice } from './services/devices.services.js';
import { NMAP_IP_RANGE, NMAP_OPTIONS } from './config.js';

let { nmapLocation, NmapScan } = pkg; 
nmapLocation = "nmap"; //default

export const scanConnectedDevicesToDb = async () => {

  console.log("Scanning Network...")
  let scan = new NmapScan(NMAP_IP_RANGE, NMAP_OPTIONS);
  
  scan.on('complete',async function(data){
    console.log("Scan finished. Total scan time:" + scan.scanTime/1000 +"s");
    console.log("Writing data on Database...")    
    // data.forEach((device) => addShellyDevice(device));
    return await addShellyDevice(data)
  });

  scan.on('error', function(error){
    console.log(error);
  });

  scan.startScan();

}
