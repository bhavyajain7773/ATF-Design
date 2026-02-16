
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  outcomes: string[];
  curriculum: {
    section: string;
    topics: string[];
  }[];
  price: number; // Changed to number for calculations
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
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Course[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Enrolled';
  paymentMethod: string;
  trackingNumber: string;
}

export interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}
