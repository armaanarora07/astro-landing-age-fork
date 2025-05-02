export interface Project {
  name: string;
  description: string;
  tags: string[];
  url: string;
}

export interface Course {
  name: string;
  description: string;
  tags: string[];
}

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  content?: string;
}