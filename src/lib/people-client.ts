/**
 * Client-side people service for interacting with the People API
 */

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type?: string; // tenant, owner, manager, etc.
  role?: string; // admin, manager, maintenance, etc.
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  associations?: {
    properties?: Array<{ id: string; address: string }>;
    groups?: Array<{ id: string; name: string }>;
  };
}

export interface PersonListResponse {
  data: Person[];
  has_more: boolean;
  total_count?: number;
}

/**
 * Fetch a list of people
 * Note: Currently using mock data, will be replaced with actual API call
 */
export async function fetchPeople(): Promise<PersonListResponse> {
  // Mock data for now - will be replaced with actual API call
  const mockPeople: Person[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      type: "owner",
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      associations: {
        properties: [
          { id: "prop1", address: "123 Main St" },
          { id: "prop2", address: "456 Oak Ave" }
        ],
        groups: [
          { id: "group1", name: "Vista Ridge Group" }
        ]
      }
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      type: "tenant",
      role: "manager",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      associations: {
        properties: [
          { id: "prop3", address: "935 Woodmoor" }
        ]
      }
    },
    {
      id: "3",
      name: "Property Management Inc.",
      email: "contact@propmanagement.com",
      phone: "(555) 555-5555",
      type: "pm",
      role: "leasing_agent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      associations: {
        properties: [
          { id: "prop1", address: "123 Main St" },
          { id: "prop2", address: "456 Oak Ave" },
          { id: "prop3", address: "935 Woodmoor" }
        ]
      }
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    data: mockPeople,
    has_more: false,
    total_count: mockPeople.length
  };
}

/**
 * Fetch a single person by ID
 */
export async function fetchPersonById(id: string): Promise<Person> {
  console.log(`Client: Fetching person with ID: ${id}`);
  
  // For now, use mock data
  const people = await fetchPeople();
  const person = people.data.find(p => p.id === id);
  
  if (!person) {
    throw new Error(`Person with ID ${id} not found`);
  }
  
  return person;
}

/**
 * Create a new person
 */
export async function createPerson(person: {
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  role?: string;
  metadata?: Record<string, any>;
  associations?: {
    property_ids?: string[];
    group_ids?: string[];
  };
}): Promise<Person> {
  console.log("Creating person:", person);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPerson: Person = {
    id: `new-${Date.now()}`,
    name: person.name,
    email: person.email,
    phone: person.phone,
    type: person.type,
    role: person.role,
    metadata: person.metadata || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return newPerson;
}

/**
 * Update an existing person
 */
export async function updatePerson(
  id: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    type?: string;
    role?: string;
    metadata?: Record<string, any>;
  }
): Promise<Person> {
  console.log(`Updating person with ID ${id}:`, updates);
  
  // Mock implementation - would be replaced with actual API call
  const person = await fetchPersonById(id);
  
  // Apply updates
  const updatedPerson: Person = {
    ...person,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return updatedPerson;
}

/**
 * Delete a person
 */
export async function deletePerson(id: string): Promise<{ success: boolean; id: string }> {
  console.log(`Deleting person with ID ${id}`);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    id
  };
}

/**
 * Associate a person with a property
 */
export async function associatePersonWithProperty(
  personId: string,
  propertyId: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  console.log(`Associating person ${personId} with property ${propertyId}`);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    person_id: personId,
    property_id: propertyId
  };
}

/**
 * Associate a person with a group
 */
export async function associatePersonWithGroup(
  personId: string,
  groupId: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  console.log(`Associating person ${personId} with group ${groupId}`);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    person_id: personId,
    group_id: groupId
  };
}

/**
 * Remove association between a person and a property
 */
export async function disassociatePersonFromProperty(
  personId: string,
  propertyId: string
): Promise<{ success: boolean }> {
  console.log(`Removing association between person ${personId} and property ${propertyId}`);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
}

/**
 * Remove association between a person and a group
 */
export async function disassociatePersonFromGroup(
  personId: string,
  groupId: string
): Promise<{ success: boolean }> {
  console.log(`Removing association between person ${personId} and group ${groupId}`);
  
  // Mock implementation - would be replaced with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
}
