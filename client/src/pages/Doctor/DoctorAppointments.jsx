import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Table } from 'antd';

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/doctor/change-appointment-status', 
                { appointmentId: record._id, status: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getAppointmentsData();
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        getAppointmentsData();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id'
        },
        {
            title: 'Patient',
            dataIndex: 'userInfo',
            render: (text, record) => <span>{record.userInfo.name}</span>
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => <span>{record.userInfo.email}</span>
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span>
                    {record.date} {record.time}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div className='d-flex'>
                            <h4 className='anchor px-2' onClick={() => changeAppointmentStatus(record, 'approved')}>
                                Approve
                            </h4>
                            <h4 className='anchor' onClick={() => changeAppointmentStatus(record, 'rejected')}>
                                Reject
                            </h4>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <h1 className='page-title'>Doctor Appointments</h1>
            <hr />
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    );
}

export default DoctorAppointments;
