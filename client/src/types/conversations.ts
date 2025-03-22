export interface Property {
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  manager?: string;
  image?: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;  
  avatar?: string;
}

export interface Message {
  role: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string;
  dueDate: string;
  created: string;  
  createdBy: string;  
  notified: string[];
  photos: string[];
}

export interface Document {
  id: string;
  title: string;
  type: string;
  url: string;
  size: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  state: string;
  overview: string;
  date: string;
  property?: Property;
  person?: Contact;
  messages: Message[];
  tasks: Task[];
  documents: Document[];
  needsAttention?: boolean;
  suggestedAction?: string;
  isLive?: boolean;
}
