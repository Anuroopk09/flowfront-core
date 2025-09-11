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
    username: 'student1',
    email: 'student1@school.com',
    password: 'student123',
    role: 'student',
    fullName: 'Jane Student',
    address: '789 Learning Ln'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Basic Mathematics Course',
    teacherId: '2',
    batch: 'Batch A',
    students: ['3']
  },
  {
    id: '2',
    name: 'Science',
    description: 'Introduction to Science',
    teacherId: '2',
    batch: 'Batch A',
    students: ['3']
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    userId: '3',
    courses: ['1', '2'],
    batch: 'Batch A',
    attendance: [
      {
        id: '1',
        studentId: '1',
        courseId: '1',
        date: '2024-01-15',
        present: true
      }
    ],
    performance: [
      {
        id: '1',
        studentId: '1',
        courseId: '1',
        assignment: 'Math Test 1',
        score: 85,
        maxScore: 100,
        date: '2024-01-10'
      }
    ]
  }
];

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