import React from 'react';
import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'; // corrected import statement

function Login() {


  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'> Login </h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <Input type='password' placeholder='Password' />
          </Form.Item>

          <Button className='primary-button my-2' htmlType='submit'>Login</Button>

          <Link to='/Register' className='anchor mt-2'>Don't have an account? Register</Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
