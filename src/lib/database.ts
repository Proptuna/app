import supabase from './supabase';

/**
 * Database utility functions for accessing and manipulating data
 */

// Type definitions based on your schema
export interface Account {
  id: string;
  name: string;
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  account_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  account_id: string;
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
  account_id: string;
  address: string;
  type: 'single' | 'multi_family' | 'condo' | 'townhome' | 'commercial';
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  account_id: string;
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

// Account functions
export async function getAccounts() {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) throw error;
  return data as Account[];
}

export async function getAccountById(id: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Account;
}

export async function createAccount(account: Partial<Account>) {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select();
  
  if (error) throw error;
  return data[0] as Account;
}

// Person functions
export async function getPeople(accountId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('account_id', accountId);
  
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
export async function getProperties(accountId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('account_id', accountId);
  
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
export async function getJobs(accountId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('account_id', accountId);
  
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
