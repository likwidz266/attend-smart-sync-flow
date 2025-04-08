
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { generateSampleTemplate, parseAttendanceFile } from "@/utils/attendanceUtils";
import { useAttendance } from "@/context/AttendanceContext";
import { FileSpreadsheet, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AttendanceUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addStudents, addAttendanceRecords } = useAttendance();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { students, records } = await parseAttendanceFile(file);
      
      // Add the data to the context
      addStudents(students);
      addAttendanceRecords(records);
      
      toast({
        title: "Upload successful",
        description: `Imported ${students.length} students with attendance records.`,
      });
      
      setIsOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = generateSampleTemplate();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Upload Attendance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Attendance Data</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with student attendance data.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="template">Get Template</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="attendance-file">Select file</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label
                  htmlFor="attendance-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel or CSV (Max 10MB)</p>
                  </div>
                  <input
                    id="attendance-file"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="template" className="py-4">
            <div className="flex flex-col items-center gap-4">
              <FileSpreadsheet className="h-16 w-16 text-blue-500" />
              <div className="text-center">
                <h3 className="font-medium text-lg">Download Template</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Use this template as a starting point for your attendance data.
                </p>
                <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download Template</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="gap-2"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceUpload;
