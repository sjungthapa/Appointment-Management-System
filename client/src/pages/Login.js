import { Button, Form, Input } from "antd";
import React from "react";
import toast from "react-hot-toast";
import {  useDispatch } from "react-redux"; // Make sure useDispatch is imported
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch(); // <-- UNCOMMENT THIS LINE
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>

          <div className='d-flex justify-content-between mt-2'>
            <Link to="/register" className="anchor">
              CLICK HERE TO REGISTER
            </Link>
            <Link to="/forgot-password" className="anchor">
              Forgot Password?
            </Link>
          </div>

        </Form>
      </div>
    </div>
  );
}

export default Login;