// Type definitions
export interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type?: string;
  role?: string;
  properties?: string[];
  groups?: string[];
  documents?: string[];
  conversations?: string[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

// Mock data for development
const mockPeople: Person[] = [
  {
    id: "person1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    type: "Tenant",
    role: "Primary",
    properties: ["prop1", "prop2"],
    groups: ["group1"],
    documents: ["doc1", "doc2"],
    conversations: ["conv1"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-03-10T14:45:00Z",
    avatar: "/avatars/john.jpg"
  },
  {
    id: "person2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    type: "Owner",
    role: "Primary",
    properties: ["prop3"],
    groups: ["group2"],
    documents: ["doc3"],
    conversations: ["conv2", "conv3"],
    createdAt: "2025-02-01T09:15:00Z",
    updatedAt: "2025-03-15T11:20:00Z",
    avatar: "/avatars/jane.jpg"
  },
  {
    id: "person3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    type: "Property Manager",
    role: "Assistant",
    properties: ["prop1", "prop3", "prop4"],
    groups: ["group1", "group3"],
    documents: ["doc4", "doc5"],
    conversations: ["conv4"],
    createdAt: "2025-01-20T13:45:00Z",
    updatedAt: "2025-03-12T16:30:00Z",
    avatar: "/avatars/robert.jpg"
  }
];

// API client functions
export const fetchPeople = async (): Promise<Person[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockPeople];
};

export const fetchPersonById = async (id: string): Promise<Person | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const person = mockPeople.find(p => p.id === id);
  return person ? { ...person } : null;
};

export const createPerson = async (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newPerson: Person = {
    id: `person${mockPeople.length + 1}`,
    ...personData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // In a real implementation, this would add to a database
  // For now, we'll just return the new person
  return newPerson;
};

export const updatePerson = async (id: string, personData: Partial<Person>): Promise<Person | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const personIndex = mockPeople.findIndex(p => p.id === id);
  if (personIndex === -1) return null;
  
  // In a real implementation, this would update the database
  // For now, we'll just return the updated person
  const updatedPerson: Person = {
    ...mockPeople[personIndex],
    ...personData,
    updatedAt: new Date().toISOString(),
  };
  
  return updatedPerson;
};

export const deletePerson = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real implementation, this would delete from the database
  // For now, we'll just return success
  return true;
};
