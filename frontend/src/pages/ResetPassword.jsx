import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function PasswordResetPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return handleError("All fields are required");
    }
    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/auth/resetPassword/${token}`, // Sending request with the token
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleSuccess(result.message);

        // Redirect to login page after successful reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
      <ToastContainer /> {/* Toast for notifications */}
    </div>
  );
}

export default PasswordResetPage;
