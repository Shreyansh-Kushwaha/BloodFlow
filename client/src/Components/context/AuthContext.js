import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [user, setUser] = useState([]);

  async function getLoggedIn() {
    try {
      // FIX 1: Use backticks (`) and ${} to evaluate the environment variable
      const loggedInRes = await axios.get(`${process.env.REACT_APP_API_URL}/auth/loggedIn`, { 
        withCredentials: true 
      });
      
      setLoggedIn(loggedInRes.data.auth);
      setUser(loggedInRes.data.user);
    } catch (error) {
      // FIX 2: If the network fails, safely set loggedIn to false instead of crashing
      console.error("Auth check failed:", error);
      setLoggedIn(false);
      setUser(null);
    }
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, getLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
