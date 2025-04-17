
import { useState } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AbsenceExplanationForm = () => {
  const [date, setDate] = useState<Date>();
  const [explanation, setExplanation] = useState("");
  const { getStudentByUserId, updateAttendanceRecord, attendanceRecords } = useAttendance();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!date || !explanation.trim() || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const student = getStudentByUserId(user.id);
    if (!student) {
      toast({
        title: "Error",
        description: "Student record not found",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");
    const record = attendanceRecords.find(
      r => r.studentId === student.id && r.date === formattedDate
    );

    if (record) {
      updateAttendanceRecord(record.id, record.status, explanation);
      toast({
        title: "Explanation Submitted",
        description: "Your absence explanation has been recorded",
      });
      setDate(undefined);
      setExplanation("");
    } else {
      toast({
        title: "No Attendance Record",
        description: "No attendance record found for the selected date",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Absence Explanation</CardTitle>
        <CardDescription>
          Provide an explanation for your absence or request an attendance correction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Absence</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Explanation</label>
          <Textarea
            placeholder="Please provide details about your absence..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Submit Explanation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AbsenceExplanationForm;
