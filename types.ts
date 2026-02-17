
export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  videoUrl?: string; // Supports base64 or external URLs
}

export interface CourseQuiz {
  id: string;
  moduleId?: string; // Links the quiz to a specific Video/Module
  question: string;
  options: string[];
  correct: number;
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  outcomes: string[];
  curriculum: {
    section: string;
    topics: string[];
  }[];
  price: number;
  level: 'Top' | 'Middle' | 'Bottom';
  videos?: CourseVideo[];
  quizzes?: CourseQuiz[];
}

export interface CartItem extends Course {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: Course[];
  total: number;
  discount?: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Enrolled';
  paymentMethod: string;
  trackingNumber: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  coursePopularity: { [key: string]: number };
}

export interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}
