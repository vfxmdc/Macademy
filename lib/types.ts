export type CourseCategory = 'DEVELOPMENT' | 'DESIGN' | 'BUSINESS' | 'MARKETING' | 'OTHER';

export interface Course {
  id: string;
  name: string;
  category: CourseCategory;
  price: number;
  description: string;
  driveUrl: string; // Google Drive link for course materials
  instructor: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  accessCode: string;
  progressPercentage: number; // e.g. 10 to 30 or higher
  enrolledCourseIds: string[];
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  studentName: string;
  quizId: string;
  courseId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  code: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface DBData {
  courses: Course[];
  students: Student[];
  quizzes: Quiz[];
  submissions: QuizSubmission[];
  admins: AdminUser[];
}
