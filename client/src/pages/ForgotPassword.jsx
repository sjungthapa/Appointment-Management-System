import React, { useState } from 'react';
import { Button, Form, Input, Steps } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';

const { Step } = Steps;

function ForgotPassword() {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSendOTP = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/send-reset-otp', { email: values.email });
            dispatch(hideLoading());
            
            if (response.data.success) {
                setEmail(values.email);
                setCurrentStep(1);
                toast.success('OTP sent to your email!');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error(error.response?.data?.message || 'Email not found');
        }
    };

    const onResetPassword = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/reset-password', {
                email: email,
                otp: values.otp,
                password: values.password
            });
            dispatch(hideLoading());
            
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className='authentication'>
            <div className='authentication-form card p-3'>
                <h1 className='card-title'>Reset Password</h1>
                
                <Steps current={currentStep} style={{ marginBottom: '30px' }}>
                    <Step title='Verify Email' />
                    <Step title='Reset Password' />
                </Steps>

                {currentStep === 0 && (
                    <Form layout='vertical' onFinish={onSendOTP}>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            Enter your email address to receive a verification code
                        </p>
                        <Form.Item 
                            label='Email' 
                            name='email'
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input placeholder='Email' />
                        </Form.Item>

                        <Button className='primary-button my-2 full-width-button' htmlType='submit'>
                            SEND OTP
                        </Button>

                        <Link to='/login' className='anchor mt-2'>
                            Back to Login
                        </Link>
                    </Form>
                )}

                {currentStep === 1 && (
                    <Form layout='vertical' onFinish={onResetPassword}>
                        <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
                            We've sent a verification code to<br />
                            <strong>{email}</strong>
                        </p>
                        
                        <Form.Item 
                            label='Enter OTP' 
                            name='otp'
                            rules={[
                                { required: true, message: 'Please enter the OTP' },
                                { len: 6, message: 'OTP must be 6 digits' }
                            ]}
                        >
                            <Input 
                                placeholder='Enter 6-digit OTP' 
                                maxLength={6}
                                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                            />
                        </Form.Item>

                        <Form.Item 
                            label='New Password' 
                            name='password'
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password placeholder='New Password' />
                        </Form.Item>

                        <Form.Item 
                            label='Confirm Password' 
                            name='confirmPassword'
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder='Confirm Password' />
                        </Form.Item>

                        <Button className='primary-button my-2 full-width-button' htmlType='submit'>
                            RESET PASSWORD
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <span style={{ color: '#666' }}>Didn't receive the code? </span>
                            <span 
                                className="anchor" 
                                onClick={() => setCurrentStep(0)}
                                style={{ cursor: 'pointer' }}
                            >
                                Resend OTP
                            </span>
                        </div>

                        <Link to='/login' className='anchor mt-2' style={{ display: 'block', textAlign: 'center' }}>
                            Back to Login
                        </Link>
                    </Form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
