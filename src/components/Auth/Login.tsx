import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ValidateOTP from "../../components/Auth/ValidateOTP";
import "./LoginSignUp.css";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  CircularProgress,
  Stack,
  Flex
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
// import { Modal, Button } from "antd";
// import CircularProgress from "@mui/material/CircularProgress";

const ApiBaseUrl = "https://localhost:7034";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  modalEmail?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [modalEmail, setModalEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [showOTPValidation, setShowOTPValidation] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("");
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [passwordResetMessage, setPasswordResetMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Navigate to home or another page
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleModalEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModalEmail(e.target.value);
    if (errors.modalEmail) {
      setErrors({ ...errors, modalEmail: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!formData.email) {
      newErrors.email = "Email cannot be empty.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password cannot be empty.";
    } else if (!passwordRegex.test(formData.password)) {
      setAlertMessage(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character"
      );
      setTimeout(() => setAlertMessage(""), 6000);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateModalEmail = () => {
    const newErrors: Errors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!modalEmail) {
      newErrors.modalEmail = "Email cannot be empty.";
    } else if (!emailRegex.test(modalEmail)) {
      newErrors.modalEmail = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setLoadingMessage("Signing in, please wait...");
    const payload = {
      Email: formData.email,
      Password: formData.password,
    };

    try {
      const response = await axios.post(`${ApiBaseUrl}/Login`, payload);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.data?.status === "success") {
        setLoadingMessage("Sending OTP to your email, please wait...");
        handleSendOTP(response.data.email);

        if (remember) {
          localStorage.setItem("token", response.data?.generatedToken);
        } else {
          sessionStorage.setItem("token", response.data?.generatedToken);
        }
      } else {
        setLoading(false);
        setAlertMessage(response.data?.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setAlertMessage(error.response.data.message);
        setTimeout(() => setAlertMessage(""), 6000);
        setLoading(false);
      } else {
        setAlertMessage("An error occurred while processing the request.");
        setTimeout(() => setAlertMessage(""), 6000);
        setLoading(false);
      }
    }
  };

  const handleSendOTP = async (email: string) => {
    const payload = { ToEmail: email };

    try {
      const response = await axios.post(`${ApiBaseUrl}/SendOTP`, payload);
      if (response.data?.status === "success") {
        setJwtToken(response.data.jwtToken);
        setExpiryTime(response.data.expiryTime);
        setIsResetPassword(response.data.isResetPassword);
        setUserEmail(response.data.emailAddress);
        setShowOTPValidation(true);
        setModalOpen(false);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleGoogleLoginFailure = (error: any) => {
    console.error("Google login failed:", error);
  };

  const handleForgotPassword = async () => {
    if (!validateModalEmail()) return;
    const payload = { Email: modalEmail };

    try {
      setPasswordLoading(true);
      setPasswordResetMessage("Sending a password reset link to your email. Please wait...");
      const response = await axios.post(`${ApiBaseUrl}/ForgotPassword`, payload);

      if (response.data?.status === "success") {
        setModalEmail("");
        setTimeout(() => {
          setPasswordLoading(false);
          setModalOpen(false);
          toast.success(response.data?.message);
        }, 3000);
      } else {
        setPasswordLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setPasswordLoading(false);
    }
  };
  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, blue.500, purple.500)"
    >
      <Box
        p={8}
        maxW="md"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        width="full"
      >
        {showOTPValidation ? (
          <ValidateOTP
            jwtToken={jwtToken}
            setJwtToken={setJwtToken}
            expiryTime={expiryTime}
            setExpiryTime={setExpiryTime}
            isResetPassword={isResetPassword}
            setIsResetPassword={setIsResetPassword}
            userEmail={userEmail}
          />
        ) : (
          <VStack spacing={6} align="stretch">
            {loading && (
              <Box textAlign="center">
                <CircularProgress isIndeterminate color="blue.500" />
                <Text mt={2}>{loadingMessage}</Text>
              </Box>
            )}
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="blue.700">
              Welcome Back
            </Text>
            <Text textAlign="center" color="gray.600">
              Please enter your credentials to log in.
            </Text>
            {alertMessage && (
              <Box p={4} bg="red.100" borderRadius="md" textAlign="center">
                {alertMessage}
              </Box>
            )}
            <form onSubmit={handleLogin}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  focusBorderColor="blue.500"
                />
                {errors.email && <Text color="red.500">{errors.email}</Text>}
              </FormControl>
              <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    focusBorderColor="blue.500"
                  />
                  <InputRightElement h="full">
                    <Button variant="ghost" onClick={togglePasswordVisibility}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <Text color="red.500">{errors.password}</Text>}
              </FormControl>
              <Stack mt={4} direction="row" justifyContent="space-between">
                <Checkbox isChecked={remember} onChange={(e) => setRemember(e.target.checked)}>
                  Remember me
                </Checkbox>
                <Button variant="link" colorScheme="blue" onClick={onOpen}>
                  Forgot Password?
                </Button>
              </Stack>
              <Button
                type="submit"
                colorScheme="blue"
                mt={6}
                width="full"
                isLoading={loading}
                loadingText="Logging in"
              >
                Login
              </Button>
            </form>
            {/* Sign Up link for new users */}
            <Text textAlign="center" mt={4} color="gray.600">
              New here?{" "}
              <Link to="/signup">
                <Button variant="link" colorScheme="blue">
                  Create an account
                </Button>
              </Link>
            </Text>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Forgot Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isInvalid={!!errors.modalEmail}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="text"
                      name="modalEmail"
                      placeholder="example@email.com"
                      value={modalEmail}
                      onChange={handleModalEmailChange}
                      focusBorderColor="blue.500"
                    />
                    {errors.modalEmail && <Text color="red.500">{errors.modalEmail}</Text>}
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    ml={3}
                    onClick={handleForgotPassword}
                    isLoading={passwordLoading}
                    loadingText="Sending"
                  >
                    Send Password Reset
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default Login;
