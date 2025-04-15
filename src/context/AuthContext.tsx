
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UserType = "student" | "teacher" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  userId: string | null;
  login: (type: "student" | "teacher", email: string) => void;
  logout: () => void;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  canModifyAttendance: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage on component mount to restore login state
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUserId = localStorage.getItem("userId");
    
    if (storedLoggedIn === "true" && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  const login = (type: "student" | "teacher", email: string) => {
    // Generate a user ID based on the email (for demo purposes)
    // In a real app, this would come from your authentication service
    const generatedUserId = `user-${email.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
    
    setIsLoggedIn(true);
    setUserType(type);
    setUserId(generatedUserId);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", type);
    localStorage.setItem("userId", generatedUserId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserId(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const isTeacher = () => userType === "teacher";
  const isStudent = () => userType === "student";
  const canModifyAttendance = () => userType === "teacher";

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userType,
      userId,
      login, 
      logout, 
      isTeacher, 
      isStudent, 
      canModifyAttendance 
    }}>
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
