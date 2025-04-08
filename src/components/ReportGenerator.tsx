
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from "./reports/ReportForm";
import ReportOptionCards from "./reports/ReportOptionCards";
import AttendanceAnalytics from "./reports/AttendanceAnalytics";

const ReportGenerator = () => {
  return (
    <div className="space-y-6 p-6 pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-500">Generate and download attendance reports</p>
      </div>
      
      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4 mt-4">
          <ReportForm />
          <ReportOptionCards />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <AttendanceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportGenerator;
