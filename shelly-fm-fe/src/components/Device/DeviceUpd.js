import { Col, Layout, Row, Select, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedDevices, getDeviceById, updDeviceById } from "../../services/device";
import { Button, TextField } from "@mui/material";

const { Title } = Typography;
const { Content } = Layout;

export default function DeviceUpd() {  

  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  
  
  const [wifi, setWifi] = useState('');
  const [password, setPassword] = useState('');
  
  const [mqttServer, setMqttServer] = useState('');
  const [mqttPassword, setMqttPassword] = useState('');
  
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [deviceIp, setDeviceIp] = useState();
  const [deviceName, setDeviceName] = useState('');
  const [deviceGen, setDeviceGen] = useState('');
  
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getConnectedDevices();
      setDevices(devices);
    };
    fetchDevices();
  }, []);
  
  const handleChange = async (value) => {
    const data = await getDeviceById(value)
    setDeviceId(value)
    setDeviceIp(data.ip)
    setDeviceGen(data.gen)
    setDeviceName(data.name?data.name:"")
    setWifi(data.wifi?data.wifi:"")
    setMqttServer(data.mqttServer?data.mqttServer:"")
    setValue(value) 
    setShow(true)
  };

  async function handleUpdate(i) {
    let obj = {
      "deviceIp":deviceIp,
      "deviceGen":deviceGen,
      "deviceName":"",
      "wifi":"",
      "password":"",
      "mqttServer":"",
      "mqttPassword":""
    }

    if(i === 0)
      obj.deviceName = deviceName
    if(i === 1){
      obj.wifi = wifi
      obj.password = password
    }
    if (i === 2){
      obj.mqttServer = mqttServer
      obj.mqttPassword = mqttPassword
    }

    const x = await updDeviceById(deviceId,obj)
  }
  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
          <Title level={2}>Update Name / Devices Wi-Fi / MQTT</Title>

          <Select
            name="deviceList"
            placeholder="Select Device"
            value={value}
            onChange={handleChange}
            style={{ minWidth: "400px" }}
            >
            {!devices ? (
                <Select.Option value={0}>Loading Devices</Select.Option>
            ) : (
                devices.map((device) => (
                <Select.Option key={device?._id} value={device?._id}>
                    {device?.name + " - " + device?.ip}
                </Select.Option>
                ))
            )}
          </Select>
          { show 
          ?(<>
            <Row>
              <Col>
                <Typography variant="h8"  component="span">
                  Here you can change the name of a device
                </Typography>
              </Col>
            </Row><Row>
              <Space>
                <Col>
                  <TextField
                    label="Device Name"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    margin="normal"
                    variant="filled"
                    size="small"
                  />
                </Col>
                <Col>
                  <Button variant="contained" color="primary" onClick={()=>handleUpdate(0)}>
                    Update name
                  </Button>
                </Col>
              </Space>
            </Row><Row>
              <Col>
                <Typography variant="h8"  component="span">
                  Here you change the current credentials necessary to connect to a Wi-Fi router
                </Typography>
              </Col>
            </Row><Row>
              <Space>
              <Col>
                <TextField
                  label="WIFI"
                  value={wifi}
                  onChange={(e) => setWifi(e.target.value)}
                  margin="normal"
                  variant="filled"
                  size="small"
                />
              </Col><Col>
                <TextField
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="filled"
                  size="small"
                  type="password"
                />
              </Col>
              <Col>
                <Button variant="contained" color="primary" onClick={()=>handleUpdate(1)}>
                  Update Wi-Fi
                </Button>
              </Col>
              </Space>
            </Row><Row>
              <Col>
                <Typography variant="h8"  component="span">
                  Here you change the current credentials necessary to connect to a MQTT server
                </Typography>
              </Col>
            </Row><Row>
              <Space>
              <Col>
                <TextField
                  label="MQTT Server Address"
                  value={mqttServer}
                  onChange={(e) => setMqttServer(e.target.value)}
                  margin="normal"
                  variant="filled"
                  size="small"
                  />
              </Col><Col>
                <TextField
                  label="Password"
                  onChange={(e) => setMqttPassword(e.target.value)}
                  margin="normal"
                  variant="filled"
                  size="small"
                  type="password"
                />
              </Col>
              <Col>
                <Button variant="contained" color="primary" onClick={()=>handleUpdate(2)}>
                  Update MQTT
                </Button>
              </Col>              
              </Space>
            </Row>
            </>
          ):("")
          }
        </Space>
    </Content>
  </Layout>
);
}
