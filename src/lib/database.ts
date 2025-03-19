import supabase from './supabase';

/**
 * Database utility functions for accessing and manipulating data
 */

// Type definitions based on your schema
export interface Organization {
  id: string;
  name: string;
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  organization_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  person_id: string;
  contact_type: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'other';
  contact_value: string;
  is_primary: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  organization_id: string;
  address: string;
  type: 'single' | 'multi_family' | 'condo' | 'townhome' | 'commercial';
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  organization_id: string;
  overview: string;
  state: 'conversation_ongoing' | 'convo_ended' | 'task_created' | 'escalation_needed' | 'escalation_resolved';
  is_active: boolean;
  history: any[];
  person_id?: string;
  property_id?: string;
  group_id?: string;
  conversation_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Organization functions
export async function getOrganizations() {
  const { data, error } = await supabase.from('organizations').select('*');
  if (error) throw error;
  return data as Organization[];
}

export async function getOrganizationById(id: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Organization;
}

export async function createOrganization(organization: Partial<Organization>) {
  const { data, error } = await supabase
    .from('organizations')
    .insert(organization)
    .select();
  
  if (error) throw error;
  return data[0] as Organization;
}

// Person functions
export async function getPeople(organizationId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('organization_id', organizationId);
  
  if (error) throw error;
  return data as Person[];
}

export async function getPersonById(id: string) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Person;
}

export async function createPerson(person: Partial<Person>) {
  const { data, error } = await supabase
    .from('people')
    .insert(person)
    .select();
  
  if (error) throw error;
  return data[0] as Person;
}

// Property functions
export async function getProperties(organizationId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organization_id', organizationId);
  
  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Property;
}

export async function createProperty(property: Partial<Property>) {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select();
  
  if (error) throw error;
  return data[0] as Property;
}

// Job functions
export async function getJobs(organizationId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('organization_id', organizationId);
  
  if (error) throw error;
  return data as Job[];
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Job;
}

export async function createJob(job: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select();
  
  if (error) throw error;
  return data[0] as Job;
}

export async function updateJob(id: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Job;
}
