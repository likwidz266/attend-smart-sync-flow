
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserLoginForm } from "@/components/auth/UserLoginForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<"student" | "teacher">("student");
  const { login } = useAuth();

  const handleSuccessfulLogin = (type: "student" | "teacher", email: string) => {
    login(type, email);
    
    toast({
      title: "Login Successful",
      description: `Welcome back! You've logged in as a ${type}.`,
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-login-gradient p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-lg backdrop-blur-sm bg-white/90 border border-light-blue-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-light-blue-600">
            AttendSync
          </CardTitle>
          <CardDescription className="text-light-blue-700">
            Choose your account type to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="student" 
            onValueChange={(value) => setUserType(value as "student" | "teacher")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-light-blue-50">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-light-blue-500 data-[state=active]:text-white"
              >
                Student
                <span className="ml-2 text-xs bg-light-blue-100 text-light-blue-800 py-0.5 px-1.5 rounded-full">
                  View Only
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="teacher" 
                className="data-[state=active]:bg-light-blue-600 data-[state=active]:text-white"
              >
                Teacher
                <span className="ml-2 text-xs bg-light-blue-100 text-light-blue-800 py-0.5 px-1.5 rounded-full">
                  Full Access
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <div className="bg-light-blue-50 p-3 rounded-md mb-4 text-sm border-l-4 border-light-blue-500">
                <p className="font-medium text-light-blue-800">Student Access</p>
                <p className="text-light-blue-700">You will be able to view your attendance records, but cannot modify data.</p>
              </div>
              <UserLoginForm 
                userType="student" 
                onSuccess={(email) => handleSuccessfulLogin("student", email)}
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-light-blue-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-light-blue-600">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleLoginButton 
                userType="student" 
                onSuccess={(email) => handleSuccessfulLogin("student", email)}
              />
            </TabsContent>
            
            <TabsContent value="teacher">
              <div className="bg-light-blue-50 p-3 rounded-md mb-4 text-sm border-l-4 border-light-blue-600">
                <p className="font-medium text-light-blue-800">Teacher Access</p>
                <p className="text-light-blue-700">You will have full access to manage student attendance and generate reports.</p>
              </div>
              <UserLoginForm 
                userType="teacher" 
                onSuccess={(email) => handleSuccessfulLogin("teacher", email)} 
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-light-blue-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-light-blue-600">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleLoginButton 
                userType="teacher" 
                onSuccess={(email) => handleSuccessfulLogin("teacher", email)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-light-blue-700 mt-2">
            By clicking continue, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-light-blue-600">Terms of Service</Button>
            {" "}and{" "}
            <Button variant="link" className="p-0 h-auto text-light-blue-600">Privacy Policy</Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

