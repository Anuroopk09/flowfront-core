// Utility functions for the ERP system

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  fullName: string;
  address?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  batch: string;
  students: string[];
}

export interface Student {
  id: string;
  userId: string;
  courses: string[];
  batch: string;
  attendance: AttendanceRecord[];
  performance: PerformanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  present: boolean;
}

export interface PerformanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
}

// Mock data storage (in a real app, this would be a database)
const firstNames = ['Alex', 'Emma', 'Noah', 'Olivia', 'Liam', 'Sophia', 'Ethan', 'Isabella', 'Mason', 'Mia', 'Jacob', 'Charlotte', 'William', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Lucas', 'Abigail', 'Henry', 'Emily', 'Alexander', 'Elizabeth', 'Michael', 'Sofia', 'Daniel', 'Avery', 'Matthew', 'Ella', 'Jackson', 'Madison', 'Sebastian', 'Scarlett', 'Aiden', 'Victoria', 'Samuel', 'Aria', 'David', 'Grace', 'Joseph', 'Chloe', 'Carter', 'Camila', 'Owen', 'Penelope', 'Wyatt', 'Riley', 'John', 'Layla'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const addresses = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Blvd', 'Birch Way', 'Willow Ct', 'Spruce St', 'Ash Ave'];
const batches = ['Batch A', 'Batch B', 'Batch C'];

const generateRandomStudent = (id: number) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${id}`;
  const email = `${username}@school.com`;
  const address = `${Math.floor(Math.random() * 999) + 1} ${addresses[Math.floor(Math.random() * addresses.length)]}`;
  const batch = batches[Math.floor(Math.random() * batches.length)];
  
  return {
    user: {
      id: (id + 3).toString(),
      username,
      email,
      password: 'student123',
      role: 'student' as const,
      fullName,
      address
    },
    student: {
      id: id.toString(),
      userId: (id + 3).toString(),
      courses: ['1', '2'],
      batch,
      attendance: [] as AttendanceRecord[],
      performance: [] as PerformanceRecord[]
    }
  };
};

// Generate 50 random students
const generatedStudents = Array.from({length: 50}, (_, i) => generateRandomStudent(i + 1));

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'System Administrator',
    address: '123 School St'
  },
  {
    id: '2',
    username: 'teacher1',
    email: 'teacher1@school.com',
    password: 'teacher123',
    role: 'teacher',
    fullName: 'John Teacher',
    address: '456 Education Ave'
  },
  {
    id: '3',
    username: 'teacher2',
    email: 'teacher2@school.com',
    password: 'teacher123',
    role: 'teacher',
    fullName: 'Sarah Wilson',
    address: '321 Academy Blvd'
  },
  ...generatedStudents.map(gs => gs.user)
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Algebra, Geometry, and Calculus fundamentals',
    teacherId: '2',
    batch: 'Batch A',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch A').map(gs => gs.student.id)
  },
  {
    id: '2',
    name: 'Science',
    description: 'Physics, Chemistry, and Biology basics',
    teacherId: '2',
    batch: 'Batch A',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch A').map(gs => gs.student.id)
  },
  {
    id: '3',
    name: 'English Literature',
    description: 'Reading, writing, and literary analysis',
    teacherId: '3',
    batch: 'Batch B',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch B').map(gs => gs.student.id)
  },
  {
    id: '4',
    name: 'History',
    description: 'World history and social studies',
    teacherId: '3',
    batch: 'Batch B',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch B').map(gs => gs.student.id)
  },
  {
    id: '5',
    name: 'Computer Science',
    description: 'Programming and digital literacy',
    teacherId: '2',
    batch: 'Batch C',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch C').map(gs => gs.student.id)
  },
  {
    id: '6',
    name: 'Art & Design',
    description: 'Creative arts and visual design',
    teacherId: '3',
    batch: 'Batch C',
    students: generatedStudents.filter(gs => gs.student.batch === 'Batch C').map(gs => gs.student.id)
  }
];

// Generate attendance and performance records for students
const generateAttendanceRecords = (studentId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const courses = ['1', '2', '3', '4', '5', '6'];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let i = 0; i < 20; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    records.push({
      id: `att_${studentId}_${i}`,
      studentId,
      courseId: courses[Math.floor(Math.random() * courses.length)],
      date: randomDate.toISOString().split('T')[0],
      present: Math.random() > 0.15 // 85% attendance rate
    });
  }
  return records;
};

const generatePerformanceRecords = (studentId: string): PerformanceRecord[] => {
  const records: PerformanceRecord[] = [];
  const courses = ['1', '2', '3', '4', '5', '6'];
  const assignments = ['Quiz 1', 'Midterm Exam', 'Project', 'Final Exam', 'Homework 1', 'Homework 2', 'Lab Report', 'Essay'];
  
  for (let i = 0; i < 8; i++) {
    const maxScore = 100;
    const minScore = 60;
    const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
    
    records.push({
      id: `perf_${studentId}_${i}`,
      studentId,
      courseId: courses[Math.floor(Math.random() * courses.length)],
      assignment: assignments[Math.floor(Math.random() * assignments.length)],
      score,
      maxScore,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  return records;
};

// Generate students with attendance and performance data
const studentsWithData = generatedStudents.map(gs => ({
  ...gs.student,
  courses: gs.student.batch === 'Batch A' ? ['1', '2'] : 
           gs.student.batch === 'Batch B' ? ['3', '4'] : ['5', '6'],
  attendance: generateAttendanceRecords(gs.student.id),
  performance: generatePerformanceRecords(gs.student.id)
}));

export const mockStudents: Student[] = studentsWithData;

// Authentication helpers
export const authenticateUser = (username: string, password: string): User | null => {
  return mockUsers.find(user => 
    user.username === username && user.password === password
  ) || null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const hasPermission = (user: User, action: string, resource: string): boolean => {
  if (user.role === 'admin') return true;
  
  if (user.role === 'teacher') {
    if (resource === 'students' && action === 'read') return false;
    return ['create', 'read', 'update', 'delete'].includes(action);
  }
  
  if (user.role === 'student') {
    return action === 'read';
  }
  
  return false;
};