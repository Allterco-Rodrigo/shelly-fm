import React, { useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Button, Col, Layout, Row, Statistic, Table, Tag, Typography } from "antd";
import { getConnectedDevices } from "../../services/device.js";
import { CircularProgress } from "@mui/material";
const { Text } = Typography;
// import { useNavigate } from "react-router-dom";
const { Content } = Layout;

export default function Device() {
  const { loadTable, setLoadTable } = React.useContext(UserContext);
  const [ tableData, setTableData] = useState([]);
  const [ noDataMsg, setNoDataMsg] = useState(false);

  useEffect(() => {
    setLoadTable(false)
    getList()
    // eslint-disable-next-line
  },[])


  const getList = async () => {
    
    try {
      // this will only retrieve data that already exists in the database. Nothing will be update in the database
      getConnectedDevices()
        .then((data)=>{
          // console.log("Plotting table")
          setTableData(data)
        })
        .then(()=>{
          // console.log("Rendering table")
          setLoadTable(true)
          
        })
        .catch(()=>{
          console.log("No data found. Run 'Refresh Connected Devices first")
          setNoDataMsg(true)
        })

    } catch (error) {
      console.log("BE Disconnected")        
      console.log(error)
    }
  }

  // const handleUpdate = (key, updatedField) => {
  //   console.log("here",key, updatedField)
  //   setTableData(prevData =>
  //     prevData.map(item => {
  //       if (item.key === key) {
  //         return { ...item, ...updatedField };
  //       }
  //       return item;
  //     })
  //   );
  // };

  async function handleToggle (httpLink,index) {
    let dev =  ["Switch","2"]

    tableData.map((device)=> {
      if(device.deviceLink === httpLink){
        if(device.gen === 1) {
          device.deviceType === "Light"
          ? dev[0] = 'light'
          : dev[0] = 'relay'
          dev[1] = device.gen
        } else {
          dev[0] = device.deviceType
        }
        return dev
      }
      return -1
    })

    try {
      let command
      (dev[1]===1)
      ? command = httpLink + `/${dev[0]}/${index}?turn=toggle`
      : command = httpLink + `/rpc/${dev[0]}.Toggle?id=${index}`
      
      fetch(command)
        // .then(()=>{handleUpdate()})
      return
    } catch (error) {
      console.error("Fail to Toggle device", tableData.gen, tableData.deviceType)
    }

  }

// >>>>>>>>>>>>>>>> TABLE DEFINITION <<<<<<<<<<<<<<<<<<<

  const nestedColumns = [
      {
        title: 'Wi-Fi SSID',
        dataIndex: 'wifi',
        key: 'wifi',
        align: 'center',
        width: 100,
        render: (wifi) => {
          return (
            <>
              <Text  type="secondary">
                {wifi}
              </Text>
            </>
          );
        },
      },
      {
        title: 'Wi-Fi Status',
        dataIndex: 'wifiStatus',
        key: 'wifiStatus',
        align: 'center',
        render: (wifiStatus) => {
          let color = wifiStatus === 0 ? 'green' : 'red';
          let description = wifiStatus === 0 ? 'Connected' : 'Disconnected';
          return (
            <>
              <Tag color={color} key={description}>
                {description}
              </Tag>
            </>
          );
        },
      },
      {
        title: 'Switch 0',
        dataIndex: 'switch0',
        key: 'switch0',
        align: 'center',      
        render: (switch0) => {
          return(
            <>
            <Statistic
            title="W/h"
            value={switch0}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
          />
            </>
          )
        }
      },
      {
        title: 'Switch 1',
        dataIndex: 'switch1',
        key: 'switch1',
        align: 'center',      
        render: (switch1) => {
          return(
            <>
            <Statistic
            title="W/h"
            value={switch1}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
          />
            </>
          )
        }
      },
      {
        title: 'Switch 2',
        dataIndex: 'switch2',
        key: 'switch2',
        align: 'center',      
        render: (switch2) => {
          return(
            <>
            <Statistic
            title="W/h"
            value={switch2}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
          />
            </>
          )
        }
      },
      {
        title: 'Switch 3',
        dataIndex: 'switch3',
        key: 'switch3',
        align: 'center',      
        render: (switch3) => {
          return(
            <>
            <Statistic
            title="W/h"
            value={switch3}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
          />
            </>
          )
        }
      },
      {
        title: 'Firmware Version',
        dataIndex: 'firmwareVersion',
        key: 'firmwareVersion',
        align: 'center',
        render: (firmwareVersion) => {
          return (
            <>
              <Text  type="secondary">
                {firmwareVersion}
              </Text>
            </>
          );
        },
      },
      {
        title: 'Upgrade Status',
        dataIndex: 'newFWAvailable',
        key: 'newFWAvailable',
        align: 'center',
        render: (newFWAvailable) => {
          return (
            <>
              <Text  type="secondary">
                {newFWAvailable}
              </Text>
            </>
          );
        },
      },
      {
        title: 'MQTT',
        dataIndex: 'mqtt',
        key: 'mqtt',
        align: 'center',
        render: (mqtt) => {
          let color = mqtt === true ? 'green' : 'red';
          let description = mqtt === true ? 'Enabled' : 'Disabled';
          return (
            <>
              <Tag color={color} key={description}>
                {description}
              </Tag>
            </>
          );
        },
      },
      {
        title: 'MQTT Server',
        dataIndex: 'mqttServer',
        key: 'mqttServer',
        align: 'center',
        render: (mqttServer) => {
          return (
            <>
              <Text  type="secondary">
                {mqttServer}
              </Text>
            </>
          );
        },
      },
      {
        title: 'MQTT ID',
        dataIndex: 'mqttClient',
        key: 'mqttClient',
        align: 'center',
        render: (mqttClient) => {
          return (
            <>
              <Text  type="secondary">
                {mqttClient}
              </Text>
            </>
          );
        },
      },      
      // {
      //   title: 'MQTT',
      //   dataIndex: 'mqttServer',
      //   key: 'mqttServer',
      //   align: 'center',
      //   render: (mqttServer) => {
      //     return(
      //       <>
      //       <Button
      //           style={{
      //               width: 100,
      //           }}
      //           onClick={()=>handleMqtt(mqttServer)}
      //       > Pub&Sub
      //       </Button>
      //       </>
      //     )
      //   }
      // },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Status',
      key: 'deviceStatus',
      dataIndex: 'deviceStatus',
      align: 'center',
      width: 75,
      render: (deviceStatus) => {

        // console.log(tableData[0])

        let color = deviceStatus === 0 ? 'green' : 'red';
        let description = deviceStatus === 0 ? 'On' : 'Off';
        return (
          <>
            <Tag color={color} key={description}>
              {description}
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Actual Power',
      dataIndex: 'aenergy0',
      key: 'aenergy0',
      align: 'center',
      filters:[
        { 
          text: 'N/A', value: 0,
        },{
          text: 'Not N/A', value: 1,
        }
      ],
      onFilter: (value, record) => value === 0 ? record.aenergy0 === "N/A" : record.aenergy0 !== "N/A",
      sorter: (a,b) => a.aenergy0 - b.aenergy0,
      render: (aenergy0) => {
        return(
          <>
          <Statistic
          title="W/h"
          value={aenergy0}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
        />
          </>
        )
      }
    },
    {
      title: 'Voltage',
      dataIndex: 'voltage0',
      key: 'voltage0',
      align: 'center',
      width: 100,
      render: (voltage0) => {
        return(
          <>
          <Statistic
          title="Volts"
          value={voltage0}
          precision={0}
          valueStyle={{ color: '#3f8600' }}
        />
          </>
        )
      }
    },
    {
      title: 'Amperage',
      dataIndex: 'amp0',
      key: 'amp0',
      align: 'center',
      width: 100,
      render: (amp0) => {
        return(
          <>
          <Statistic
          title="AMP"
          value={amp0? amp0 : 0}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
        />
          </>
        )
      }
    },
    {
      title: 'Total Power',
      dataIndex: 'totalEnergy',
      key: 'totalEnergy',
      align: 'center',
      render: (totalEnergy) => {
        return(
          <>
          <Statistic
          title="kW/h"
          value={totalEnergy}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          // prefix={<ThunderboltOutlined />}
          // suffix="Wh"
        />
          </>
        )
      }
    },
    {
      title: 'Device Page',
      dataIndex: 'deviceLink',
      key: 'deviceLink',
      align: 'center',
      render: (text) => <a href={text} target="_blank" rel="noreferrer">Open Device's Home Page</a>,
    },      
    {
      title: 'Toggle Device',
      dataIndex: 'deviceLink',
      key: 'deviceLink',
      align: 'center',
      render: (deviceLink) => {
        return(          
          <>
          <Row>
            <Col>
          <Button
              style={{
                  width: 150,
              }}
              onClick={()=>handleToggle(deviceLink,0)}
          > On/Off Channel 0
          </Button>
          </Col><Col>
          <Button
              style={{
                  width: 150,
              }}
              onClick={()=>handleToggle(deviceLink,1)}
          > On/Off Channel 1
          </Button>
          </Col>
          </Row><Row>
            <Col>
          <Button
              style={{
                  width: 150,
              }}
              onClick={()=>handleToggle(deviceLink,2)}
          > On/Off Channel 2
          </Button>
          </Col><Col>
          <Button
              style={{
                  width: 150,
              }}
              onClick={()=>handleToggle(deviceLink,3)}
          > On/Off Channel 3
          </Button>
          </Col>
          </Row>
          </>
        )
      }
    },
  ];
 
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <>
          { (tableData !== [] && loadTable)
            ?  
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{pageSize: 300,}}
                // scroll={{y: 490,}}
                expandable={{
                  expandedRowRender: (record) => (
                    <Table 
                      columns={nestedColumns} 
                      dataSource={[{
                        key:record._id, 
                        wifi:record.wifi,
                        wifiStatus:record.wifiStatus, 

                        amp0:record.amp0,
                        amp1:record.amp1,
                        amp2:record.amp2,
                        amp3:record.amp3,

                        voltage0:record.voltage0,
                        voltage1:record.voltage1,
                        voltage2:record.voltage2,
                        voltage3:record.voltage3,

                        aenergy0:record.aenergy0,
                        aenergy1:record.aenergy1,
                        aenergy2:record.aenergy2,
                        aenergy3:record.aenergy3,

                        switch0:record.switch0,
                        switch1:record.switch1,
                        switch2:record.switch2,
                        switch3:record.switch3,

                        newFWAvailable:record.newFWAvailable, 
                        firmwareVersion:record.currentFWVersion,
                        mqtt:record.mqtt,
                        mqttServer:record.mqttServer,
                        mqttClient:record.mqttClientId,
                      }]}
                    />
                  ),
                  rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
              />
            : (!noDataMsg)
              ? <CircularProgress />
              : <Typography>
                  <h1>No data found</h1>
                </Typography>
          }
          </>
        </Content>
    </Layout>
  );
}