
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

  const handleSuccessfulLogin = (type: "student" | "teacher") => {
    // Use the AuthContext login function instead of directly setting localStorage
    login(type);
    
    toast({
      title: "Login Successful",
      description: `Welcome back! You've logged in as a ${type}.`,
    });
    
    // Redirect to appropriate dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">AttendSync</CardTitle>
          <CardDescription>
            Choose your account type to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as "student" | "teacher")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <UserLoginForm 
                userType="student" 
                onSuccess={() => handleSuccessfulLogin("student")}
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleLoginButton 
                userType="student" 
                onSuccess={() => handleSuccessfulLogin("student")}
              />
            </TabsContent>
            
            <TabsContent value="teacher">
              <UserLoginForm 
                userType="teacher" 
                onSuccess={() => handleSuccessfulLogin("teacher")} 
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleLoginButton 
                userType="teacher" 
                onSuccess={() => handleSuccessfulLogin("teacher")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground mt-2">
            By clicking continue, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
            {" "}and{" "}
            <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
