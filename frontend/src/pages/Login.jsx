import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("All Fields are required ");
    }
    // API call to Login
    try {
      const url = "http://localhost:3000/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (message) {
        const details = message.errorMsg;
        handleError(details);
      } else if (!success) {
        handleError(error);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div className="container">
      <h1> Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            onChange={handleChange}
            value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginInfo.password}
          />
        </div>
        <button type="submit">Login</button>
        <span>Don't Have a account? </span>
        <Link to="/signup">SignUp Here</Link>
        <Link to="/forgetPassword">Forgot Password?</Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
