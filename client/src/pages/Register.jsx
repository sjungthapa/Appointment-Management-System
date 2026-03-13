import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Steps } from 'antd';
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

const { Step } = Steps;

function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSendOTP = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/send-otp', {
        name: values.name,
        email: values.email
      });
      dispatch(hideLoading());
      
      if (response.data.success) {
        toast.success('OTP sent to your email!');
        setFormData(values);
        setOtpSent(true);
        setCurrentStep(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/register', {
        ...formData,
        otp: values.otp
      });
      dispatch(hideLoading());
      
      if (response.data.success) {
        toast.success(response.data.message);
        toast.success("Redirecting to login");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response?.data?.message || "Registration failed");
    }
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
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Register</h1>
        
        <Steps current={currentStep} style={{ marginBottom: '30px' }}>
          <Step title='Account Details' />
          <Step title='Verify Email' />
        </Steps>

        {currentStep === 0 && (
          <Form layout="vertical" onFinish={onSendOTP}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name!' }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' }
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                validateConfirmPassword,
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Button className="primary-button my-2 full-width-button" htmlType="submit">
              Send OTP
            </Button>

            <Link to="/login" className="anchor mt-2">
              Already have an Account? Login
            </Link>
          </Form>
        )}

        {currentStep === 1 && (
          <Form layout="vertical" onFinish={onFinish}>
            <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
              We've sent a 6-digit verification code to<br />
              <strong>{formData.email}</strong>
            </p>
            
            <Form.Item
              label="Enter OTP"
              name="otp"
              rules={[
                { required: true, message: 'Please enter the OTP!' },
                { len: 6, message: 'OTP must be 6 digits!' }
              ]}
            >
              <Input 
                placeholder="Enter 6-digit OTP" 
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
              />
            </Form.Item>

            <Button className="primary-button my-2 full-width-button" htmlType="submit">
              Verify & Register
            </Button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <span style={{ color: '#666' }}>Didn't receive the code? </span>
              <span 
                className="anchor" 
                onClick={() => {
                  setCurrentStep(0);
                  setOtpSent(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                Resend OTP
              </span>
            </div>

            <Link to="/login" className="anchor mt-2" style={{ display: 'block', textAlign: 'center' }}>
              Back to Login
            </Link>
          </Form>
        )}
      </div>
    </div>
  );
}

export default Register;
