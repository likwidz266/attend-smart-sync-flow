
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import StudentDashboard from "@/components/StudentDashboard";
import StudentList from "@/components/StudentList";
import NotificationCenter from "@/components/NotificationCenter";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { isTeacher, isStudent } = useAuth();
  
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      setCurrentPage("dashboard");
    } else if (path.includes("students")) {
      setCurrentPage("students");
    } else if (path.includes("reports")) {
      setCurrentPage("reports");
    } else if (path.includes("notifications")) {
      setCurrentPage("notifications");
    }
  }, [location]);

  const renderContent = () => {
    // Students can only see their own dashboard
    if (isStudent()) {
      return <StudentDashboard />;
    }

    // Teachers can access all pages
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentList />;
      case "notifications":
        return <NotificationCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AttendanceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          {renderContent()}
        </main>
      </div>
    </AttendanceProvider>
  );
};

export default Index;
