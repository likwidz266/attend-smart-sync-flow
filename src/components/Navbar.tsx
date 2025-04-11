
import { Bell, FileSpreadsheet, Home, LogOut, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");
  const { logout, userType } = useAuth();
  
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const navItems = [
    { path: "/", name: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/students", name: "Students", icon: <Users className="h-5 w-5" /> },
    { path: "/reports", name: "Reports", icon: <FileSpreadsheet className="h-5 w-5" /> },
    { path: "/notifications", name: "Notifications", icon: <Bell className="h-5 w-5" /> }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">AttendSync</span>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={activePath === item.path ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {userType && (
              <span className="text-sm font-medium text-gray-600 hidden md:inline-block">
                {userType === "teacher" ? "Teacher" : "Student"}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 ${
                activePath === item.path ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
