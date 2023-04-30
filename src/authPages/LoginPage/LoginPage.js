import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggedIn, checkLoginStatus } = useAuth();

  const navigate = useNavigate();


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
        navigate('/dashboard');
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log('Error');
    }
  };


  useEffect(() => {
    checkLoginStatus();
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate, checkLoginStatus, email]);

  const handleRedirect = () => {
    navigate('/register');
  };

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

