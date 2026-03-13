import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Table } from 'antd';

function UsersList() {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    const getUsersData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        getUsersData();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt'
        },
        {
            title: 'Role',
            dataIndex: 'role'
        }
    ];

    return (
        <Layout>
            <h1 className='page-title'>Users List</h1>
            <hr />
            <Table columns={columns} dataSource={users} />
        </Layout>
    );
}

export default UsersList;
