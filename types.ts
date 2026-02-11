
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  outcomes: string[];
  curriculum: {
    section: string;
    topics: string[];
  }[];
  price: string;
  level: 'Top' | 'Middle' | 'Bottom';
}

export interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}
