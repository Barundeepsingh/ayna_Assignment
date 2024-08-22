import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { message } from "antd";
import { API, BEARER } from "../../constant";
import { getToken } from "../../helpers";

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Default to null to indicate no user data
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  const authToken = getToken();

  const fetchLoggedInUser = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // Handle non-200 responses here
        setUserData(null);
        message.error("Error While Getting Logged In User Details");
      }
    } catch (error) {
      console.error(error);
      setUserData(null);
      message.error("Error While Getting Logged In User Details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUser = (user) => {
    setUserData(user);
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    } else {
      setIsLoading(false); // Set loading to false if no token
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
