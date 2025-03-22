export interface Document {
  id: string;
  name: string;
  url: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface Property {
  id: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  tag?: string;
  tenants: Tenant[];
  documents: Document[];
  jobs?: Job[];
  aiConversations?: AIConversation[];
  escalationPolicy?: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}
