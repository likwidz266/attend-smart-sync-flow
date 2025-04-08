
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BarChart } from "lucide-react";

const ReportOptionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-blue-100 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Attendance Summary</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Basic attendance statistics
            </p>
            <Button variant="outline" className="w-full gap-2" disabled>
              <Download className="h-4 w-4" />
              <span>Coming Soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-green-100 mb-4">
              <BarChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium">Analytics Report</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Trends and patterns analysis
            </p>
            <Button variant="outline" className="w-full gap-2" disabled>
              <Download className="h-4 w-4" />
              <span>Coming Soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-purple-100 mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium">Custom Reports</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Create tailored attendance reports
            </p>
            <Button variant="outline" className="w-full gap-2" disabled>
              <Download className="h-4 w-4" />
              <span>Coming Soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportOptionCards;
