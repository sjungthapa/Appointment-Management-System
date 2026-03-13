import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Input, Button, Row, Col, Upload, message } from 'antd';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

function Profile() {
    const { user } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState(user?.profilePicture || '');
    const dispatch = useDispatch();

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            // Get base64 of the image
            getBase64(info.file.originFileObj, (url) => {
                setImageUrl(url);
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        return false; // Prevent auto upload
    };

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/update-user-profile', 
                { ...values, userId: user._id, profilePicture: imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
                localStorage.setItem('user', JSON.stringify(response.data.data));
                setIsEditing(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    const uploadButton = (
        <div>
            <i className='ri-camera-line' style={{ fontSize: '24px' }}></i>
            <div style={{ marginTop: 8 }}>Upload Photo</div>
        </div>
    );

    return (
        <Layout>
            <div className='d-flex justify-content-between align-items-center'>
                <h1 className='page-title'>My Profile</h1>
                {!isEditing && (
                    <Button 
                        className='primary-button' 
                        style={{ width: 'auto', padding: '0 30px' }}
                        onClick={() => setIsEditing(true)}
                    >
                        <i className='ri-edit-line'></i> Edit Profile
                    </Button>
                )}
            </div>
            <hr />
            {user && (
                <Card className='profile-card'>
                    {!isEditing ? (
                        <div className='profile-view'>
                            <div className='profile-avatar'>
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt='Profile' style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <i className='ri-user-line'></i>
                                )}
                            </div>
                            <div className='profile-info'>
                                <div className='profile-item'>
                                    <label>Full Name</label>
                                    <p>{user.name}</p>
                                </div>
                                <div className='profile-item'>
                                    <label>Email Address</label>
                                    <p>{user.email}</p>
                                </div>
                                <div className='profile-item'>
                                    <label>Account Type</label>
                                    <p className='role-badge'>
                                        {user.role === 'admin' ? 'Administrator' : user.isDoctor ? 'Doctor' : 'Patient'}
                                    </p>
                                </div>
                                <div className='profile-item'>
                                    <label>Account Status</label>
                                    <p className='status-badge'>Active</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Form 
                            layout='vertical' 
                            onFinish={onFinish}
                            initialValues={{
                                name: user.name,
                                email: user.email
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <Upload
                                    name='avatar'
                                    listType='picture-circle'
                                    className='avatar-uploader'
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleImageChange}
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} alt='avatar' style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                                <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
                                    Click to upload profile picture (Max 2MB)
                                </p>
                            </div>

                            <Row gutter={20}>
                                <Col span={12} xs={24} sm={24} lg={12}>
                                    <Form.Item 
                                        label='Full Name' 
                                        name='name' 
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input placeholder='Full Name' />
                                    </Form.Item>
                                </Col>
                                <Col span={12} xs={24} sm={24} lg={12}>
                                    <Form.Item 
                                        label='Email Address' 
                                        name='email' 
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input placeholder='Email Address' />
                                    </Form.Item>
                                </Col>
                                <Col span={12} xs={24} sm={24} lg={12}>
                                    <Form.Item 
                                        label='New Password (leave blank to keep current)' 
                                        name='password'
                                    >
                                        <Input.Password placeholder='New Password' />
                                    </Form.Item>
                                </Col>
                                <Col span={12} xs={24} sm={24} lg={12}>
                                    <Form.Item 
                                        label='Confirm Password' 
                                        name='confirmPassword'
                                        dependencies={['password']}
                                        rules={[
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
                                </Col>
                            </Row>

                            <div className='d-flex justify-content-end' style={{ gap: '10px' }}>
                                <Button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setImageUrl(user?.profilePicture || '');
                                    }}
                                    style={{ width: 'auto', padding: '0 30px' }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className='primary-button' 
                                    htmlType='submit'
                                    style={{ width: 'auto', padding: '0 30px' }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card>
            )}
        </Layout>
    );
}

export default Profile;
