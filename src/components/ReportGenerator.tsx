
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from "./reports/ReportForm";
import ReportOptionCards from "./reports/ReportOptionCards";
import AttendanceAnalytics from "./reports/AttendanceAnalytics";
import ReportSummary from "./reports/ReportSummary";

const ReportGenerator = () => {
  return (
    <div className="space-y-6 p-6 pb-16 md:pb-6 animate-fade-in">
      <div className="border-l-4 border-blue-500 pl-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Reports Dashboard</h1>
        <p className="text-gray-500">Generate and analyze attendance reports with ease</p>
      </div>
      
      <Tabs defaultValue="summary" className="mt-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="summary" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Summary</TabsTrigger>
          <TabsTrigger value="generate" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Generate Report</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 mt-4">
          <ReportSummary />
          <ReportOptionCards />
        </TabsContent>
        
        <TabsContent value="generate" className="space-y-4 mt-4">
          <ReportForm />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <AttendanceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportGenerator;
