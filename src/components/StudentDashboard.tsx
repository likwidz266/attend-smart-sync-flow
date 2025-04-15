
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateAttendanceSummary } from "@/utils/attendanceUtils";
import { CalendarCheck, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const { attendanceRecords, getStudentAttendance, students } = useAttendance();
  const { userType } = useAuth();
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    latePercentage: 0
  });

  // This is just a simulation - in a real app, we'd have the actual student ID
  // from authentication. Here we're just showing all records as if they belong to the student
  useEffect(() => {
    if (userType === "student" && students.length > 0) {
      // Using the first student as a placeholder - in a real app, this would be the logged-in student
      const records = getStudentAttendance(students[0]?.id || "");
      setStudentAttendance(records);
      setSummary(generateAttendanceSummary(records));
    }
  }, [userType, students, getStudentAttendance, attendanceRecords]);

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

  const StatCard = ({ title, value, icon, description, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">My Attendance</h1>
        <p className="text-gray-500">View your attendance records</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Present" 
          value={summary.present} 
          icon={<CalendarCheck className="h-5 w-5 text-white" />} 
          description={`${summary.presentPercentage.toFixed(1)}% of total classes`} 
          color="bg-green-500"
        />
        <StatCard 
          title="Absent" 
          value={summary.absent} 
          icon={<AlertTriangle className="h-5 w-5 text-white" />} 
          description={`${summary.absentPercentage.toFixed(1)}% of total classes`} 
          color="bg-red-500"
        />
        <StatCard 
          title="Late" 
          value={summary.late} 
          icon={<Clock className="h-5 w-5 text-white" />} 
          description={`${summary.latePercentage.toFixed(1)}% of total classes`} 
          color="bg-yellow-500"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Your attendance records for all classes</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {studentAttendance.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No attendance records found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentAttendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getStatusBadgeClass(record.status)}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
