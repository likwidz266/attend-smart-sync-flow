import { createContext, useState, useContext, ReactNode } from "react";

export type Student = {
  id: string;
  name: string;
  email: string;
  class: string;
  userId?: string;
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
  linkStudentToUser: (studentId: string, userId: string) => void;
  getStudentByUserId: (userId: string) => Student | undefined;
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
    setStudents(prevStudents => [...prevStudents, ...newStudents]);
    
    const updatedClasses = [...classes];
    
    const classIndices: Record<string, number> = {};
    classes.forEach((c, index) => {
      classIndices[c.name] = index;
    });
    
    newStudents.forEach(student => {
      const className = student.class;
      
      if (className in classIndices) {
        const index = classIndices[className];
        updatedClasses[index] = {
          ...updatedClasses[index],
          studentCount: updatedClasses[index].studentCount + 1
        };
      } else {
        const newClass: ClassInfo = {
          id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: className,
          studentCount: 1
        };
        updatedClasses.push(newClass);
        classIndices[className] = updatedClasses.length - 1;
      }
    });
    
    setClasses(updatedClasses);
  };

  const addAttendanceRecords = (records: AttendanceRecord[]) => {
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

  const linkStudentToUser = (studentId: string, userId: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId ? { ...student, userId } : student
      )
    );
  };

  const getStudentByUserId = (userId: string) => {
    return students.find(student => student.userId === userId);
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
    getAbsentees,
    linkStudentToUser,
    getStudentByUserId
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
