
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from "@/context/AttendanceContext";
import { generateAttendanceSummary } from "@/utils/attendanceUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportSummary = () => {
  const { students, attendanceRecords, classes, getClassAttendance } = useAttendance();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [summaryData, setSummaryData] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    presentPercentage: number;
    absentPercentage: number;
    latePercentage: number;
  }>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    latePercentage: 0
  });
  
  const [topAbsentees, setTopAbsentees] = useState<{
    name: string;
    email: string;
    class: string;
    absentPercentage: number;
  }[]>([]);

  useEffect(() => {
    calculateSummary();
  }, [selectedClass, attendanceRecords]);

  const calculateSummary = () => {
    let filteredRecords = [...attendanceRecords];
    let filteredStudents = [...students];
    
    if (selectedClass) {
      const { records, students: classStudents } = getClassAttendance(selectedClass);
      filteredRecords = records;
      filteredStudents = classStudents;
    }
    
    // Overall summary
    const summary = generateAttendanceSummary(filteredRecords);
    setSummaryData(summary);
    
    // Calculate student-specific summaries to find top absentees
    const studentSummaries = filteredStudents.map(student => {
      const studentRecords = filteredRecords.filter(record => record.studentId === student.id);
      const studentSummary = generateAttendanceSummary(studentRecords);
      
      return {
        name: student.name,
        email: student.email,
        class: student.class,
        absentPercentage: studentSummary.absentPercentage
      };
    });
    
    // Sort by absence percentage (descending) and take top 5
    const sortedAbsentees = studentSummaries
      .sort((a, b) => b.absentPercentage - a.absentPercentage)
      .filter(student => student.absentPercentage > 0)
      .slice(0, 5);
    
    setTopAbsentees(sortedAbsentees);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>
            Overview of attendance statistics and patterns
          </CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="absentees">Top Absentees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">Present</Badge>
                  <span className="text-2xl font-bold">
                    {summaryData.presentPercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryData.present} of {summaryData.total} sessions
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">Absent</Badge>
                  <span className="text-2xl font-bold">
                    {summaryData.absentPercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryData.absent} of {summaryData.total} sessions
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">Late</Badge>
                  <span className="text-2xl font-bold">
                    {summaryData.latePercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryData.late} of {summaryData.total} sessions
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-medium">Total Records</h3>
              </div>
              <div className="p-4">
                <p className="text-4xl font-bold">{summaryData.total}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedClass ? `For ${selectedClass}` : "Across all classes"}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="absentees">
            {topAbsentees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Absence Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAbsentees.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {student.absentPercentage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No absences recorded.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportSummary;
