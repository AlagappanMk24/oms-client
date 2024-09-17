import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./ValidateOTP.css";
import ResetPassword from "./ResetPassword";
import Layout from "../Layout/Layout";
import CircularProgress from "@mui/material/CircularProgress";

interface ValidateOTPProps {
  jwtToken: string;
  setJwtToken: (token: string) => void;
  expiryTime: string;
  setExpiryTime: (time: string) => void;
  isResetPassword: boolean;
  setIsResetPassword: (value: boolean) => void;
  userEmail: string;
}

interface FormData {
  otp: string;
}

interface Errors {
  otp?: string;
}

const ValidateOTP: React.FC<ValidateOTPProps> = ({
  jwtToken,
  setJwtToken,
  expiryTime,
  setExpiryTime,
  isResetPassword,
  setIsResetPassword,
  userEmail,
}) => {
  const [formData, setFormData] = useState<FormData>({ otp: "" });
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const ApiBaseUrl = "https://localhost:7034";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateOTPForm = (): boolean => {
    const newErrors: Errors = {};
    const otpRegex = /^\d{6}$/;
    if (!formData.otp) {
      newErrors.otp = "Please enter the OTP";
    } else if (!otpRegex.test(formData.otp)) {
      newErrors.otp = "Invalid OTP format. Please enter exactly 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidateOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateOTPForm()) return;
    setLoading(true);
    setLoadingMessage("Validating OTP, please wait...");
    const payload = {
      OTP: formData.otp,
      ExpiryTime: expiryTime,
      IsResetPassword: isResetPassword,
    };
    const url = `${ApiBaseUrl}/ValidateOTP`;
    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.data.success) {
        setLoadingMessage("Login successful!");
        setTimeout(() => {
          setLoadingMessage("Now you are redirecting to dashboard.");
          setTimeout(() => {
            setLoading(false);
          }, 4000);
        }, 2000);
        setShowNextStep(true);
        setShowResetPassword(response.data.showResetPassword);
      } else {
        setErrors({ otp: response.data.message });
        setLoading(false);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ otp: error.response.data.message });
        setLoading(false);
      } else {
        setErrors({
          otp: "An error occurred while validating OTP. Please try again later.",
        });
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setErrors({});
    setLoading(true);
    setLoadingMessage("Resending OTP, please wait...");
    const payload = {
      ToEmail: userEmail,
    };
    try {
      const response = await axios.post(`${ApiBaseUrl}/SendOTP`, payload);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.data?.status === "success") {
        setLoading(false);
        setJwtToken(response.data.jwtToken);
        setExpiryTime(response.data.expiryTime);
        setIsResetPassword(response.data.isResetPassword);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <CircularProgress color="primary" />
          <p className="loading-text">{loadingMessage}</p>
        </div>
      )}
      {showNextStep ? (
        showResetPassword ? (
          <ResetPassword />
        ) : (
          <Layout><></></Layout>
        )
      ) : (
        <div className="otp-wrapper">
          <form onSubmit={handleValidateOTP} className="login-form">
            <h3>Verify OTP</h3>
            <p>
              OTP has been sent to your email. Please check your inbox and enter
              the OTP.
            </p>
            {alertMessage && <div className="alert-box">{alertMessage}</div>}
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter the otp"
                className={`form-input ${errors.otp ? "invalid-input" : ""}`}
                value={formData.otp}
                onChange={handleInputChange}
              />
              {errors.otp && <span className="error-text">{errors.otp}</span>}
            </div>
            <button type="submit" className="btn">
              Validate OTP
            </button>
            <div className="resend-link">
              Didn't receive OTP?
              <a href="#" onClick={handleResendOTP}>
                Resend OTP
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ValidateOTP;
