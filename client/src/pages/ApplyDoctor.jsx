import React from 'react';
import Layout from '../components/Layout';
import { Form, Input, Button, Row, Col, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from 'moment';

function ApplyDoctor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const timings = [
                moment(values.timings[0]).format('HH:mm'),
                moment(values.timings[1]).format('HH:mm')
            ];
            
            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await axios.post('/api/doctor/apply-doctor-account', 
                { ...values, userId: user._id, timings },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout>
            <h1 className='page-title'>Apply Doctor</h1>
            <hr />
            <Form layout='vertical' onFinish={onFinish}>
                <h4 className='card-title mt-3'>Personal Information</h4>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='First Name' name='firstName' rules={[{ required: true }]}>
                            <Input placeholder='First Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Last Name' name='lastName' rules={[{ required: true }]}>
                            <Input placeholder='Last Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Phone Number' name='phoneNumber' rules={[{ required: true }]}>
                            <Input placeholder='Phone Number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Website' name='website'>
                            <Input placeholder='Website' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Address' name='address' rules={[{ required: true }]}>
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>
                </Row>
                <hr />
                <h4 className='card-title mt-3'>Professional Information</h4>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Specialization' name='specialization' rules={[{ required: true }]}>
                            <Input placeholder='Specialization' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Experience' name='experience' rules={[{ required: true }]}>
                            <Input placeholder='Experience' type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label='Fee Per Consultation' name='feePerConsultation' rules={[{ required: true }]}>
                            <Input placeholder='Fee Per Consultation' type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item 
                            required 
                            label='Timings (Start - End)' 
                            name='timings' 
                            rules={[{ required: true, message: 'Please select timings' }]}
                        >
                            <TimePicker.RangePicker 
                                format='HH:mm'
                                placeholder={['Start Time', 'End Time']}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className='d-flex justify-content-end'>
                    <Button className='primary-button' htmlType='submit'>
                        SUBMIT
                    </Button>
                </div>
            </Form>
        </Layout>
    );
}

export default ApplyDoctor;
