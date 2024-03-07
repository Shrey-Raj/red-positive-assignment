import React, { useState , useEffect, useMemo} from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message,Tag , Spin,Flex, Typography,Checkbox} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined ,MailOutlined } from '@ant-design/icons';
import axios from 'axios'; 

const UserTable = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data,setData] = useState([]) ; 
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(); 
  }, []); // Empty dependency array ensures the effect runs only once

  const fetchData = async ()=>{
    axios.get('https://crud-users-node-js.onrender.com/users')
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  // Memoize the dataSource using useMemo
  const memoizedDataSource = useMemo(() => {
    return data.map(user => ({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      hobbies: user.hobbies, // Join hobbies into a string for display
    }));
  }, [data]); // Re-run only when data changes

  
  const columns = [
    {
      title: 'Checkbox',
      key: 'checkbox',
      render: (text, record) => (
        <Checkbox
          onChange={() => handleCheckboxChange(record._id)}
          checked={selectedUsers.includes(record._id)}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => <span style={{ color: 'green' }}>{text}</span>,
    },
    {
      title: 'Hobbies',
      dataIndex: 'hobbies',
      key: 'hobbies',
      render: hobbies => (
        <>
          {hobbies.map(hobby => (
            <Tag color="geekblue" key={hobby}>{hobby}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="default"  icon={<EditOutlined className='text-green-500' />} className='text-green-600 border-green-300' onClick={() => handleUpdate(record)}>
            Update
          </Button>
          
          <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record._id)} 
          okType='default' okText="Yes"
          >
            <Button type="default" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const updateUserById = async (userId, updatedUserData) => {
    try {
      const response = await axios.put(`https://crud-users-node-js.onrender.com/users/${userId}`, updatedUserData);
      console.log('User updated successfully:'); 
      message.success('Item updated successfully');
      fetchData();
      return response.data; 
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Error updating user');
      throw error; 
    }
  };
  

  const handleUpdate = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async(userId) => {
    try {
      await axios.delete(`https://crud-users-node-js.onrender.com/users/${userId}`);
      fetchData();
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  const handleOk = async () => {
    form.validateFields()
      .then(async(values) => {
        const updatedUserData = {
          name: values.name,
          phoneNumber: values.phoneNumber,
          email: values.email,
          hobbies: values.hobbies, 
        };
  
        // console.log('Updated User DAta : ' , updatedUserData) ; 
        const userId = values._id;
        // console.log("userId" , userId); 
       await updateUserById(userId, updatedUserData) ; 

      })
      .catch(error => {
        console.error('Error updating item:', error);
        message.error('Error updating user');
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCheckboxChange = (userId) => {
    // Update selectedUsers array based on checkbox state
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };


  const handleSendEmail = async () => {
    try {
      setLoading(true);
      console.log(selectedUsers) ;

       axios.post('https://crud-users-node-js.onrender.com/sendemail', selectedUsers).then((response)=>{
        message.success(response.data.message);
      }).catch((error)=>{console.log(error); message.error('Error in Sending mail')});

    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Error sending email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <Flex className='justify-between items-center '>
      <Typography.Title level={3} className='mt-5 text-green-400'>
      Users Table</Typography.Title>

      <div>
        <Button type='default' className='text-cyan-400 bg-cyan-50 border-emerald-300' onClick={()=>{fetchData()}}>Refresh
        <ReloadOutlined /></Button>

        <Button
          type="default"
          icon={<MailOutlined />}
          onClick={handleSendEmail}
          disabled={selectedUsers.length === 0 || loading}
          className='text-orange-400 bg-orange-50 border-orange-300 ml-3'
        >
          Send Email
        </Button>
      </div>

    </Flex>

      <Table dataSource={memoizedDataSource} columns={columns}
      className='mt-4'
       />
      
      <Modal
        title="Update Item"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="default" className='text-green-500 border-green-400' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="User ID" name="_id">
            <Input disabled/>
          </Form.Item>

          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Hobbies" name="hobbies">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserTable;
