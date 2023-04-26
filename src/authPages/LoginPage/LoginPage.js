import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";


const URL = "http://localhost:4000";
const socket = io(URL, {
  autoConnect: false,
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggedIn, checkLoginStatus } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    checkLoginStatus();
    if (isLoggedIn) {
      navigate('/dashboard');
      socket.connect();
      socket.emit("register_email", { email });
    } else {
      socket.disconnect();
    }
  }, [isLoggedIn, navigate, checkLoginStatus, email]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard')
      } else {
        console.log("Error")
      }
    } catch (error) {
      console.log("Error")
    }
  };

  const handleRedirect = () => {
    navigate('/register')
  }

  return (
    <section>
      <header>
        <h1>Login Page</h1>
      </header>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" value={email} onChange={handleEmailChange} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />

        <button type="submit">Login</button>
      </form>
      <button onClick={handleRedirect}>Register?</button>
    </section>
  );
};

export default LoginPage;
