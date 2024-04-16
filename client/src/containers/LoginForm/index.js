import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import "./style.css";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [isActive, setIsActive] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const setInitState = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignUp = () => {
    const dataSignUp = {
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };

    console.log("Data Sign Up:", dataSignUp);

    axios
      .post("http://localhost:3003/user/register", dataSignUp)
      .then((response) => {
        // console.log("Success:", response.data);
        // Handle successful registration (e.g., redirect to user profile)
        toast.success("Registration successful! Please proceed to login.", {
          position: "top-right",
        });
        // Or: window.location.href = "/user/profile"; // Redirect to profile page
      })
      .catch((error) => {
        console.error("Error:", error.response.data);
        // Handle 400 Bad Request errors specifically
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.messagec, { position: "top-right" });
        } else {
          // Handle other errors (e.g., network errors, 500 Internal Server Error)
          toast.error("An unexpected error occurred. Please try again later.", {
            position: "top-right",
          });
        }
      });
  };

  const handleSignIn = async () => {
    // Using async/await for cleaner error handling
    const dataSignIn = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3003/user/login",
        dataSignIn
      );
      console.log("Login Success:", response.data);
      // Handle successful login (e.g., store user data, redirect to dashboard)
      toast.success("Logged in successfully!", { position: "top-right" });
      // Or: localStorage.setItem('user', JSON.stringify(response.data)); // Store user data
      //     window.location.href = "/user/dashboard"; // Redirect to dashboard
    } catch (error) {
      console.error("Error:", error.response.data);
      // Handle errors appropriately (e.g., display error message)
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "Login failed. Please check your credentials or try again later.",
          { position: "top-right" }
        );
      }
    }
  };
  return (
    <div
      className={`login-container ${isActive ? "active" : ""}`}
      id="login-container"
    >
      <div className="form-login-container sign-up">
        <div className="form">
          <h1>Create Account</h1>
          <div className="social-icons">
            <a>
              <FaFacebook />
            </a>
            <a>
              <FaInstagram />
            </a>
            <a>
              <FaGithub />
            </a>
            <a>
              <FaWhatsapp />
            </a>
          </div>
          <span>or use your email for registeration</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
      <div className="form-login-container sign-in">
        <div className="form">
          <h1>Sign In</h1>
          <div className="social-icons">
            <a>
              <FaFacebook />
            </a>
            <a>
              <FaInstagram />
            </a>
            <a>
              <FaGithub />
            </a>
            <a>
              <FaWhatsapp />
            </a>
          </div>
          <span>or use your email password</span>
          <input
            type="email"
            placeholder="Email or username"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#">Forget Your Password?</a>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button
              className="hidden"
              id="login"
              onClick={() => {
                setIsActive(false);
                setInitState();
              }}
            >
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button
              className="hidden"
              id="register"
              onClick={() => {
                setIsActive(true);
                setInitState();
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
