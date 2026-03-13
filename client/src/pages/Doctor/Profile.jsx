import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Form, Input, Button, Row, Col, TimePicker } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function DoctorProfile() {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const timings = [
                moment(values.timings[0]).format('HH:mm'),
                moment(values.timings[1]).format('HH:mm')
            ];
            const response = await axios.post('/api/doctor/update-doctor-profile', 
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

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/doctor/get-doctor-info-by-user-id', 
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getDoctorData();
    }, []);

    return (
        <Layout>
            <h1 className='page-title'>Doctor Profile</h1>
            <hr />
            {doctor && (
                <Form layout='vertical' onFinish={onFinish} initialValues={{
                    ...doctor,
                    timings: [moment(doctor.timings[0], 'HH:mm'), moment(doctor.timings[1], 'HH:mm')]
                }}>
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
                            <Form.Item label='Website' name='website'>
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
                            <Form.Item required label='Timings' name='timings' rules={[{ required: true }]}>
                                <TimePicker.RangePicker format='HH:mm' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className='d-flex justify-content-end'>
                        <Button className='primary-button' htmlType='submit'>
                            UPDATE
                        </Button>
                    </div>
                </Form>
            )}
        </Layout>
    );
}

export default DoctorProfile;
