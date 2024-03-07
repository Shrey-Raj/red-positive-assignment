import React, { useState } from "react";
import { Button, Form, Input, Radio, Tag, Card,Space, Typography,message } from "antd";
import { CloseOutlined,MinusCircleOutlined, PlusOutlined , InfoCircleOutlined} from '@ant-design/icons';

import axios from 'axios'; 

const UserForm = () => {

    const onFinish = async (values) => {
        try {
            // console.log(values);

              const formData = {
              name: values.name,
              phoneNumber: values.phoneNumber,
              email: values.email,
              hobbies: values.hobbies.map((obj)=>(obj.hobby)),
            };

            console.log(formData) ; 
      
            axios.post('https://crud-users-node-js.onrender.com/users', formData)
            .then(response => {

              message.success('Form submitted successfully');
              form.resetFields();
            })
            .catch(error => {
              console.error('Error submitting form:', error);
              message.error('Error submitting form. Please try again.');
            });
      
          form.resetFields();
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };
      


  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>

      <Form.Item label="Name" required tooltip="This is a required field" name="name" >
        <Input placeholder="Enter your name" />
      </Form.Item>

      <Form.Item label="Phone Number" name="phoneNumber">
        <Input placeholder="Enter your phone number" />
      </Form.Item>

      <Form.Item label="Email" required name="email">
        <Input placeholder="Enter yout Email" />
      </Form.Item>


    {/* Hobbies */}
      <Form.Item label="Hobbies">

      <Form.List name="hobbies">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{
                display: 'flex',
                marginBottom: 8,
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, `hobby`]}
              >
                <Input placeholder="Add hobby" />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add another hobby
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
      </Form.Item>

      <Form.Item>
        <Button className="bg-blue-500 text-white" type="default" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};
export default UserForm;