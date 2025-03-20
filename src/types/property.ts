export interface Document {
  id: string;
  name: string;
  url: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id?: string;
  address: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  type?: string;
  tag?: string;
  tenants?: Tenant[];
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
}
