
import { Student, AttendanceRecord } from "../context/AttendanceContext";
import * as XLSX from 'xlsx';

// Parse Excel or CSV file to extract attendance data
export const parseAttendanceFile = (file: File): Promise<{ students: Student[], records: AttendanceRecord[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume first sheet has the data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const students: Student[] = [];
        const records: AttendanceRecord[] = [];
        const date = new Date().toISOString().split('T')[0]; // Today's date
        
        jsonData.forEach((row: any, index) => {
          // Assuming Excel has columns: Name, Email, Class, Status, Notes
          const student: Student = {
            id: `import-${Date.now()}-${index}`, // Generate unique ID
            name: row.Name || row.name || "",
            email: row.Email || row.email || "",
            class: row.Class || row.class || ""
          };
          
          students.push(student);
          
          const record: AttendanceRecord = {
            id: `record-${Date.now()}-${index}`,
            studentId: student.id,
            date,
            status: (row.Status || row.status || "present").toLowerCase() as "present" | "absent" | "late",
            notes: row.Notes || row.notes || ""
          };
          
          records.push(record);
        });
        
        resolve({ students, records });
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Generate attendance summary
export const generateAttendanceSummary = (records: AttendanceRecord[]) => {
  const total = records.length;
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const late = records.filter(r => r.status === "late").length;
  
  return {
    total,
    present,
    absent,
    late,
    presentPercentage: total > 0 ? (present / total) * 100 : 0,
    absentPercentage: total > 0 ? (absent / total) * 100 : 0,
    latePercentage: total > 0 ? (late / total) * 100 : 0
  };
};

// Generate attendance report for download
export const generateAttendanceReport = (
  students: Student[],
  records: AttendanceRecord[],
  startDate: string,
  endDate: string
): Blob => {
  // Group records by student
  const studentRecordsMap = new Map<string, AttendanceRecord[]>();
  
  records.forEach(record => {
    const { studentId, date } = record;
    if (date >= startDate && date <= endDate) {
      if (!studentRecordsMap.has(studentId)) {
        studentRecordsMap.set(studentId, []);
      }
      studentRecordsMap.get(studentId)!.push(record);
    }
  });
  
  // Create report data
  const reportData = students.map(student => {
    const studentRecords = studentRecordsMap.get(student.id) || [];
    const summary = generateAttendanceSummary(studentRecords);
    
    return {
      'Student Name': student.name,
      'Email': student.email,
      'Class': student.class,
      'Total Sessions': summary.total,
      'Present': summary.present,
      'Absent': summary.absent,
      'Late': summary.late,
      'Attendance %': `${summary.presentPercentage.toFixed(2)}%`
    };
  });
  
  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
  
  // Generate file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Generate sample template for attendance upload
export const generateSampleTemplate = (): Blob => {
  const sampleData = [
    { Name: "John Doe", Email: "john.doe@example.com", Class: "Mathematics 101", Status: "present", Notes: "" },
    { Name: "Jane Smith", Email: "jane.smith@example.com", Class: "Mathematics 101", Status: "absent", Notes: "Sick" }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Template');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
