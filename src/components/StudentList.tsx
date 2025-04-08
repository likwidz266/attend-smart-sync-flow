
import { useState } from "react";
import { useAttendance, Student, AttendanceRecord } from "@/context/AttendanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAttendanceSummary } from "@/utils/attendanceUtils";
import AddStudentForm from "./AddStudentForm";
import WeeklyAttendance from "./WeeklyAttendance";

const StudentList = () => {
  const { students, classes, getStudentAttendance } = useAttendance();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

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

  const calculateAttendanceRate = (studentId: string) => {
    const records = getStudentAttendance(studentId);
    const summary = generateAttendanceSummary(records);
    return summary.presentPercentage.toFixed(1);
  };

  const recentAttendance = (studentId: string): AttendanceRecord[] => {
    const records = getStudentAttendance(studentId);
    // Sort by date (most recent first) and take up to 3 records
    return [...records]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 p-6 pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-gray-500">Manage students and view attendance records</p>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="add">Add Student</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Filter Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map(classInfo => (
                        <SelectItem key={classInfo.id} value={classInfo.name}>
                          {classInfo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No students match your search criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Recent Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{calculateAttendanceRate(student.id)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {recentAttendance(student.id).map(record => (
                              <Badge 
                                key={record.id} 
                                variant="outline"
                                className={getStatusBadgeClass(record.status)}
                              >
                                {record.status}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <AddStudentForm />
        </TabsContent>
        
        <TabsContent value="weekly">
          <WeeklyAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentList;
