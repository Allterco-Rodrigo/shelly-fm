import { Col, Layout, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMqttStatus, getMqttSubscribe } from "../../services/mqtt.js";
import { getConnectedDevices } from "../../services/device.js";

const { Title } = Typography;
const { Content } = Layout;

export default function MqttStatus() {
  const [mqttStatus, setMqttStatus] = useState(false);

  // subscribe to devices with MQTT server set
  function handleSubscribe () {
      getConnectedDevices()
      .then(devices => {
        let arrObj = []
        const x = devices.map((dev) => {
          if(dev.mqttServer !== null){
            let sTopic = [], pTopic = [], pMsg = []
            const mqttClientPrefix = dev.mqttClientId.toString()

            if(dev.gen === 1){
              
              const mqttCmdPrefix = "shellies/" + dev.mqttClientId.toString()
              sTopic.push(mqttCmdPrefix + "/announce")
              sTopic.push(mqttCmdPrefix + "/info")
              sTopic.push(mqttCmdPrefix + "/online")
              
              switch (mqttClientPrefix.split("-",1)[0]) {
                // shelly1
                case 'shelly1':
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/relay/0/energy");
                  sTopic.push(mqttCmdPrefix + "/input/0");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_f");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_status");
                  sTopic.push(mqttCmdPrefix + "/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/0");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/1");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/2");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/0");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/1");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/2");
                  sTopic.push(mqttCmdPrefix + "/ext_humidity/0");
                  break;
                // shelly1pm
                case 'shelly1pm':
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/relay/0/energy");
                  sTopic.push(mqttCmdPrefix + "/input/0");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_f");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_status");
                  sTopic.push(mqttCmdPrefix + "/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/0");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/1");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature/2");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/0");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/1");
                  sTopic.push(mqttCmdPrefix + "/ext_temperature_f/2");
                  sTopic.push(mqttCmdPrefix + "/ext_humidity/0");
                  break;
                // shelly2
                case 'shellyswitch':
                  sTopic.push(mqttCmdPrefix + "/relay/power");
                  sTopic.push(mqttCmdPrefix + "/relay/energy");
                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  sTopic.push(mqttCmdPrefix + "/relay/1");
                  sTopic.push(mqttCmdPrefix + "/relay/0/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/relay/1/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/input/0");
                  sTopic.push(mqttCmdPrefix + "/roller/0");
                  sTopic.push(mqttCmdPrefix + "/roller/0/power");
                  sTopic.push(mqttCmdPrefix + "/roller/0/energy");
                  sTopic.push(mqttCmdPrefix + "/roller/0/pos");
                  break;
                // shelly2.5
                case 'shellyswitch25':
                  sTopic.push(mqttCmdPrefix + "/input/0");
                  sTopic.push(mqttCmdPrefix + "/input/1");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_status");
                  sTopic.push(mqttCmdPrefix + "/voltage");
                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  sTopic.push(mqttCmdPrefix + "/relay/1");
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/relay/1/power");
                  sTopic.push(mqttCmdPrefix + "/relay/0/energy");
                  sTopic.push(mqttCmdPrefix + "/relay/1/energy");
                  sTopic.push(mqttCmdPrefix + "/relay/0/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/relay/1/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/roller/0");
                  sTopic.push(mqttCmdPrefix + "/roller/0/power");
                  sTopic.push(mqttCmdPrefix + "/roller/0/energy");
                  sTopic.push(mqttCmdPrefix + "/roller/0/pos");
                  break;
                // shelly4Pro
                case 'shelly4pro':
                  sTopic.push(mqttCmdPrefix + "/input/0");
                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/input/1");
                  sTopic.push(mqttCmdPrefix + "/relay/1");
                  sTopic.push(mqttCmdPrefix + "/relay/1/power");
                  sTopic.push(mqttCmdPrefix + "/input/2");
                  sTopic.push(mqttCmdPrefix + "/relay/2");
                  sTopic.push(mqttCmdPrefix + "/relay/2/power");
                  sTopic.push(mqttCmdPrefix + "/input/3");
                  sTopic.push(mqttCmdPrefix + "/relay/3");
                  sTopic.push(mqttCmdPrefix + "/relay/3/power");
                  break;
                // shellyplug
                case 'shellyplug':
                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/relay/0/energy");
                  sTopic.push(mqttCmdPrefix + "/relay/0/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_f");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  break;
                // shellyplug-s
                case 'shellyplug-s':
                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  sTopic.push(mqttCmdPrefix + "/relay/0/power");
                  sTopic.push(mqttCmdPrefix + "/relay/0/energy");
                  sTopic.push(mqttCmdPrefix + "/relay/0/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_f");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  break;
                // shellyrgbw2
                case 'shellyrgbw2':
                  sTopic.push(mqttCmdPrefix + "/input/0/");
                  sTopic.push(mqttCmdPrefix + "/color/0/");
                  sTopic.push(mqttCmdPrefix + "/color/0/status");
                  break;
                // shellydimmer2
                case 'shellydimmer2':
                  sTopic.push(mqttCmdPrefix + "/input/0/");
                  sTopic.push(mqttCmdPrefix + "/color/0/");
                  sTopic.push(mqttCmdPrefix + "/color/0/status");
                  sTopic.push(mqttCmdPrefix + "/temperature");
                  sTopic.push(mqttCmdPrefix + "/temperature_f");
                  sTopic.push(mqttCmdPrefix + "/overtemperature");
                  sTopic.push(mqttCmdPrefix + "/overload");
                  sTopic.push(mqttCmdPrefix + "/loaderror");
                  sTopic.push(mqttCmdPrefix + "/light/0");
                  sTopic.push(mqttCmdPrefix + "/light/0/power");
                  sTopic.push(mqttCmdPrefix + "/light/0/energy");
                  sTopic.push(mqttCmdPrefix + "/light/0/overpower_value");
                  sTopic.push(mqttCmdPrefix + "/light/0/status");

                  break;
// SENSORS

                // flood
                case 'shellyflood':
                  sTopic.push(mqttCmdPrefix + "/sensor/flood");
                  sTopic.push(mqttCmdPrefix + "/sensor/battery");
                  sTopic.push(mqttCmdPrefix + "/sensor/temperature");
                  sTopic.push(mqttCmdPrefix + "/sensor/error");
                  sTopic.push(mqttCmdPrefix + "/sensor/act_reasons");
                  break;
                // Smoke
                case 'shellysmoke':
                  sTopic.push(mqttCmdPrefix + "/sensor/smoke");
                  sTopic.push(mqttCmdPrefix + "/sensor/battery");
                  sTopic.push(mqttCmdPrefix + "/sensor/temperature");
                  break;
                // H&T
                case 'shellyht':
                  sTopic.push(mqttCmdPrefix + "/sensor/humidity");
                  sTopic.push(mqttCmdPrefix + "/sensor/battery");
                  sTopic.push(mqttCmdPrefix + "/sensor/temperature");
                  sTopic.push(mqttCmdPrefix + "/sensor/error");
                  sTopic.push(mqttCmdPrefix + "/sensor/act_reasons");
                  sTopic.push(mqttCmdPrefix + "/sensor/ext_power");
                  break;
                // Gas
                case 'shellygas':
                  sTopic.push(mqttCmdPrefix + "/sensor/gas");
                  sTopic.push(mqttCmdPrefix + "/sensor/operation");
                  sTopic.push(mqttCmdPrefix + "/sensor/self_test");
                  sTopic.push(mqttCmdPrefix + "/sensor/concentration");
                  sTopic.push(mqttCmdPrefix + "/valve/0/state");
                  break;
                // EM
                case 'shellyem':
                  sTopic.push(mqttCmdPrefix + "/emeter/0/energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/returned_energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/total");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/total_returned");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/power");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/reactive_power");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/voltage");

                  sTopic.push(mqttCmdPrefix + "/emeter/1/energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/returned_energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/total");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/total_returned");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/power");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/reactive_power");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/voltage");

                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  break;
                // 3EM
                case 'shelly3em':
                  sTopic.push(mqttCmdPrefix + "/emeter/0/energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/returned_energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/total");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/total_returned");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/power");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/voltage");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/current");
                  sTopic.push(mqttCmdPrefix + "/emeter/0/pf");

                  sTopic.push(mqttCmdPrefix + "/emeter/1/energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/returned_energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/total");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/total_returned");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/power");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/voltage");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/current");
                  sTopic.push(mqttCmdPrefix + "/emeter/1/pf");

                  sTopic.push(mqttCmdPrefix + "/emeter/2/energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/returned_energy");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/total");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/total_returned");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/power");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/voltage");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/current");
                  sTopic.push(mqttCmdPrefix + "/emeter/2/pf");

                  sTopic.push(mqttCmdPrefix + "/relay/0");
                  break;
                default:
                  console.log("Error Case",mqttClientPrefix.split("-",1)[0]);
              }

            } else {
              sTopic.push(mqttClientPrefix + "/events/rpc")
              pTopic.push(mqttClientPrefix + "/rpc")
              pMsg.push('{"id":1, "src":"'+ mqttClientPrefix +'-GetStatus", "method":"Shelly.GetStatus"}')
            }
            arrObj.push({
              "ip":dev.ip, 
              "server":dev.mqttServer, 
              "subTopic":sTopic, 
              "pubTopic":pTopic, 
              "pubMsg":pMsg, 
            }) 
          }
          return dev
        })
        return arrObj
      })
      .then(arr => {
        getMqttSubscribe(arr)
      })
      .catch((err)=>{
        console.log("Error Subscribing to Topic",err)
      })
    };
// 
  // return data from database
  useEffect(() => {
    const fetchMqttStatusData = async () => {
      console.log("Returned Data")
      const res = await getMqttStatus()
      setMqttStatus(JSON.stringify(res))
    }
    fetchMqttStatusData()
  },[]);

  // const handleChange = async (value) => {
  //   const data = await getDeviceById(value)
  //   setDeviceId(value)
  //   setDeviceIp(data.ip)
  //   setDeviceGen(data.gen)
  //   setDeviceName(data.name?data.name:"")
  //   setWifi(data.wifi?data.wifi:"")
  //   setMqttServer(data.mqttServer?data.mqttServer:"")
  //   setValue(value) 
  //   setShow(true)
  // };

  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
            <Typography>{mqttStatus}</Typography>
            <Row>
              <Space>
                <Col>
                  <Button variant="contained" color="primary" onClick={handleSubscribe}>
                    Renew Subscription
                  </Button>
                </Col>              
              </Space>
            </Row>
          </Space>
      </Content>
    </Layout>
  );
}
