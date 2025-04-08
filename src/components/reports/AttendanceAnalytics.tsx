
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceAnalytics = () => {
  const { classes, getClassAttendance } = useAttendance();

  // Prepare data for charts
  const prepareChartData = () => {
    const classAttendanceData = classes.map(classInfo => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Analytics</CardTitle>
        <CardDescription>
          Visual representation of attendance data across classes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#22c55e" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              <Bar dataKey="late" fill="#eab308" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceAnalytics;
