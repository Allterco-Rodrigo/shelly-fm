import { Col, Layout, Row, Select, Space, Typography, Table, Checkbox, Radio, Input } from "antd";
import React, { useEffect, useState } from "react";
import { addDeviceTriggers, getConnectedDevices, getDeviceById } from "../../services/device";
import { Button, Hidden, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

export default function DeviceTrigger() {  
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [deviceIp, setDeviceIp] = useState();

  const [selectedCheck, setSelectedCheck] = useState([]);

  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [selectedRadio, setSelectedRadio] = useState(null);

  const [mqttPrefix, setMqttPrefix] = useState();
  const [deviceLimit, setDeviceLimit] = useState();
  const [limitPower, setLimitPower] = useState();
  const [limitEnergy, setLimitEnergy] = useState();
  const [limitMinTemp, setLimitMinTemp] = useState();
  const [limitMaxTemp, setLimitMaxTemp] = useState();

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getConnectedDevices();
      setDevices(devices);
    };
    fetchDevices();
  }, []);
  
  const handleChange = async (value) => {
    const data = await getDeviceById(value)
    // console.log(data)
    setMqttPrefix(data.mqttPrefix)
    setDeviceId(data.id)
    setDeviceIp(data.ip)
    setValue(value) 
    setShow(true)    
  };

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedCheck([...selectedCheck, id]);
    } else {
      setSelectedCheck(selectedCheck.filter((boxId) => boxId !== id));
    }
  };

  const handleRadioChange = (e, id) => {
    setSelectedRadio(e.target.value);
  };
    
  async function handleEnableMessages() {
    
    // record notification media type
    
    let media = []
    for(let i=0; i < selectedCheck.length; i++){

      if(selectedCheck[i] === 1){
        // console.log(selectedCheck[i], media)
        media.push('email')
      }

      if(selectedCheck[i] === 2){
        // console.log(selectedCheck[i], media)
        media.push('sms')
      }

      if(selectedCheck[i] === 3){
        // console.log(selectedCheck[i], media)
        media.push('sound')
      }

    }

    // record the limit according to the device
    switch (mqttPrefix) {

// POWER METERING TRIGGER

      case 'shelly1':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shelly1pm':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shelly1l':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shellyplus1':
        setDeviceLimit({'power':limitPower})
        break;
        
      case 'shellyplus1pm':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shellyswitch':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shellyswitch25':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shelly4pro':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shellyplus2pm':
        setDeviceLimit({'power':limitPower})
        break;

      case 'shellyplugus':
        setDeviceLimit({'power':limitPower})
        break;
  
// SENSOR TRIGGER

      case 'shellyht':
        setDeviceLimit({'minTemp':limitMinTemp, 'maxTemp':limitMaxTemp})
        break;

      case 'shellysmoke':
        setDeviceLimit({'detection':true})
        break;

      case 'shellyflood':
        setDeviceLimit({'detection':true})
        break;

// ENERGY CONSUMPTION TRIGGER

      case 'shellyem':
        setDeviceLimit({'energy':limitEnergy})
        break;

      case 'shellyem3':
        setDeviceLimit({'energy':limitEnergy})
        break;

      case 'shellypro3em':
        setDeviceLimit({'energy':limitEnergy})
        break;

      default:
        break;
    }

    const obj = { 
      "id":deviceId, "ip":deviceIp, 
      "notificationMedia":media, "email": email, 
      "phone": phone, "interval":selectedRadio, 
      "limits":deviceLimit 
    }
    
    if(deviceIp && media && selectedRadio && deviceLimit && (email || phone)){
      addDeviceTriggers(obj)
      navigate("/loadingpage/t0")
    } else {
      alert(JSON.stringify(obj))
    }

  }
  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
          <Title level={2}>Assign Notifications</Title>

          <Select
            name="deviceList"
            placeholder="Select Device"
            value={value}
            onChange={handleChange}
            style={{ minWidth: "400px" }}
            >
            {!devices 
            ? (<Select.Option value={0}>Loading Devices</Select.Option>
            ):(
              devices.map((device) => (
                <Select.Option key={device?._id} value={device?._id}>
                    {device?.name + " - " + device?.ip}
                </Select.Option>
                ))
                )
              }
          </Select>
          { show 
            ?(<>
              <Row>
                <Col>
                  <Title level={4}>
                    Check which notifications the device should send when there is a change on the selected value
                  </Title>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col>
                  <Row>
                    <Title level={5}>
                      Check how to receive notifications
                    </Title>
                  </Row>
                  <Row gutter={24}>
                    <Col>             
                      <Row>
                        <Col>
                          <Checkbox
                            onChange={(e) => handleCheckboxChange(e, 1)}
                            checked={selectedCheck.includes(1)}
                            >
                            <Title level={5}>Email</Title>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Checkbox
                            onChange={(e) => handleCheckboxChange(e, 2)}
                            checked={selectedCheck.includes(2)}
                            >
                            <Title level={5}>SMS</Title>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Checkbox
                            onChange={(e) => handleCheckboxChange(e, 3)}
                            checked={selectedCheck.includes(3)}
                            >
                            <Title level={5}>Sound and Popup</Title>
                          </Checkbox>
                        </Col>
                      </Row>
                    </Col>
                    <Col>                 
                      <Row>
                        <TextField
                          label="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          margin="normal"
                          variant="filled"
                          size="small"
                          placeholder="support@shellyusa.com"
                          />
                      </Row>
                      <Row>
                        <TextField
                          label="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          margin="normal"
                          variant="filled"
                          size="small"  
                          placeholder="833-Shelly1"
                          />
                      </Row>
                    </Col>
                  </Row>                   
                </Col>                    
                <Col>
                  <Row>
                    <Title level={5}>
                      Set the interval and the trigger to send the notifications
                    </Title>
                  </Row>
                  <Row gutter={24}>
                    <Col>
                      <Row>
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={30}><Title level={5}>30 Seconds</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={60}><Title level={5}>60 Seconds</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row>                    
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={90}><Title level={5}>90 Seconds</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={300}><Title level={5}>5 minutes</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={600}><Title level={5}>10 minutes</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row>                    
                        <Col>
                          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={900}><Title level={5}>15 minutes</Title></Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <Row>
                      <TextField
                        label="Power"
                        value={limitPower}
                        onChange={(e) => setLimitPower(e.target.value)}
                        margin="normal"
                        variant="filled"
                        size="small"
                      />
                      </Row>
                      <Row>
                      <TextField
                        label="Energy"
                        value={limitEnergy}
                        onChange={(e) => setLimitEnergy(e.target.value)}
                        margin="normal"
                        variant="filled"
                        size="small"
                        />
                      </Row>
                      <Row>
                      <TextField
                        label="Min Temp (F)"
                        value={limitMinTemp}
                        onChange={(e) => setLimitMinTemp(e.target.value)}
                        margin="normal"
                        variant="filled"
                        size="small"
                        />
                      </Row>
                      <Row>
                      <TextField
                        label="Max Temp (F)"
                        value={limitMaxTemp}
                        onChange={(e) => setLimitMaxTemp(e.target.value)}
                        margin="normal"
                        variant="filled"
                        size="small"
                        />
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="contained" color="primary" onClick={handleEnableMessages}>
                    Enable Messages
                  </Button>
                </Col>
              </Row>
              </>
            ):("")
          }
        </Space>
    </Content>
  </Layout> 
);
}
  