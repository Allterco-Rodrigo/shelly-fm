import React, { useEffect, useState } from "react";
import { getMqttStatus, getMqttSubscribe } from "../../services/mqtt.js";
import { getConnectedDevices } from "../../services/device.js";
import { Button, Card, Col, Layout, Row, Space, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

export default function MqttStatus() {
  const [mqttData, setMqttData] = useState([]);

  // subscribe to devices with MQTT server set
  function handleSubscribe () {
      getConnectedDevices()
      .then(devices => {
        let arrObj = []
        devices.map((dev) => {
          if(dev.mqttServer !== null){
            let sTopic = [], pTopic = [], pMsg = []
            const mqttClientPrefix = dev.mqttClientId.toString()
            const deviceName = mqttClientPrefix.split("-",1)[0]
            if(dev.gen === 1){
              
              const mqttCmdPrefix = "shellies/" + dev.mqttClientId.toString()
              sTopic.push(mqttCmdPrefix + "/announce")
              sTopic.push(mqttCmdPrefix + "/info")
              sTopic.push(mqttCmdPrefix + "/online")
              
              switch (deviceName) {
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
                  console.log("Error Case",deviceName);
              }

            } else {
              sTopic.push(mqttClientPrefix + "/events/rpc")
              pTopic.push(mqttClientPrefix + "/rpc")
              pMsg.push('{"id":1, "src":"'+ mqttClientPrefix +'-GetStatus", "method":"Shelly.GetStatus"}')
            }
            arrObj.push({
              "ip":dev.ip, 
              "deviceName":deviceName,
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
        // console.log(arr)
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
      const res = await getMqttStatus()
      setMqttData(res)
    }
    fetchMqttStatusData()
  },[]);

  const DataDisplay = ({ data }) => {
    // console.log(data)
    return (
      <Row gutter={[16, 16]}>
        {data.map(item =>
          (item.totalEnergy0 || item.a_act_power || item.power || item.current) && (
            (
            <Col span={32} key={item._id}>
              <Card
                key={item._id}
                title={<><p>Device Name:&emsp;{item.joinedCol[0].name}</p><p>IP:&emsp;{item.ip}</p></>}
                style={{ marginBottom: '16px' }}
              >

                { item.sysMac               ? <><p><strong>Mac Address            :</strong>&emsp;{item.sysMac}</p>                       </>: <></> }
                { item.totalEnergy0         ? <><p><strong>Total Energy           :</strong>&emsp;{item.totalEnergy0.toFixed(2)}</p>      </>: <></> }
                { item.totalPower0          ? <><p><strong>Total Power            :</strong>&emsp;{item.totalPower0.toFixed(2)}</p>       </>: <></> }
                { item.power0               ? <><p><strong>Power                  :</strong>&emsp;{item.power0.toFixed(2)}</p>            </>: <></> }
                { item.relay0               ? <><p><strong>Relay 0                :</strong>&emsp;{item.relay0}</p>                       </>: <></> }
                { item.relay1               ? <><p><strong>Relay 1                :</strong>&emsp;{item.relay1}</p>                       </>: <></> }
                { item.input0               ? <><p><strong>Input 0                :</strong>&emsp;{item.input0}</p>                       </>: <></> }
                { item.input1               ? <><p><strong>Input 1                :</strong>&emsp;{item.input1}</p>                       </>: <></> }
                { item.switch0              ? <><p><strong>Switch                 :</strong>&emsp;{item.switch0.toFixed(2)}</p>           </>: <></> }
                { item.aenergy0             ? <><p><strong>Active Energy Counter  :</strong>&emsp;{item.aenergy0.toFixed(2)}</p>          </>: <></> }
                { item.current0             ? <><p><strong>Current                :</strong>&emsp;{item.current0.toFixed(2)}</p>          </>: <></> }
                { item.temperatureC0        ? <><p><strong>Temperature C          :</strong>&emsp;{item.temperatureC0}</p>                </>: <></> }
                { item.overtemperature0     ? <><p><strong>Over Temperature       :</strong>&emsp;{item.overtemperature0}</p>             </>: <></> }
                { item.temperature_status0  ? <><p><strong>Temperature Status     :</strong>&emsp;{item.temperature_status0}</p>          </>: <></> }
                { item.voltage0             ? <><p><strong>Voltage                :</strong>&emsp;{item.voltage0.toFixed(2)}</p>          </>: <></> }
                { item.a_act_power          ? <><p><strong>Phase A Active Power   :</strong>&emsp;{item.a_act_power.toFixed(2)}</p>       </>: <></> }
                { item.a_aprt_power         ? <><p><strong>Phase A Apparent Power :</strong>&emsp;{item.a_aprt_power.toFixed(2)}</p>      </>: <></> }
                { item.a_current            ? <><p><strong>Phase A Current        :</strong>&emsp;{item.a_current.toFixed(2)}</p>         </>: <></> }
                { item.a_pf                 ? <><p><strong>Phase A Power Factor   :</strong>&emsp;{item.a_pf.toFixed(2)}</p>              </>: <></> }
                { item.a_voltage            ? <><p><strong>Phase A Voltage        :</strong>&emsp;{item.a_voltage.toFixed(2)}</p>         </>: <></> }
                { item.b_act_power          ? <><p><strong>Phase B Active Power   :</strong>&emsp;{item.b_act_power.toFixed(2)}</p>       </>: <></> }
                { item.b_aprt_power         ? <><p><strong>Phase B Apparent Power :</strong>&emsp;{item.b_aprt_power.toFixed(2)}</p>      </>: <></> }
                { item.b_current            ? <><p><strong>Phase B Current        :</strong>&emsp;{item.b_current.toFixed(2)}</p>         </>: <></> }
                { item.b_pf                 ? <><p><strong>Phase B Power Factor   :</strong>&emsp;{item.b_pf.toFixed(2)}</p>              </>: <></> }
                { item.b_voltage            ? <><p><strong>Phase B Voltage        :</strong>&emsp;{item.b_voltage.toFixed(2)}</p>         </>: <></> }
                { item.c_act_power          ? <><p><strong>Phase C Active Power   :</strong>&emsp;{item.c_act_power.toFixed(2)}</p>       </>: <></> }
                { item.c_aprt_power         ? <><p><strong>Phase C Apparent Power :</strong>&emsp;{item.c_aprt_power.toFixed(2)}</p>      </>: <></> }
                { item.c_current            ? <><p><strong>Phase C Current        :</strong>&emsp;{item.c_current.toFixed(2)}</p>         </>: <></> }
                { item.c_pf                 ? <><p><strong>Phase C Power Factor   :</strong>&emsp;{item.c_pf.toFixed(2)}</p>              </>: <></> }
                { item.c_voltage            ? <><p><strong>Phase C Voltage        :</strong>&emsp;{item.c_voltage.toFixed(2)}</p>         </>: <></> }
                { item.n_current            ? <><p><strong>Neutral Current        :</strong>&emsp;{item.n_current.toFixed(2)}</p>         </>: <></> }
                { item.total_act_power      ? <><p><strong>Total Active Power     :</strong>&emsp;{item.total_act_power.toFixed(2)}</p>   </>: <></> }
                { item.total_aprt_power     ? <><p><strong>Total Apparent Power   :</strong>&emsp;{item.total_aprt_power.toFixed(2)}</p>  </>: <></> }
                { item.total_current        ? <><p><strong>Total Current          :</strong>&emsp;{item.total_current.toFixed(2)}</p>     </>: <></> }

              </Card>
            </Col>
            )
          )
        )}
      </Row>
    );
  };

  // const intervalId = setInterval(() => {
  //   refreshData()
  // }, 30000);  

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <Layout>
        <Content style={{ margin: "16px 16px" }}>
          <Space direction="vertical">
            <Row align="top">
              <Col>
                <Space direction="horizontal" size={16} >
                  <Button type="primary" size="large" onClick={handleSubscribe} style={{ width: 200 }}>
                    Renew Subscription
                  </Button>
                  <Button type="primary" size="large" onClick={refreshData} style={{ width: 200 }}>
                    Refresh Data
                  </Button>
                </Space>
              </Col>
            </Row>
            <Row justify="center" align="top" style={{ background: 'white' }}>
              <Col>
                <Title level={3}>MQTT Data</Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <DataDisplay data={mqttData} />
              </Col>
            </Row>
          </Space>
      </Content>
    </Layout>
  );
}
