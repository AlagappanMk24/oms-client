import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./LoginSignUp.css";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const ApiBaseUrl = "https://localhost:7034";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

interface Errors {
  password?: string;
  confirmPassword?: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (): boolean => {
    const newErrors: Errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordFormData.password) {
      newErrors.password = "Password cannot be empty";
    } else if (!passwordRegex.test(passwordFormData.password)) {
      setAlertMessage(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character"
      );
      setTimeout(() => setAlertMessage(""), 6000);
    }

    if (!passwordFormData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password cannot be empty";
    } else if (passwordFormData.password !== passwordFormData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });

    // Clear corresponding error message when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePassword()) return;

    const payload = {
      Password: passwordFormData.password,
      Token: token,
      Email: email,
    };

    try {
      const response = await axios.post(`${ApiBaseUrl}/ResetPassword`, payload);
      if (response.data?.status === "success") {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/Login");
        }, 5000);
      } else {
        setAlertMessage(response.data?.message || "Failed to reset password.");
      }
    } catch (error: any) {
      // Check if the error response is a bad request and contains the expected message
      if (error.response?.data?.message === "Token has expired.") {
        setAlertMessage("The reset link has expired. Please request a new one.");
        setTimeout(() => {
          navigate("/Login");
        }, 4000);
      } else {
        setAlertMessage(
          error.response?.data?.message ||
            "An error occurred while processing the request."
        );
      }
    }
  };

  return (
    <div className="reset-pwd-container">
      {loading && (
        <div className="overlay">
          <CircularProgress color="primary" />
          <p className="loading-text">
            Password reset successfully. Now you are redirecting to login, please wait
          </p>
        </div>
      )}
      <div className="reset-pwd-wrapper">
        <form className="reset-pwd-form" onSubmit={handleUpdatePassword}>
          <h5>Reset Your Password</h5>
          {alertMessage && <div className="alert-box">{alertMessage}</div>}
          <div className="mb-3">
            <label htmlFor="password" className="form-label mb-2">
              New Password:
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter the password"
                className={`form-input ${
                  errors.password ? "invalid-input" : ""
                }`}
                value={passwordFormData.password}
                onChange={handleInputChange}
              />
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                className="password-toggle"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label mb-2">
              Confirm New Password:
            </label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Enter the confirm password"
                className={`form-input ${
                  errors.confirmPassword ? "invalid-input" : ""
                }`}
                value={passwordFormData.confirmPassword}
                onChange={handleInputChange}
              />
              <IconButton
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
                className="password-toggle"
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-reset-password">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
