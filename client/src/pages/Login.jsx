import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd"; // Corrected import statement
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  const navigate = useNavigate(); // ✅ Use `()` to call the hook

  const onFinish = async (values) => {
    console.log("Received values of form:", values);

    try {
      const response = await axios.post("/api/user/login", values);

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);

        // ✅ Ensure redirection happens only if login is successful
        toast("Redirecting to the homepage");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("An error occurred"); // ✅ Only executes if there's an error
      console.error("Login error:", err);
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Login</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Button className="primary-button my-2" htmlType="submit">
            Login
          </Button>

          <Link to="/register" className="anchor mt-2">
            Don't have an account? Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
