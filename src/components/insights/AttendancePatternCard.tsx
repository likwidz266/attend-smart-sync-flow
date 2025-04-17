
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/context/AttendanceContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendancePatternCard = () => {
  const { attendanceRecords } = useAttendance();

  // Calculate attendance by weekday
  const weekdayData = attendanceRecords.reduce((acc, record) => {
    const day = new Date(record.date).getDay();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (!acc[weekdays[day]]) {
      acc[weekdays[day]] = { total: 0, present: 0, absent: 0, late: 0 };
    }
    
    acc[weekdays[day]].total++;
    acc[weekdays[day]][record.status]++;
    
    return acc;
  }, {} as Record<string, { total: number; present: number; absent: number; late: number }>);

  const chartData = Object.entries(weekdayData).map(([day, data]) => ({
    day,
    attendanceRate: (data.present / data.total) * 100,
    lateRate: (data.late / data.total) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Patterns by Weekday</CardTitle>
        <CardDescription>Analyzing attendance trends across different days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendanceRate" stroke="#22c55e" name="Attendance Rate" />
              <Line type="monotone" dataKey="lateRate" stroke="#eab308" name="Late Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendancePatternCard;
