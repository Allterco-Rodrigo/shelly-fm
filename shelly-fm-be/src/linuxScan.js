// ------------------------------------- //
//                                       //
// THIS MUST RUN ON LINUX MACHINES ! ! ! //
//                                       //
// ------------------------------------- //

// REMEMBER TO EXECUTE ! ! !
//
// chmod +x search_ssid.sh


import fetch from 'node-fetch';
import wifi from 'node-wifi';
import { exec } from 'child_process'
import { delay } from './supportFunctions.js';

// Find broadcasting PLUG US that will be our Range Extender

let SSID_LIST = [];
let SHELLY_DEVICE = [];
let CONFIG_PASS, CONFIG_SSID, CONFIG_PREFIX, CONFIG_MQTT_SERVER, CONFIG_MQTT_PASS

wifi.init({
    iface: null // use the first available network interface
  });

// ----------------------------------------------------------------------------------- CHAT GPT \/


function execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
}

async function list_available_ssids_promise() {
    // console.log('Searching for Shelly Devices in the Network...');
    // try {
    //     const stdout = await execPromise('nmcli device wifi list');
    //     SSID_LIST = stdout.split('\n');

    // } catch (err) {
    //     console.error(`Error executing command: ${err.message}`);
    //     return;
    // }
    // }


    try {
        const networks = await wifi.scan();
        SSID_LIST = networks.map(network => network.ssid);
      } catch (error) {
        console.log(error);
      }
      

}

async function provision_device_recursive(index) {
    let cntErr = 0
    if (!SHELLY_DEVICE.length > 0) {
        console.log('\nNo Device Device Found.\n',SSID_LIST);
        return {"cnt": 0,"cntErr":cntErr};
    }

    if (index >= SHELLY_DEVICE.length) {
        console.log('\nProvisioning ended');
        return {"cnt": SHELLY_DEVICE.length - cntErr,"cntErr":cntErr};
    }

    await delay(20000);

    const x = await provision_device(index);
    if(x === -1)
        err_cnt++

    return provision_device_recursive(index + 1);
}

export async function provisionDevice(obj) {
    SHELLY_DEVICE = [];

    CONFIG_SSID = obj.ssid
    CONFIG_PASS = obj.pass
    CONFIG_PREFIX = obj.prefix
    CONFIG_MQTT_SERVER = obj.mqttServer
    CONFIG_MQTT_PASS = obj.mqttPassword
    await list_available_ssids_promise();


    SSID_LIST.forEach(element => {
        if(element.includes(CONFIG_PREFIX.toLowerCase())){
            console.log(element.trim().toLowerCase())
            SHELLY_DEVICE.push(element.trim().toLowerCase())
        }      
    })
    await delay(6000);

    const result = await provision_device_recursive(0);
    return result;
}
  
// ----------------------------------------------------------------------------------- CHAT GPT /\
  






// PROVISIONING FUNCTIONS

function connectToSSID (SSID) {
    try {
        exec(`nmcli dev wifi connect ${SSID}`,(err, stdout, stderr) => {
            if(err){
                console.error('Could not connect to device',SSID)
                return err.code
            }
        })
        console.log(`Connected to ${SSID}`)
        return 0        
    } catch (error) {
        console.log('Error Creating File',error)
        return -1
    }    
}


async function get_gen1_gen2 () {
    console.log("Getting Device's generation")
    let gen = {}
    try {
        const x = await fetch(`http://192.168.33.1/shelly`)
        x.gen
        ? gen = {"gen":2}
        : gen = {"gen":1}
        return gen
    } catch (e) {
        console.error(e)
    }
     // error
     console.log("Not a shelly device")
     return {"gen":-1}
}

export async function set_wifi_credentials (DEVICE_SSID, DEVICE_PASS, gen) {
    console.log("Sending wifi credentials to device")
    let command
    // set the command for different generations 
    if(gen === 1){
        command = `http://192.168.33.1/settings/sta?ssid=${DEVICE_SSID}&key=${DEVICE_PASS}&enabled=1`
    } else {
        command = `http://192.168.33.1/rpc/WiFi.SetConfig?config={"sta":{"ssid":"${DEVICE_SSID}","pass":"${DEVICE_PASS}","enable":true}}` 
    }
 
    try {

        console.log(command)
        const x = await fetch(command)
        
        CONFIG_MQTT_SERVER.length > 0
        ? set_mqtt_credentials(CONFIG_MQTT_SERVER,CONFIG_MQTT_PASS, gen)
        : console.log("NO MQTT server set")

    } catch (error) {
        console.error("ERROR \n\n",error)
    }

}

export async function set_mqtt_credentials (MQTT_SERVER, MQTT_PASS, gen) {
    console.log("Sending MQTT credentials to device")
    let command
    // set the command for different generations 
    if(gen === 1){
        command = `http://192.168.33.1/settings?mqtt_server=${MQTT_SERVER}&mqtt_pass=${MQTT_PASS}&mqtt_enable=true`
    } else {
        command = `http://192.168.33.1/rpc/MQTT.SetConfig?config={"server":"${MQTT_SERVER}","pass":"${MQTT_PASS}","enable":true}` 
    }
 
    try {
        console.log(command)
       const x = await fetch(command)
    } catch (error) {
        console.error("ERROR \n\n",error)
    }

}

async function provision_device (i) {
    console.log('\nProvisioning DEVICE',SHELLY_DEVICE[i])

    // connect to PREFIX_DEVICE
    const retCode = connectToSSID(SHELLY_DEVICE[i])
    if(retCode !== 0)
        return
    // provision device with desired internet wifi credentials

    // wait 6 seconds to connect
    await delay(6000);

    // check if device is Gen 1 or Gen 2
    const res = await get_gen1_gen2()
    
    // wait 5 seconds to receive after result is returned
    await delay(1000);

    if(!res.gen<1)
        // returns to the main function
        return await set_wifi_credentials(CONFIG_SSID,CONFIG_PASS,res.gen)

    // the device connected is not a shelly 
    return -1
}
