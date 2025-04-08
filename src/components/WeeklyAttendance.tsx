
import { useState, useEffect } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, isAfter } from "date-fns";
import { CalendarX, CalendarCheck } from "lucide-react";

const WeeklyAttendance = () => {
  const { students, attendanceRecords, classes } = useAttendance();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  // Get students for the selected class
  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass)
    : students;

  useEffect(() => {
    // Generate array of days in the current week
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday as start of week
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days.slice(0, 5)); // Only include weekdays (Mon-Fri)
  }, [currentWeek]);

  const getStatusForDay = (studentId: string, day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const record = attendanceRecords.find(
      r => r.studentId === studentId && r.date === dayStr
    );
    return record ? record.status : "no-data";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "late":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const previousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const nextWeek = () => {
    const nextWeekDate = addDays(currentWeek, 7);
    // Only allow navigating to future weeks if they're not after today
    if (!isAfter(startOfWeek(nextWeekDate, { weekStartsOn: 1 }), new Date())) {
      setCurrentWeek(nextWeekDate);
    }
  };

  const isCurrentWeek = isSameDay(
    startOfWeek(currentWeek, { weekStartsOn: 1 }),
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          Weekly Attendance
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {classes.map(classInfo => (
                <SelectItem key={classInfo.id} value={classInfo.name}>
                  {classInfo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <button 
              onClick={previousWeek} 
              className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              &lt;
            </button>
            <span className="text-sm font-medium">
              {format(weekDays[0] || new Date(), "MMM d")} - {format(weekDays[weekDays.length - 1] || new Date(), "MMM d, yyyy")}
            </span>
            <button 
              onClick={nextWeek} 
              disabled={isCurrentWeek}
              className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              {weekDays.map(day => (
                <TableHead key={day.toISOString()} className="text-center">
                  <div>{format(day, "EEE")}</div>
                  <div className="text-xs">{format(day, "MMM d")}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={weekDays.length + 1} className="text-center text-gray-500 h-32">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CalendarX className="h-10 w-10 text-gray-400" />
                    {selectedClass ? "No students in this class" : "Select a class to view students"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {weekDays.map(day => {
                    const status = getStatusForDay(student.id, day);
                    return (
                      <TableCell key={day.toISOString()} className="text-center">
                        {status !== "no-data" ? (
                          <Badge 
                            variant="outline"
                            className={getStatusBadgeClass(status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WeeklyAttendance;
