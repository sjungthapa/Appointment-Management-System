import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Col } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Home() {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/doctor/get-all-approved-doctors", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Layout>
            <div className="home-header">
                <h1 className="page-title">Find Your Doctor</h1>
                <p className="page-subtitle">Book appointments with experienced doctors</p>
            </div>
            <hr style={{ margin: '20px 0', border: '1px solid #f0f0f0' }} />
            {doctors.length === 0 ? (
                <div className="no-doctors">
                    <i className="ri-hospital-line"></i>
                    <h3>No doctors available at the moment</h3>
                    <p>Please check back later</p>
                </div>
            ) : (
                <Row gutter={[20, 20]}>
                    {doctors.map((doctor) => (
                        <Col span={8} xs={24} sm={24} md={12} lg={8} key={doctor._id}>
                            <Doctor doctor={doctor} />
                        </Col>
                    ))}
                </Row>
            )}
        </Layout>
    );
}

export default Home;