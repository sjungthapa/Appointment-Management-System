import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Table } from 'antd';

function DoctorsList() {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();

    const getDoctorsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-doctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    const changeDoctorStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/admin/change-doctor-status', 
                { doctorId: record._id, status: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getDoctorsData();
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span>
                    {record.firstName} {record.lastName}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt'
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
                        <h4 className='anchor' onClick={() => changeDoctorStatus(record, 'approved')}>
                            Approve
                        </h4>
                    )}
                    {record.status === 'approved' && (
                        <h4 className='anchor' onClick={() => changeDoctorStatus(record, 'rejected')}>
                            Reject
                        </h4>
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <h1 className='page-title'>Doctors List</h1>
            <hr />
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    );
}

export default DoctorsList;
