import { Button, Form, Input, Layout, Select, Space, Typography} from "antd";
import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";


const { Title } = Typography;
const { Content } = Layout;

const onFinish = (values) => {
    // values is a json file 
    // {
    // complexName: 'town commons', 
    // complexAddress: 'Hypoluxo Rd', 
    // buildings: [{name: '8737', address: '8737 Via Mar Rosso'},{name: '8733', address: '8733 Via Mar Rosso'}]
    // }
    // console.log("Received values of form:", values);
    
    // Add complex information to the complex collection
    // Add building information to the building collection
    // Add device information to the complex collection / complex document being created 
    // When associating a device to the complex, it implies the device is in the complex but not in a building/floor/unit/room
    console.log("Received values of form:", values);
  };

export default function ComplexAdd() {  
  // let navigate = useNavigate();


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                style={{
                  maxWidth: '100%',
                }}
                {...formItemLayout}
                name="form1"
                layout="horizontal"
            >

                <Title level={2}>Add Complex</Title>                 
                <Form.Item
                    name="complexName"
                    label="Complex Name"
                    style={{
                        width: '50%',
                      }}
                    rules={[
                    {
                        required: true,
                        message: 'Please input the complex Name!',
                        whitespace: true,
                    },
                    ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                    name="complexAddress"
                    label="Complex Address"
                    style={{
                        width: '50%',
                      }}
                    rules={[
                    {
                        required: true,
                        message: 'Please input the complex Address!',
                        whitespace: true,
                    },
                    ]}
                >
                <Input />
                </Form.Item>

                <Form.List 
                    name="buildings">
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space size="small"
                            key={key}
                            style={{
                                display: "flex",
                                marginBottom: 8                                
                            }}
                            align="baseline"
                            >
                            Building: 
                            <Form.Item 
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                {
                                    required: true,
                                    message: "Missing Building name"
                                }
                                ]}
                            >
                                <Input placeholder="Building Name"
                                style={{
                                minWidth: 200,
                                }}/>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                name={[name, "address"]}
                                rules={[
                                {
                                    required: true,
                                    message: "Missing building address"
                                }
                                ]}
                            >
                                <Input placeholder="Building Address" 
                                style={{
                                minWidth: 250,
                                }}/>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            style={{maxWidth:'75%'}}
                            >
                            Add building
                            </Button>
                        </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.List 
                    name="devices">
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space size="small"
                            key={key}
                            style={{
                                display: "flex",
                                marginBottom: 8                                
                            }}
                            align="baseline"
                            >
                            Device: 
                            <Form.Item 
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                {
                                    required: true,
                                    message: "Select device from list"
                                }
                                ]}
                            >
                                <Select placeholder="Select device"
                                    style={{
                                      width: 360,
                                    }}
                                    onChange={console.log(1)}
                                    options={[
                                      {
                                        value: 'jack',
                                        label: 'Jack',
                                      },
                                      {
                                        value: 'lucy',
                                        label: 'Lucy',
                                      },
                                      {
                                        value: 'Yiminghe',
                                        label: 'yiminghe',
                                      },
                                      {
                                        value: 'disabled',
                                        label: 'Disabled',
                                        disabled: true,
                                      },
                                    ]}
                                />
                            </Form.Item>

                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            style={{maxWidth:'75%'}}
                            >
                            Add device
                            </Button>
                        </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                    Register
                    </Button>
                </Form.Item>                    
            </Form>          

        </Content>
    </Layout>
  );
}
