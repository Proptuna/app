-- seed.sql for Supabase
-- This file contains SQL to seed the database with initial data
-- Based on the seed-data.json and converted from TypeScript seed.ts

-- Enable transaction for atomicity
BEGIN;

-- Declare a temp variable
DO $$
DECLARE 
  temp_var UUID;
  org_count INTEGER;
BEGIN

-- Only seed if no data exists
IF (SELECT COUNT(*) FROM documents) = 0 THEN

  -- 2. Create groups
  INSERT INTO groups (name, overview)
  VALUES 
    ('All Properties', 'All properties managed by Sunset Properties'),
    ('Luxury Homes', 'High-end luxury properties'),
    ('All Residents', 'All current residents/tenants'),
    ('Property Managers', 'Staff who manage properties');

  -- 3. Create properties
  INSERT INTO properties (address, type)
  VALUES 
    ('123 Coastal Highway, Seaside, CA 90210', 'multi_family'),
    ('456 Mountain View Road, Highland, CA 90211', 'multi_family'),
    ('789 Sunset Boulevard, Beverly Hills, CA 90212', 'single');

  -- 4. Create people and their contacts
  WITH inserted_people AS (
    INSERT INTO people (name, type)
    VALUES 
      ('John Smith', 'tenant'),
      ('Sarah Johnson', 'tenant'),
      ('David Wilson', 'owner'),
      ('Jennifer Brown', 'owner')
    RETURNING id, name
  )
  -- 5. Create contacts for people
  INSERT INTO contacts (person_id, contact_type, contact_value, is_primary)
  SELECT 
    p.id,
    'email',
    CASE 
      WHEN p.name = 'John Smith' THEN 'john.smith@example.com'
      WHEN p.name = 'Sarah Johnson' THEN 'sarah.johnson@example.com'
      WHEN p.name = 'David Wilson' THEN 'david.wilson@example.com'
      WHEN p.name = 'Jennifer Brown' THEN 'jennifer.brown@example.com'
    END,
    TRUE
  FROM inserted_people p;
  
  -- Add phone for John Smith
  INSERT INTO contacts (person_id, contact_type, contact_value, is_primary)
  SELECT 
    p.id,
    'phone',
    '555-123-4567',
    FALSE
  FROM people p
  WHERE p.name = 'John Smith';

  -- 5.2 Create users (company employees) with Clerk IDs
  INSERT INTO users (name, clerk_id, primary_email, primary_phone, role, image_url)
  VALUES
    ('Michael Chen', 'user_2NeMiGr9wbgJDa7G8zHQr44VCn5', 'michael.chen@sunset-properties.com', '555-111-2222', 'member', 'https://example.com/profile1.jpg'),
    ('Emily Davis', 'user_2NfPEiAbcdSDa7G8zHrTyuQrtl2', 'emily.davis@sunset-properties.com', '555-222-3333', 'member', 'https://example.com/profile2.jpg'),
    ('Robert Johnson', 'user_2OkKtugYvNGfaq4S5MESqpVhUnB', 'robert.johnson@sunset-properties.com', '555-333-4444', 'admin', 'https://example.com/profile3.jpg'),
    ('Sofia Rodriguez', 'user_2NvKkitcZEtwFS3T9UQYPmPTBh9', 'sofia.rodriguez@sunset-properties.com', '555-444-5555', 'member', 'https://example.com/profile4.jpg');

  -- 6. Create documents
  INSERT INTO documents (title, data, type, visibility)
  VALUES
    ('Company Overview', 
     E'# Sunset Properties\n\nWelcome to Sunset Properties, your premier property management company. We are available Monday-Friday from 9am-5pm. For emergencies after hours, please call our emergency line at 555-123-0000.',
     'markdown', 'internal'),
    ('Maintenance Request Guide',
     E'# Maintenance Request Process\n\n1. Submit request through app or call office\n2. Maintenance staff will review within 24 hours\n3. For emergencies (water leaks, no heat, etc.), call emergency line\n4. Expect a follow-up within 48 hours for non-emergency requests',
     'markdown', 'internal'),
    ('Resident Handbook',
     E'# Resident Handbook\n\n## Welcome\nThank you for choosing Sunset Properties as your home.\n\n## Important Contacts\n- Office: 555-123-4567\n- Emergency: 555-123-0000\n- Email: support@sunset-properties.com\n\n## Policies\n1. Rent is due on the 1st of each month\n2. Quiet hours are from 10pm to 8am\n3. Maintenance requests should be submitted through the resident portal\n\n## Amenities\nPlease refer to your specific property guide for amenity information.',
     'markdown', 'external');

  -- 7. Create property-group associations
  -- Get the All Properties group ID
  SELECT id INTO temp_var FROM groups WHERE name = 'All Properties';
  
  -- Associate all properties with the All Properties group
  INSERT INTO property_group_associations (property_id, group_id)
  SELECT id, temp_var FROM properties;
  
  -- Associate luxury property with Luxury Homes group
  SELECT id INTO temp_var FROM groups WHERE name = 'Luxury Homes';
  INSERT INTO property_group_associations (property_id, group_id)
  SELECT id, temp_var FROM properties WHERE address = '789 Sunset Boulevard, Beverly Hills, CA 90212';

  -- 8. Create person-property associations
  WITH 
    john AS (SELECT id FROM people WHERE name = 'John Smith'),
    sarah AS (SELECT id FROM people WHERE name = 'Sarah Johnson'),
    david AS (SELECT id FROM people WHERE name = 'David Wilson'),
    jennifer AS (SELECT id FROM people WHERE name = 'Jennifer Brown'),
    prop1 AS (SELECT id FROM properties WHERE address = '123 Coastal Highway, Seaside, CA 90210'),
    prop2 AS (SELECT id FROM properties WHERE address = '456 Mountain View Road, Highland, CA 90211'),
    prop3 AS (SELECT id FROM properties WHERE address = '789 Sunset Boulevard, Beverly Hills, CA 90212')
  
  INSERT INTO person_property_associations (person_id, property_id)
  SELECT j.id, p1.id FROM john j CROSS JOIN prop1 p1
  UNION ALL
  SELECT s.id, p2.id FROM sarah s CROSS JOIN prop2 p2
  UNION ALL
  SELECT d.id, p3.id FROM david d CROSS JOIN prop3 p3
  UNION ALL
  SELECT j.id, p2.id FROM jennifer j CROSS JOIN prop2 p2;

  -- 10. Create document-group associations
  SELECT id INTO temp_var FROM documents WHERE title = 'Resident Handbook';
  INSERT INTO document_group_associations (document_id, group_id)
  SELECT temp_var, id FROM groups WHERE name = 'All Residents';

  -- 10.1 Create additional documents for leases and agreements
  INSERT INTO documents (title, data, type, visibility)
  VALUES
    ('Residential Lease Agreement - 123 Coastal', 
     E'# Residential Lease Agreement\n\n## Property: 123 Coastal Highway, Seaside, CA 90210\n\nThis agreement is made between Sunset Properties (Landlord) and John Smith (Tenant) for a period of 12 months beginning on January 1, 2025.\n\n## Terms\n- Monthly Rent: $2,500.00\n- Security Deposit: $2,500.00\n- Late Fee: $100.00 if paid after the 5th of the month\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Tenant]',
     'markdown', 'confidential'),
    ('Residential Lease Agreement - 456 Mountain View', 
     E'# Residential Lease Agreement\n\n## Property: 456 Mountain View Road, Highland, CA 90211\n\nThis agreement is made between Sunset Properties (Landlord) and Sarah Johnson (Tenant) for a period of 12 months beginning on February 15, 2025.\n\n## Terms\n- Monthly Rent: $2,200.00\n- Security Deposit: $2,200.00\n- Late Fee: $100.00 if paid after the 5th of the month\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Tenant]',
     'markdown', 'confidential'),
    ('Property Management Agreement - 789 Sunset', 
     E'# Property Management Agreement\n\n## Property: 789 Sunset Boulevard, Beverly Hills, CA 90212\n\nThis agreement is made between Sunset Properties (Manager) and David Williams (Owner) for a period of 24 months beginning on March 1, 2025.\n\n## Terms\n- Management Fee: 8% of monthly rent\n- Leasing Fee: 50% of first month\'s rent\n- Maintenance Reserve: $500.00\n\n## Services Included\n- Rent collection and disbursement\n- Tenant screening and placement\n- Maintenance coordination\n- Monthly financial reporting\n- Annual property inspections\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Owner]',
     'markdown', 'confidential');

  -- 10.2 Create document-property and document-person associations
  -- Get document IDs
  SELECT id INTO temp_var FROM documents WHERE title = 'Residential Lease Agreement - 123 Coastal';
  INSERT INTO document_property_associations (document_id, property_id)
  SELECT temp_var, id FROM properties WHERE address = '123 Coastal Highway, Seaside, CA 90210';
  INSERT INTO document_person_associations (document_id, person_id)
  SELECT temp_var, id FROM people WHERE name = 'John Smith';
  
  SELECT id INTO temp_var FROM documents WHERE title = 'Residential Lease Agreement - 456 Mountain View';
  INSERT INTO document_property_associations (document_id, property_id)
  SELECT temp_var, id FROM properties WHERE address = '456 Mountain View Road, Highland, CA 90211';
  INSERT INTO document_person_associations (document_id, person_id)
  SELECT temp_var, id FROM people WHERE name = 'Sarah Johnson';
  
  SELECT id INTO temp_var FROM documents WHERE title = 'Property Management Agreement - 789 Sunset';
  INSERT INTO document_property_associations (document_id, property_id)
  SELECT temp_var, id FROM properties WHERE address = '789 Sunset Boulevard, Beverly Hills, CA 90212';
  INSERT INTO document_person_associations (document_id, person_id)
  SELECT temp_var, id FROM people WHERE name = 'David Wilson';

  -- 11. Create maintenance escalation policy document
  INSERT INTO documents (title, data, type, visibility)
  VALUES
    ('Maintenance Escalation Policy', 
     E'# Maintenance Escalation Policy\n\n## Standard Maintenance Issues\n\n1. Tenant submits maintenance request\n2. Request is acknowledged within 24 hours\n3. Maintenance team schedules visit within 72 hours for non-emergency issues\n4. Resolution should occur within 7 days\n\n## Emergency Escalation\n\nFor water leaks, HVAC failure in extreme weather, electrical hazards, or security issues:\n\n1. Immediate acknowledgment required\n2. On-site response within 4 hours\n3. If not resolved within 24 hours, alert property manager\n4. If not resolved within 48 hours, alert regional director\n\n## After-Hours Protocol\n\nAfter 5pm and weekends:\n1. Emergency calls routed to on-call technician\n2. On-call technician must respond within 30 minutes\n3. If no response, automatic escalation to backup technician\n4. If urgent issue cannot be resolved, temporary accommodations may be arranged',
     'escalation_policy', 'internal'),
    ('Organization Privacy Policy', 
     E'# Privacy Policy\n\n## Information We Collect\n\nWe collect information from tenants, owners, and visitors including:\n\n- Contact information (name, email, phone)\n- Property details\n- Payment information\n- Communication records\n- Website usage data\n\n## How We Use Information\n\n- To provide property management services\n- To communicate about your property or tenancy\n- To improve our services\n- To comply with legal obligations\n\n## Information Sharing\n\nWe may share information with:\n\n- Property owners (for tenant information)\n- Service providers (maintenance, accounting)\n- Legal and regulatory authorities when required\n\n## Your Rights\n\nYou have the right to:\n\n- Access your personal information\n- Correct inaccurate information\n- Request deletion (with certain limitations)\n- Opt out of marketing communications',
     'policy', 'external');

  -- 12. Create jobs and tasks for maintenance issues
  -- First get the person ID for John Smith
  SELECT id INTO temp_var FROM people WHERE name = 'John Smith';
  
  -- Create job
  INSERT INTO jobs (overview, state, is_active, person_id, property_id)
  SELECT 
    'HVAC repair needed in unit 3B',
    'task_created',
    TRUE,
    temp_var,
    id
  FROM properties 
  WHERE address = '123 Coastal Highway, Seaside, CA 90210'
  RETURNING id INTO temp_var;
  
  -- Create task for the job
  INSERT INTO tasks (job_id, description, task_type, status, priority)
  VALUES (
    temp_var,
    'HVAC system not cooling properly. Tenant reports temperature reaching 85°F during the day.',
    'maintenance_repair',
    'open',
    'high'
  );

END IF;
END $$;

COMMIT;
