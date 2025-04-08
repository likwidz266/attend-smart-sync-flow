
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAttendanceSummary } from "@/utils/attendanceUtils";
import { CalendarCheck, Users, AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AttendanceUpload from "./AttendanceUpload";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { classes, attendanceRecords, getClassAttendance, students, getAttendanceByDate } = useAttendance();
  const [todayDate, setTodayDate] = useState("");
  const [yesterdayDate, setYesterdayDate] = useState("");
  const [todaySummary, setTodaySummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    latePercentage: 0
  });

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setTodayDate(today);
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    setYesterdayDate(yesterday.toISOString().split('T')[0]);
    
    const todayRecords = getAttendanceByDate(today);
    setTodaySummary(generateAttendanceSummary(todayRecords));
  }, [getAttendanceByDate, attendanceRecords]);

  const StatCard = ({ title, value, icon, description, color }: { title: string, value: number | string, icon: JSX.Element, description: string, color: string }) => (
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
          <p className="text-gray-500">Monitor attendance records across all classes</p>
        </div>
        <AttendanceUpload />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={students.length} 
          icon={<Users className="h-5 w-5 text-white" />} 
          description="Across all classes" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Present Today" 
          value={todaySummary.present} 
          icon={<CalendarCheck className="h-5 w-5 text-white" />} 
          description={`${todaySummary.presentPercentage.toFixed(1)}% of enrolled students`} 
          color="bg-green-500"
        />
        <StatCard 
          title="Absent Today" 
          value={todaySummary.absent} 
          icon={<AlertTriangle className="h-5 w-5 text-white" />} 
          description={`${todaySummary.absentPercentage.toFixed(1)}% of enrolled students`} 
          color="bg-red-500"
        />
        <StatCard 
          title="Late Today" 
          value={todaySummary.late} 
          icon={<Clock className="h-5 w-5 text-white" />} 
          description={`${todaySummary.latePercentage.toFixed(1)}% of enrolled students`} 
          color="bg-yellow-500"
        />
      </div>
      
      <Tabs defaultValue="classes">
        <TabsList className="mb-4">
          <TabsTrigger value="classes">Class Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classInfo) => {
              const { records } = getClassAttendance(classInfo.name);
              const summary = generateAttendanceSummary(records);
              
              return (
                <Card key={classInfo.id} className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>{classInfo.name}</CardTitle>
                    <CardDescription>{classInfo.studentCount} students enrolled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Present</span>
                          <span className="font-medium">{summary.presentPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={summary.presentPercentage} className="h-2 bg-gray-100" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Absent</span>
                          <span className="font-medium">{summary.absentPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={summary.absentPercentage} className="h-2 bg-gray-100" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Late</span>
                          <span className="font-medium">{summary.latePercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={summary.latePercentage} className="h-2 bg-gray-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Data from the past 2 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[todayDate, yesterdayDate].map(date => {
                  const dateRecords = getAttendanceByDate(date);
                  const dateSummary = generateAttendanceSummary(dateRecords);
                  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  
                  return dateRecords.length > 0 ? (
                    <div key={date} className="space-y-2">
                      <h3 className="font-medium">{formattedDate}</h3>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Present: {dateSummary.present} ({dateSummary.presentPercentage.toFixed(1)}%)
                        </div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          Absent: {dateSummary.absent} ({dateSummary.absentPercentage.toFixed(1)}%)
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Late: {dateSummary.late} ({dateSummary.latePercentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={date} className="py-4 text-center text-gray-500">
                      No attendance data for {formattedDate}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
