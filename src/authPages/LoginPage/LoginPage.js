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
    <div className="bg-purple-500 min-h-screen flex items-center justify-center">
      <section className="bg-gray-800 p-10 rounded-lg w-96">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-10 text-white">Login Page</h1>
          <h3 className="text-white mb-5" >Welcome Back to Alan_Chat</h3>
        </header>

        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <label htmlFor="email" className="text-white mb-1">Email:</label>
          <input type="text" id="email" value={email} onChange={handleEmailChange} className="bg-white rounded px-3 py-2 mb-6 w-full" />

          <label htmlFor="password" className="text-white mb-1">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} className="bg-white rounded px-3 py-2 mb-6 w-full" />

          <button type="submit" className="bg-purple-500 text-white rounded px-5 py-2 mb-6 w-full">Login</button>
        </form>
        <button onClick={handleRedirect} className="bg-transparent text-purple-500 rounded px-5 py-2 w-full">Register?</button>
      </section>
    </div>
  );
};

export default LoginPage;

