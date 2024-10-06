import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils"; // Utility functions

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return handleError("Email is required");
    }

    setLoading(true); // Show loading state during request

    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      // Handle the response status
      if (response.ok) {
        handleSuccess(result.message); // Show success message
      } else {
        handleError(result.message || "Error occurred"); // Show error message
      }
    } catch (error) {
      console.error("Request Error:", error);
      handleError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending Email..." : "Send Reset Link"}
        </button>
      </form>
      <ToastContainer /> {/* For showing notifications */}
    </div>
  );
}

export default ForgotPassword;
