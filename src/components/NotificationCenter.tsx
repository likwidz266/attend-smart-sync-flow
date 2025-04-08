
import { useState } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send, UserCheck, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const NotificationCenter = () => {
  const { students, getAbsentees } = useAttendance();
  const { toast } = useToast();
  const [notifyAll, setNotifyAll] = useState(false);
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  // Get absentees
  const todayAbsentees = getAbsentees(today);
  const yesterdayAbsentees = getAbsentees(yesterdayString);
  
  const sendNotifications = (studentIds: string[]) => {
    if (studentIds.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one student to notify.",
        variant: "destructive",
      });
      return;
    }
    
    const recipients = studentIds.map(id => students.find(s => s.id === id)?.name).filter(Boolean);
    
    toast({
      title: "Notifications Sent",
      description: `Sent to: ${recipients.join(", ")}`,
    });
  };
  
  const sendAllNotifications = () => {
    sendNotifications(todayAbsentees.map(s => s.id));
  };

  return (
    <div className="space-y-6 p-6 pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-500">Manage and send attendance notifications</p>
      </div>
      
      <Tabs defaultValue="absentees">
        <TabsList>
          <TabsTrigger value="absentees">Absentee Notifications</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="absentees" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Today's Absentees</CardTitle>
                <CardDescription>
                  Students marked absent today: {todayAbsentees.length}
                </CardDescription>
              </div>
              <Button 
                onClick={sendAllNotifications} 
                disabled={todayAbsentees.length === 0}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Notify All</span>
              </Button>
            </CardHeader>
            <CardContent>
              {todayAbsentees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserCheck className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No absences today!</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All students have been marked present
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAbsentees.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendNotifications([student.id])}
                            className="gap-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>Notify</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Yesterday's Absentees</CardTitle>
              <CardDescription>
                Students who were absent yesterday: {yesterdayAbsentees.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {yesterdayAbsentees.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No absences recorded for yesterday
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yesterdayAbsentees.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendNotifications([student.id])}
                            className="gap-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>Notify</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Automated Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Daily Absence Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically notify parents when students are marked absent
                    </div>
                  </div>
                  <Switch checked={notifyAll} onCheckedChange={setNotifyAll} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Consecutive Absence Warnings</div>
                    <div className="text-sm text-muted-foreground">
                      Send additional alerts for students absent multiple days in a row
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Weekly Summary Reports</div>
                    <div className="text-sm text-muted-foreground">
                      Send weekly attendance summaries to parents and administrators
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Channels</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      Send attendance notifications via email
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">SMS Text Messages</div>
                    <div className="text-sm text-muted-foreground">
                      Send attendance notifications via text message
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">In-App Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Send notifications to parent/student portal
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Customize the content of notification messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Absence Notification</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Dear [Parent], this is a notification that [Student] was marked absent in [Class] on [Date]. 
                        Please contact the school office if this absence was not expected.
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">Edit Template</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Late Arrival Notification</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Dear [Parent], this is a notification that [Student] was marked late in [Class] on [Date].
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">Edit Template</Button>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Add New Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
