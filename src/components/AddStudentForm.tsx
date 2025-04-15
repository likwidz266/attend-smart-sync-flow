
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const AddStudentForm = () => {
  const { classes, addStudents } = useAttendance();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [showCustomClass, setShowCustomClass] = useState(false);

  const handleClassChange = (value: string) => {
    if (value === "custom") {
      setShowCustomClass(true);
      setSelectedClass("");
    } else {
      setShowCustomClass(false);
      setSelectedClass(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalClassName = showCustomClass ? customClass : selectedClass;
    
    if (!name || !email || (!finalClassName && !showCustomClass) || (showCustomClass && !customClass)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a user ID for potential login
    // In a real app, you'd create a student account with a secure password
    const studentUserId = `student-${email.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
    
    const newStudent = {
      id: `student-${Date.now()}`,
      name,
      email,
      class: finalClassName,
      userId: studentUserId, // Associate with a user ID
    };
    
    addStudents([newStudent]);
    
    toast({
      title: "Student Added",
      description: `${name} has been added successfully. They can now login with their email address.`,
    });
    
    // Reset form
    setName("");
    setEmail("");
    setSelectedClass("");
    setCustomClass("");
    setShowCustomClass(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter student email"
            />
            <p className="text-xs text-gray-500">
              Students will use this email to log in to their accounts
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select 
              value={showCustomClass ? "custom" : selectedClass} 
              onValueChange={handleClassChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(classInfo => (
                  <SelectItem key={classInfo.id} value={classInfo.name}>
                    {classInfo.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Add New Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showCustomClass && (
            <div className="space-y-2">
              <Label htmlFor="customClass">New Class Name</Label>
              <Input
                id="customClass"
                value={customClass}
                onChange={(e) => setCustomClass(e.target.value)}
                placeholder="Enter new class name"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full">Add Student</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStudentForm;
