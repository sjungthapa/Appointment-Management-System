import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Col, DatePicker, Row, TimePicker } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [isAvailable, setIsAvailable] = useState(false);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/doctor/get-doctor-info-by-id', 
                { doctorId: params.doctorId },
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
            toast.error('Something went wrong');
        }
    };

    const checkAvailability = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/appointment/check-booking-availability', 
                {
                    doctorId: params.doctorId,
                    date: date,
                    time: time
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setIsAvailable(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    const bookNow = async () => {
        setIsAvailable(false);
        try {
            dispatch(showLoading());
            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await axios.post('/api/appointment/book-appointment', 
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    userInfo: user,
                    date: date,
                    time: time
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/appointments');
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        getDoctorData();
    }, []);

    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className='page-title'>
                        {doctor.firstName} {doctor.lastName}
                    </h1>
                    <hr />
                    <Row gutter={20} className='mt-5' align='middle'>
                        <Col span={8} sm={24} xs={24} lg={8}>
                            <h4>
                                <b>Timings: </b>
                            </h4>
                            <p>
                                {doctor.timings[0]} - {doctor.timings[1]}
                            </p>

                            <h4>
                                <b>Phone Number: </b>
                            </h4>
                            <p>{doctor.phoneNumber}</p>

                            <h4>
                                <b>Address: </b>
                            </h4>
                            <p>{doctor.address}</p>

                            <h4>
                                <b>Fee per Visit: </b>
                            </h4>
                            <p>{doctor.feePerConsultation}</p>

                            <h4>
                                <b>Website: </b>
                            </h4>
                            <p>{doctor.website}</p>
                        </Col>
                        <Col span={8} sm={24} xs={24} lg={8}>
                            <DatePicker 
                                format='DD-MM-YYYY' 
                                onChange={(value) => {
                                    setDate(moment(value).format('DD-MM-YYYY'));
                                    setIsAvailable(false);
                                }}
                            />
                            <TimePicker 
                                format='HH:mm' 
                                className='mt-3'
                                onChange={(value) => {
                                    setTime(moment(value).format('HH:mm'));
                                    setIsAvailable(false);
                                }}
                            />
                            <Button 
                                className='primary-button mt-3 full-width-button' 
                                onClick={checkAvailability}
                            >
                                Check Availability
                            </Button>

                            {isAvailable && (
                                <Button 
                                    className='primary-button mt-3 full-width-button' 
                                    onClick={bookNow}
                                >
                                    Book Now
                                </Button>
                            )}
                        </Col>
                    </Row>
                </div>
            )}
        </Layout>
    );
}

export default BookAppointment;
