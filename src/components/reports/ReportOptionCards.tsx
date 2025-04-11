
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BarChart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReportSummary from "./ReportSummary";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const FeatureCard = ({ icon, title, description, buttonText, buttonIcon, onClick, disabled = false, color }) => {
  const cardVariants = {
    hover: { 
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div whileHover="hover" variants={cardVariants}>
      <Card className="h-full border-t-4" style={{ borderTopColor: color }}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center h-full">
            <div className="p-3 rounded-full mb-4" style={{ backgroundColor: `${color}20` }}>
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              {description}
            </p>
            <div className="mt-auto w-full">
              <Button 
                variant={disabled ? "outline" : "default"} 
                className="w-full gap-2 mt-4" 
                onClick={onClick}
                disabled={disabled}
                style={!disabled ? { backgroundColor: color } : {}}
              >
                {buttonIcon}
                <span>{buttonText}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ReportOptionCards = () => {
  const { toast } = useToast();

  const notifyComingSoon = (feature) => {
    toast({
      title: "Coming Soon!",
      description: `The ${feature} feature will be available in the next update.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <FeatureCard 
              icon={<FileText className="h-6 w-6 text-blue-600" />}
              title="Attendance Summary"
              description="Basic attendance statistics and insights"
              buttonText="View Summary"
              buttonIcon={<FileText className="h-4 w-4" />}
              color="#3b82f6"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Attendance Summary</DialogTitle>
            <DialogDescription>
              Detailed overview of attendance statistics
            </DialogDescription>
          </DialogHeader>
          <ReportSummary />
        </DialogContent>
      </Dialog>
      
      <FeatureCard 
        icon={<BarChart className="h-6 w-6 text-green-600" />}
        title="Analytics Report"
        description="Trends, patterns and advanced insights"
        buttonText="Coming Soon"
        buttonIcon={<Download className="h-4 w-4" />}
        disabled={true}
        onClick={() => notifyComingSoon("Analytics Report")}
        color="#10b981"
      />
      
      <FeatureCard 
        icon={<Calendar className="h-6 w-6 text-purple-600" />}
        title="Custom Reports"
        description="Create tailored attendance reports"
        buttonText="Coming Soon"
        buttonIcon={<Download className="h-4 w-4" />}
        disabled={true}
        onClick={() => notifyComingSoon("Custom Reports")}
        color="#8b5cf6"
      />
    </div>
  );
};

export default ReportOptionCards;
