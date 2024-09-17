import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginSignUp.css";
import { Link, useNavigate } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
// import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  useToast,
  CircularProgress,
  Stack,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear corresponding error message when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    if (!formData.email) {
      newErrors.email = "Email cannot be empty";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password cannot be empty.";
    } else if (!passwordRegex.test(formData.password)) {
      setAlertMessage(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character"
      );
      setTimeout(() => setAlertMessage(""), 5000);
    }

    if (!formData.username) {
      newErrors.username = "Username cannot be empty";
    } else if (!usernameRegex.test(formData.username)) {
      setAlertMessage(
        "Username must be between 3 to 20 characters long and can only contain letters, numbers, underscores, and hyphens"
      );
      setTimeout(() => setAlertMessage(""), 5000);
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password cannot be empty";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setLoadingMessage("Signing up, please wait...");
    const payload = {
      Username: formData.username,
      Email: formData.email,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
    };

    try {
      const response = await axios.post("https://localhost:7034/SignUp", payload);
     // Ensure the loading message is shown for at least 3 seconds
     await new Promise((resolve) => setTimeout(resolve, 3000));
        if (response.status === 200) {
            setLoadingMessage("Signup successful! Redirecting to login...");
            setTimeout(() => {
              setLoadingMessage("Now you are redirecting to login, please wait...");
              setTimeout(() => {
                setLoading(false);
                navigate("/Login");
              }, 4000);
            }, 2000);
          } else {
            toast.error(response.data.message || "Signup failed. Please try again.");
            setLoading(false);
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
          setLoading(false);
        }
      };
    
      // return (
      //   <>
      //     <div>
      //       <div className="login-container">
      //         <ToastContainer position="top-center" pauseOnHover={false} />
      //         {loading && (
      //           <div className="overlay">
      //             <CircularProgress color="primary" />
      //             <p className="loading-text">{loadingMessage}</p>
      //           </div>
      //         )}
      //         <div className="login-wrapper">
      //           <form onSubmit={handleSignUp} className="login-form">
      //             <h3>SignUp</h3>
      //             <p>Please enter your credentials to sign up.</p>
      //             {alertMessage && <div className="alert-box">{alertMessage}</div>}
      //             <div className="mb-3">
      //               <label htmlFor="username" className="form-label">
      //                 Username
      //               </label>
      //               <input
      //                 type="text"
      //                 name="username"
      //                 placeholder="Enter the username"
      //                 className={`form-input ${errors.username ? "invalid-input" : ""}`}
      //                 value={formData.username}
      //                 onChange={handleInputChange}
      //               />
      //               {errors.username && (
      //                 <span className="error-text">{errors.username}</span>
      //               )}
      //             </div>
      //             <div className="mb-3">
      //               <label htmlFor="email" className="form-label">
      //                 Email
      //               </label>
      //               <input
      //                 type="text"
      //                 name="email"
      //                 placeholder="example@email.com"
      //                 className={`form-input ${errors.email ? "invalid-input" : ""}`}
      //                 value={formData.email}
      //                 onChange={handleInputChange}
      //               />
      //               {errors.email && (
      //                 <span className="error-text">{errors.email}</span>
      //               )}
      //             </div>
      //             <div className="mb-3">
      //               <label htmlFor="password" className="form-label">
      //                 Password
      //               </label>
      //               <div className="password-input">
      //                 <input
      //                   type={showPassword ? "text" : "password"}
      //                   name="password"
      //                   placeholder="Enter the password"
      //                   className={`form-input ${errors.password ? "invalid-input" : ""}`}
      //                   value={formData.password}
      //                   onChange={handleInputChange}
      //                 />
      //                 <IconButton
      //                   onClick={togglePasswordVisibility}
      //                   edge="end"
      //                   className="password-toggle"
      //                 >
      //                   {showPassword ? <Visibility /> : <VisibilityOff />}
      //                 </IconButton>
      //               </div>
      //               {errors.password && (
      //                 <span className="error-text">{errors.password}</span>
      //               )}
      //             </div>
      //             <div className="mb-3">
      //               <label htmlFor="confirmPassword" className="form-label">
      //                 Confirm Password
      //               </label>
      //               <div className="password-input">
      //                 <input
      //                   type={showConfirmPassword ? "text" : "password"}
      //                   name="confirmPassword"
      //                   placeholder="Enter the confirm password"
      //                   className={`form-input ${
      //                     errors.confirmPassword ? "invalid-input" : ""
      //                   }`}
      //                   value={formData.confirmPassword}
      //                   onChange={handleInputChange}
      //                 />
      //                 <IconButton
      //                   onClick={toggleConfirmPasswordVisibility}
      //                   edge="end"
      //                   className="password-toggle"
      //                 >
      //                   {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
      //                 </IconButton>
      //               </div>
      //               {errors.confirmPassword && (
      //                 <span className="error-text">{errors.confirmPassword}</span>
      //               )}
      //             </div>
      //             <button type="submit" className="btn btn-signUp">
      //               Submit
      //             </button>
      //             <div className="form-links">
      //               <span>
      //                 Already have an account? <a href="/Login">Login</a>
      //               </span>
      //             </div>
      //           </form>
      //         </div>
      //       </div>
      //     </div>
      //   </>
      // );
      return (
        <Flex
          height="100vh"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-r, teal.500, green.500)"
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
            {loading && (
              <Box textAlign="center" mb={4}>
                <CircularProgress isIndeterminate color="green.500" />
                <Text mt={2}>{loadingMessage}</Text>
              </Box>
            )}
            <VStack spacing={6} align="stretch">
              <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="green.700">
                Create an Account
              </Text>
              <Text textAlign="center" color="gray.600">
                Please enter your details to sign up.
              </Text>
              {alertMessage && (
                <Box p={4} bg="red.100" borderRadius="md" textAlign="center">
                  {alertMessage}
                </Box>
              )}
              <form onSubmit={handleSignUp}>
                <FormControl id="username" isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    focusBorderColor="green.500"
                  />
                  {errors.username && <Text color="red.500">{errors.username}</Text>}
                </FormControl>
                <FormControl id="email" mt={4} isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="text"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    focusBorderColor="green.500"
                  />
                  {errors.email && <Text color="red.500">{errors.email}</Text>}
                </FormControl>
                <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      focusBorderColor="green.500"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label="Toggle Password Visibility"
                        variant="ghost"
                        onClick={togglePasswordVisibility}
                        icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <Text color="red.500">{errors.password}</Text>}
                </FormControl>
                <FormControl id="confirmPassword" mt={4} isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      focusBorderColor="green.500"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label="Toggle Confirm Password Visibility"
                        variant="ghost"
                        onClick={toggleConfirmPasswordVisibility}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword}</Text>}
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="green"
                  mt={6}
                  width="full"
                  isLoading={loading}
                  loadingText="Signing up"
                >
                  Sign Up
                </Button>
              </form>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Text>Already have an account?</Text>
                <Link to="/">
                  <Button variant="link" colorScheme="green">
                    Login
                  </Button>
                </Link>
              </Stack>
              
            </VStack>
          </Box>
        </Flex>
      );
    };
    
    export default SignUp;
    