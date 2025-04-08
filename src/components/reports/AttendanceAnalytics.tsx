
import { useState } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAttendanceSummary } from "@/utils/attendanceUtils";

const COLORS = ['#22c55e', '#ef4444', '#eab308'];

const AttendanceAnalytics = () => {
  const { classes, getClassAttendance, students, attendanceRecords } = useAttendance();
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Calculate overall attendance statistics
  const calculateOverallStats = () => {
    let filteredRecords = [...attendanceRecords];
    let filteredStudents = [...students];
    
    if (selectedClass) {
      const { records, students: classStudents } = getClassAttendance(selectedClass);
      filteredRecords = records;
      filteredStudents = classStudents;
    }
    
    const summary = generateAttendanceSummary(filteredRecords);
    
    return [
      { name: "Present", value: summary.present },
      { name: "Absent", value: summary.absent },
      { name: "Late", value: summary.late }
    ];
  };

  // Prepare data for class comparison chart
  const prepareClassComparisonData = () => {
    const classAttendanceData = classes.map(classInfo => {
      const { records } = getClassAttendance(classInfo.name);
      const summary = generateAttendanceSummary(records);
      
      return {
        name: classInfo.name,
        present: summary.presentPercentage,
        absent: summary.absentPercentage,
        late: summary.latePercentage,
      };
    });
    
    return classAttendanceData;
  };

  // Prepare data for charts
  const prepareChartData = () => {
    let filteredClasses = classes;
    
    if (selectedClass) {
      filteredClasses = classes.filter(c => c.name === selectedClass);
    }
    
    const classAttendanceData = filteredClasses.map(classInfo => {
      const { records } = getClassAttendance(classInfo.name);
      const present = records.filter(r => r.status === "present").length;
      const absent = records.filter(r => r.status === "absent").length;
      const late = records.filter(r => r.status === "late").length;
      
      return {
        name: classInfo.name,
        present,
        absent,
        late,
      };
    });
    
    return classAttendanceData;
  };

  const chartData = prepareChartData();
  const comparisonData = prepareClassComparisonData();
  const overallStats = calculateOverallStats();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${entry.name.includes('Percentage') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance Analytics</CardTitle>
          <CardDescription>
            Visual representation of attendance data across classes
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
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="comparison">Class Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="present" fill="#22c55e" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                <Bar dataKey="late" fill="#eab308" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="pie" className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {overallStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="comparison" className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="present" fill="#22c55e" name="Present %" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
                <Bar dataKey="late" fill="#eab308" name="Late %" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceAnalytics;
