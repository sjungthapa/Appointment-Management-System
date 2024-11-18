import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function Register() {
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'> Register </h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please enter your name!' }]}>
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please enter your email!' }]}>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Please enter your password!' }]}>
            <Input type='password' placeholder='Password' />
          </Form.Item>
          <Form.Item
            label='Confirm Password'
            name='confirmPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              validateConfirmPassword,
            ]}
          >
            <Input type='password' placeholder='Confirm Password' />
          </Form.Item>
          <Form.Item label='Profile Picture' name='profilePicture'>
            <Upload
              listType="picture"
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('You can only upload JPG/PNG file!');
                }
                return isJpgOrPng || Upload.LIST_IGNORE;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>

          <Button className='primary-button my-2' htmlType='submit'>Register</Button>

          <Link to='/login' className='anchor mt-2'>Already have an Account? Login</Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
