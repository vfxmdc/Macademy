import fs from 'fs';
import path from 'path';
import { DBData, AdminUser } from './types';
import { SUPER_ADMIN_SEED } from './app-config';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA: DBData = {
  courses: [
    {
      id: 'crs-1',
      name: 'Full-Stack Web Development Bootcamp',
      category: 'DEVELOPMENT',
      price: 25000,
      description: 'Master HTML, CSS, JavaScript, React & Node.js with hands-on real-world projects.',
      driveUrl: 'https://drive.google.com/drive/folders/1example_fullstack_dev',
      instructor: 'Eng. Sofiane Barka',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'crs-2',
      name: 'UI/UX Design & Figma Mastery',
      category: 'DESIGN',
      price: 18000,
      description: 'Learn modern user experience principles, prototyping, and glassmorphism design trends in Figma.',
      driveUrl: 'https://drive.google.com/drive/folders/1example_uiux_figma',
      instructor: 'Sarah Alami',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'crs-3',
      name: 'Digital Marketing & Social Media Strategy',
      category: 'MARKETING',
      price: 15000,
      description: 'SEO, Facebook/TikTok Ads campaign strategies, and audience targeting for online businesses.',
      driveUrl: 'https://drive.google.com/drive/folders/1example_marketing_mastery',
      instructor: 'Amine Khelifi',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  students: [
    {
      id: 'std-1',
      name: 'John Miller',
      email: 'john.miller@example.com',
      phone: '0555 12 34 56',
      accessCode: 'ABCD-9281',
      progressPercentage: 10,
      enrolledCourseIds: ['crs-1', 'crs-2'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: 'std-2',
      name: 'Fatima Zahra',
      email: 'fatima.z@example.com',
      phone: '0599 59 95 95',
      accessCode: 'POFH-8572',
      progressPercentage: 25,
      enrolledCourseIds: ['crs-1'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: 'std-3',
      name: 'Mohammed Anis',
      email: 'm.anis@example.com',
      phone: '0555 83 63 99',
      accessCode: 'XA98-1042',
      progressPercentage: 30,
      enrolledCourseIds: ['crs-2', 'crs-3'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }
  ],
  quizzes: [
    {
      id: 'qz-1',
      courseId: 'crs-1',
      title: 'JavaScript Core Fundamentals Quiz',
      description: 'Test your knowledge on JS variables, closures, promises, and async/await.',
      questions: [
        {
          id: 'q1',
          question: 'Which keyword is used to declare a block-scoped variable in modern JavaScript?',
          options: ['var', 'let', 'global', 'def'],
          correctOptionIndex: 1
        },
        {
          id: 'q2',
          question: 'What does JSON.stringify() perform?',
          options: ['Parses JSON string', 'Converts JS object to JSON string', 'Compiles code', 'Deletes object'],
          correctOptionIndex: 1
        },
        {
          id: 'q3',
          question: 'What is the default execution model of JavaScript in browsers?',
          options: ['Multi-threaded', 'Single-threaded synchronous event loop', 'Parallel native workers', 'Blocking server process'],
          correctOptionIndex: 1
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'qz-2',
      courseId: 'crs-2',
      title: 'UI/UX Visual Principles & Prototyping Test',
      description: 'Evaluate color hierarchy, micro-interactions, typography and glassmorphism standards.',
      questions: [
        {
          id: 'q1',
          question: 'What visual effect is key to modern Glassmorphism aesthetics?',
          options: ['Heavy dropshadow', 'Backdrop blur with subtle white border', 'Flat solid gray fill', 'Gradient text outline'],
          correctOptionIndex: 1
        },
        {
          id: 'q2',
          question: 'What is the recommended maximum line length for readable web typography?',
          options: ['20-30 characters', '45-75 characters', '120-150 characters', 'Unlimited width'],
          correctOptionIndex: 1
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  submissions: [],
  admins: [
    {
      id: SUPER_ADMIN_SEED.id,
      name: SUPER_ADMIN_SEED.name,
      code: SUPER_ADMIN_SEED.code,
      isSuperAdmin: true,
      createdAt: new Date().toISOString()
    }
  ]
};

// Database helper
export function getDb(): DBData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(content);
    // Ensure all academy keys exist
    if (!data.courses || !data.students) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    // Migrate: if no admins array yet, seed it
    if (!data.admins || data.admins.length === 0) {
      data.admins = INITIAL_DATA.admins;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    return {
      courses: data.courses || INITIAL_DATA.courses,
      students: data.students || INITIAL_DATA.students,
      quizzes: data.quizzes || INITIAL_DATA.quizzes,
      submissions: data.submissions || INITIAL_DATA.submissions,
      admins: data.admins || INITIAL_DATA.admins,
    };
  } catch (error) {
    console.error('Error reading DB:', error);
    return INITIAL_DATA;
  }
}

export function saveDb(data: DBData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving DB:', error);
  }
}

// Generate random student access code format: AB12 or ABCD-9281
export function generateAccessCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += letters.charAt(Math.floor(Math.random() * letters.length));
    part2 += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return `${part1}-${part2}`;
}
