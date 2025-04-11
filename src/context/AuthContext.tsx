
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UserType = "student" | "teacher" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  login: (type: "student" | "teacher") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage on component mount to restore login state
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserType = localStorage.getItem("userType") as UserType;
    
    if (storedLoggedIn === "true" && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    }
  }, []);

  const login = (type: "student" | "teacher") => {
    setIsLoggedIn(true);
    setUserType(type);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
