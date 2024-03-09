import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";
import "./style.css";

const LoginForm = () => {
  const [isActive, setIsActive] = useState(false);

  const [email, setEmail] = useState("");
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
      password: password,
      confirmPassword: confirmPassword,
    };

    console.log("Data Sign Up : ", dataSignUp);
  };

  const handleSignIn = () => {
    const dataSignIn = {
      email: email,
      password: password,
    };

    console.log("data Sign In :", dataSignIn);
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
            placeholder="Email"
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
