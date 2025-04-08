
import { createContext, useState, useContext, ReactNode } from "react";

export type Student = {
  id: string;
  name: string;
  email: string;
  class: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
};

export type ClassInfo = {
  id: string;
  name: string;
  studentCount: number;
};

type AttendanceContextType = {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  classes: ClassInfo[];
  addStudents: (newStudents: Student[]) => void;
  addAttendanceRecords: (records: AttendanceRecord[]) => void;
  updateAttendanceRecord: (id: string, status: "present" | "absent" | "late", notes?: string) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getClassAttendance: (classId: string) => { records: AttendanceRecord[], students: Student[] };
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAbsentees: (date: string) => Student[];
};

const AttendanceContext = createContext<AttendanceContextType | null>(null);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "John Doe", email: "john.doe@example.com", class: "Mathematics 101" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com", class: "Mathematics 101" },
    { id: "3", name: "Michael Johnson", email: "michael.j@example.com", class: "Physics 202" },
    { id: "4", name: "Emily Davis", email: "emily.d@example.com", class: "Physics 202" },
    { id: "5", name: "Robert Wilson", email: "robert.w@example.com", class: "Chemistry 303" }
  ]);

  const [classes, setClasses] = useState<ClassInfo[]>([
    { id: "101", name: "Mathematics 101", studentCount: 2 },
    { id: "202", name: "Physics 202", studentCount: 2 },
    { id: "303", name: "Chemistry 303", studentCount: 1 },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: "a1", studentId: "1", date: "2025-04-07", status: "present" },
    { id: "a2", studentId: "2", date: "2025-04-07", status: "absent", notes: "Sick" },
    { id: "a3", studentId: "3", date: "2025-04-07", status: "late", notes: "Traffic" },
    { id: "a4", studentId: "4", date: "2025-04-07", status: "present" },
    { id: "a5", studentId: "5", date: "2025-04-07", status: "present" },
    { id: "a6", studentId: "1", date: "2025-04-06", status: "present" },
    { id: "a7", studentId: "2", date: "2025-04-06", status: "present" },
    { id: "a8", studentId: "3", date: "2025-04-06", status: "absent", notes: "Doctor appointment" },
    { id: "a9", studentId: "4", date: "2025-04-06", status: "present" },
    { id: "a10", studentId: "5", date: "2025-04-06", status: "late", notes: "Bus delay" },
  ]);

  const addStudents = (newStudents: Student[]) => {
    // Avoid duplicates based on ID
    const existingIds = new Set(students.map(s => s.id));
    const uniqueNewStudents = newStudents.filter(s => !existingIds.has(s.id));
    
    setStudents([...students, ...uniqueNewStudents]);
    
    // Update class student counts
    const classCountMap = new Map<string, number>();
    [...students, ...uniqueNewStudents].forEach(student => {
      const currentCount = classCountMap.get(student.class) || 0;
      classCountMap.set(student.class, currentCount + 1);
    });
    
    setClasses(classes.map(c => ({
      ...c,
      studentCount: classCountMap.get(c.name) || c.studentCount
    })));
  };

  const addAttendanceRecords = (records: AttendanceRecord[]) => {
    // Replace existing records for the same student and date
    const existingRecords = new Map(
      attendanceRecords.map(record => [`${record.studentId}-${record.date}`, record])
    );
    
    records.forEach(record => {
      existingRecords.set(`${record.studentId}-${record.date}`, record);
    });
    
    setAttendanceRecords(Array.from(existingRecords.values()));
  };

  const updateAttendanceRecord = (id: string, status: "present" | "absent" | "late", notes?: string) => {
    setAttendanceRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === id ? { ...record, status, notes } : record
      )
    );
  };

  const getStudentAttendance = (studentId: string) => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getClassAttendance = (className: string) => {
    const classStudents = students.filter(student => student.class === className);
    const studentIds = classStudents.map(student => student.id);
    const records = attendanceRecords.filter(record => studentIds.includes(record.studentId));
    return { records, students: classStudents };
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getAbsentees = (date: string) => {
    const absentRecords = attendanceRecords.filter(
      record => record.date === date && record.status === "absent"
    );
    return absentRecords.map(record => 
      students.find(student => student.id === record.studentId)
    ).filter(student => student !== undefined) as Student[];
  };

  const value = {
    students,
    attendanceRecords,
    classes,
    addStudents,
    addAttendanceRecords,
    updateAttendanceRecord,
    getStudentAttendance,
    getClassAttendance,
    getAttendanceByDate,
    getAbsentees
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
