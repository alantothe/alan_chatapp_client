import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import { io } from "socket.io-client";



const URL = "http://localhost:4000";
const socket = io(URL, {
  autoConnect: false,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);



  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

  }
  useEffect(() => {
    checkLoginStatus();
  }, []);


  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_ENDPOINT}/api/user/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        console.log("User set:", response.data.user);
        setIsLoggedIn(true);

        return { success: true };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };



  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_ENDPOINT}/api/user/register`, {
        firstName,
        lastName,
        email,
        password,

      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
<AuthContext.Provider value={{ isLoggedIn, register ,login, logout, checkLoginStatus, user, setIsLoggedIn }}>
    {children}
</AuthContext.Provider>

  );
};

export const useAuth = (socket) => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
