import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function SignUp() {
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignUpInfo = { ...signUpInfo };
    copySignUpInfo[name] = value;
    setSignUpInfo(copySignUpInfo);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signUpInfo;
    if (!name || !email || !password) {
      return handleError("All Fields are required ");
    }
    // API call to sign up
    try {
      const url = "http://localhost:3000/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Enter your name"
            autoFocus
            value={signUpInfo.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            onChange={handleChange}
            value={signUpInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={signUpInfo.password}
          />
        </div>
        <button type="submit">SignUp</button>
        <span>Already Have a account? </span>
        <Link to="/login">Login Here</Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
