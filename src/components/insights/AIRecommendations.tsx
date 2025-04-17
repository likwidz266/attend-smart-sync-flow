
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/context/AttendanceContext";
import { AlertTriangle, Clock, Lightbulb } from "lucide-react";

const AIRecommendations = () => {
  const { attendanceRecords, classes } = useAttendance();

  const analyzeAttendancePatterns = () => {
    const recommendations = [];
    const weekdayAttendance: Record<string, { total: number; present: number }> = {};
    
    // Analyze attendance by weekday
    attendanceRecords.forEach(record => {
      const day = new Date(record.date).getDay();
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
      
      if (!weekdayAttendance[weekday]) {
        weekdayAttendance[weekday] = { total: 0, present: 0 };
      }
      
      weekdayAttendance[weekday].total++;
      if (record.status === 'present') {
        weekdayAttendance[weekday].present++;
      }
    });

    // Find best and worst attendance days
    let bestDay = { day: '', rate: 0 };
    let worstDay = { day: '', rate: 1 };
    
    Object.entries(weekdayAttendance).forEach(([day, data]) => {
      const rate = data.present / data.total;
      if (rate > bestDay.rate) {
        bestDay = { day, rate };
      }
      if (rate < worstDay.rate) {
        worstDay = { day, rate };
      }
    });

    recommendations.push({
      type: 'scheduling',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: 'Optimal Scheduling',
      description: `Schedule important classes on ${bestDay.day}s when attendance is highest (${(bestDay.rate * 100).toFixed(1)}% attendance rate)`
    });

    recommendations.push({
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: 'Attendance Concern',
      description: `Consider adjusting ${worstDay.day} classes which show lower attendance (${(worstDay.rate * 100).toFixed(1)}% attendance rate)`
    });

    return recommendations;
  };

  const recommendations = analyzeAttendancePatterns();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>Smart insights based on attendance patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {rec.icon}
              <div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
