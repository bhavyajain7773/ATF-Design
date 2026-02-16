
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
}

export interface CartItem extends Course {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Added for Admin Visibility
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
