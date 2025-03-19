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

-- Check if there are already organizations
SELECT COUNT(*) INTO org_count FROM organizations;
  
-- Only seed if no organizations exist
IF org_count = 0 THEN

  -- Create organization (combines previous account + org)
  INSERT INTO organizations (
    name, 
    clerk_id, 
    slug, 
    primary_domain, 
    status, 
    subscription_tier, 
    image_url,
    settings
  )
  VALUES (
    'Sunset Properties', 
    'org_2jkl3j4k234jl', 
    'sunset-properties', 
    'sunset-properties.com', 
    'active', 
    'professional', 
    'https://example.com/org-logo.png',
    '{"theme": "light", "defaultView": "groups"}'::jsonb
  )
  RETURNING id INTO temp_var;

  -- 2. Create groups
  INSERT INTO groups (organization_id, name, overview)
  VALUES 
    (temp_var, 'All Properties', 'All properties managed by Sunset Properties'),
    (temp_var, 'Luxury Homes', 'High-end luxury properties'),
    (temp_var, 'All Residents', 'All current residents/tenants'),
    (temp_var, 'Property Managers', 'Staff who manage properties');

  -- 3. Create properties
  INSERT INTO properties (organization_id, address, type)
  VALUES 
    (temp_var, '123 Coastal Highway, Seaside, CA 90210', 'multi_family'),
    (temp_var, '456 Mountain View Road, Highland, CA 90211', 'multi_family'),
    (temp_var, '789 Sunset Boulevard, Beverly Hills, CA 90212', 'single');

  -- 4. Create people and their contacts
  WITH inserted_people AS (
    INSERT INTO people (organization_id, name, type)
    VALUES 
      (temp_var, 'John Smith', 'tenant'),
      (temp_var, 'Sarah Johnson', 'tenant'),
      (temp_var, 'David Wilson', 'owner'),
      (temp_var, 'Jennifer Brown', 'owner')
    RETURNING id, name
  )
  -- 5. Create contacts for people
  INSERT INTO contacts (organization_id, person_id, contact_type, contact_value, is_primary)
  SELECT 
    temp_var,
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
  INSERT INTO contacts (organization_id, person_id, contact_type, contact_value, is_primary)
  SELECT 
    temp_var,
    p.id,
    'phone',
    '555-123-4567',
    FALSE
  FROM people p
  WHERE p.organization_id = temp_var AND p.name = 'John Smith';

  -- 5.2 Create users (company employees) with Clerk IDs
  INSERT INTO users (organization_id, name, clerk_id, primary_email, primary_phone, role, image_url)
  VALUES
    (temp_var, 'Michael Chen', 'user_2NeMiGr9wbgJDa7G8zHQr44VCn5', 'michael.chen@sunset-properties.com', '555-111-2222', 'manager', 'https://example.com/profile1.jpg'),
    (temp_var, 'Emily Davis', 'user_2NfPEiAbcdSDa7G8zHrTyuQrtl2', 'emily.davis@sunset-properties.com', '555-222-3333', 'maintenance', 'https://example.com/profile2.jpg'),
    (temp_var, 'Robert Johnson', 'user_2OkKtugYvNGfaq4S5MESqpVhUnB', 'robert.johnson@sunset-properties.com', '555-333-4444', 'admin', 'https://example.com/profile3.jpg'),
    (temp_var, 'Sofia Rodriguez', 'user_2NvKkitcZEtwFS3T9UQYPmPTBh9', 'sofia.rodriguez@sunset-properties.com', '555-444-5555', 'leasing_agent', 'https://example.com/profile4.jpg');

  -- 5.3 Create organization memberships
  WITH 
    michael AS (SELECT id FROM users WHERE organization_id = temp_var AND clerk_id = 'user_2NeMiGr9wbgJDa7G8zHrTyuQrtl2'),
    emily AS (SELECT id FROM users WHERE organization_id = temp_var AND clerk_id = 'user_2NfPEiAbcdSDa7G8zHrTyuQrtl2'),
    robert AS (SELECT id FROM users WHERE organization_id = temp_var AND clerk_id = 'user_2OkKtugYvNGfaq4S5MESqpVhUnB'),
    sofia AS (SELECT id FROM users WHERE organization_id = temp_var AND clerk_id = 'user_2NvKkitcZEtwFS3T9UQYPmPTBh9')
  
  INSERT INTO organization_memberships (organization_id, user_id, role)
  SELECT temp_var, r.id, 'owner' FROM robert r
  UNION ALL
  SELECT temp_var, m.id, 'admin' FROM michael m
  UNION ALL
  SELECT temp_var, e.id, 'member' FROM emily e
  UNION ALL
  SELECT temp_var, s.id, 'member' FROM sofia s;

  -- 6. Create documents
  INSERT INTO documents (organization_id, title, data, type, visibility)
  VALUES
    (temp_var, 'Company Overview', 
     E'# Sunset Properties\n\nWelcome to Sunset Properties, your premier property management company. We are available Monday-Friday from 9am-5pm. For emergencies after hours, please call our emergency line at 555-123-0000.',
     'markdown', 'internal'),
    (temp_var, 'Maintenance Request Guide',
     E'# Maintenance Request Process\n\n1. Submit request through app or call office\n2. Maintenance staff will review within 24 hours\n3. For emergencies (water leaks, no heat, etc.), call emergency line\n4. Expect a follow-up within 48 hours for non-emergency requests',
     'markdown', 'internal'),
    (temp_var, 'Resident Handbook',
     E'# Resident Handbook\n\n## Welcome\nThank you for choosing Sunset Properties as your home.\n\n## Important Contacts\n- Office: 555-123-4567\n- Emergency: 555-123-0000\n- Email: support@sunset-properties.com\n\n## Policies\n1. Rent is due on the 1st of each month\n2. Quiet hours are from 10pm to 8am\n3. Maintenance requests should be submitted through the resident portal\n\n## Amenities\nPlease refer to your specific property guide for amenity information.',
     'markdown', 'external');

  -- 7. Create property-group associations
  WITH 
    all_props_group AS (SELECT id FROM groups WHERE organization_id = temp_var AND name = 'All Properties'),
    luxury_group AS (SELECT id FROM groups WHERE organization_id = temp_var AND name = 'Luxury Homes'),
    prop1 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '123 Coastal Highway, Seaside, CA 90210'),
    prop2 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '456 Mountain View Road, Highland, CA 90211'),
    prop3 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '789 Sunset Boulevard, Beverly Hills, CA 90212')
  
  INSERT INTO property_group_associations (organization_id, property_id, group_id)
  SELECT temp_var, p.id, g.id
  FROM all_props_group g
  CROSS JOIN (
    SELECT id FROM prop1
    UNION ALL SELECT id FROM prop2
    UNION ALL SELECT id FROM prop3
  ) p
  UNION ALL
  SELECT temp_var, p3.id, g.id
  FROM luxury_group g
  CROSS JOIN prop3 p3;

  -- 8. Create person-property associations
  WITH 
    john AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'John Smith'),
    sarah AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'Sarah Johnson'),
    david AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'David Wilson'),
    jennifer AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'Jennifer Brown'),
    prop1 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '123 Coastal Highway, Seaside, CA 90210'),
    prop2 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '456 Mountain View Road, Highland, CA 90211'),
    prop3 AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '789 Sunset Boulevard, Beverly Hills, CA 90212')
  
  INSERT INTO person_property_associations (organization_id, person_id, property_id)
  SELECT temp_var, j.id, p1.id FROM john j CROSS JOIN prop1 p1
  UNION ALL
  SELECT temp_var, s.id, p2.id FROM sarah s CROSS JOIN prop2 p2
  UNION ALL
  SELECT temp_var, d.id, p3.id FROM david d CROSS JOIN prop3 p3
  UNION ALL
  SELECT temp_var, j.id, p2.id FROM jennifer j CROSS JOIN prop2 p2;

  -- 10. Create document-group associations
  WITH 
    resident_handbook AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Resident Handbook'),
    residents_group AS (SELECT id FROM groups WHERE organization_id = temp_var AND name = 'All Residents')
  
  INSERT INTO document_group_associations (organization_id, document_id, group_id)
  SELECT temp_var, d.id, g.id
  FROM resident_handbook d
  CROSS JOIN residents_group g;

  -- 10.1 Create additional documents for leases and agreements
  INSERT INTO documents (organization_id, title, data, type, visibility)
  VALUES
    (temp_var, 'Residential Lease Agreement - 123 Coastal', 
     E'# Residential Lease Agreement\n\n## Property: 123 Coastal Highway, Seaside, CA 90210\n\nThis agreement is made between Sunset Properties (Landlord) and John Smith (Tenant) for a period of 12 months beginning on January 1, 2025.\n\n## Terms\n- Monthly Rent: $2,500.00\n- Security Deposit: $2,500.00\n- Late Fee: $100.00 if paid after the 5th of the month\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Tenant]',
     'markdown', 'confidential'),
    (temp_var, 'Residential Lease Agreement - 456 Mountain View', 
     E'# Residential Lease Agreement\n\n## Property: 456 Mountain View Road, Highland, CA 90211\n\nThis agreement is made between Sunset Properties (Landlord) and Sarah Johnson (Tenant) for a period of 12 months beginning on February 15, 2025.\n\n## Terms\n- Monthly Rent: $2,200.00\n- Security Deposit: $2,200.00\n- Late Fee: $100.00 if paid after the 5th of the month\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Tenant]',
     'markdown', 'confidential'),
    (temp_var, 'Property Management Agreement - 789 Sunset', 
     E'# Property Management Agreement\n\n## Property: 789 Sunset Boulevard, Beverly Hills, CA 90212\n\nThis agreement is made between Sunset Properties (Manager) and David Williams (Owner) for a period of 24 months beginning on March 1, 2025.\n\n## Terms\n- Management Fee: 8% of monthly rent\n- Leasing Fee: One month''s rent for new tenants\n- Renewal Fee: $500 for lease renewals\n\n## Services Included\n- Rent collection and accounting\n- Property maintenance coordination\n- Tenant relations and issue resolution\n- Monthly and annual financial reporting\n\n## Signatures\n\n[Signature: Property Manager] [Signature: Owner]',
     'markdown', 'confidential');

  -- 10.2 Create document-person associations (leases for tenants, agreements for owners)
  WITH 
    john AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'John Smith'),
    sarah AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'Sarah Johnson'),
    david AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'David Wilson'),
    lease1 AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Residential Lease Agreement - 123 Coastal'),
    lease2 AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Residential Lease Agreement - 456 Mountain View'),
    agreement AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Property Management Agreement - 789 Sunset')
  
  INSERT INTO document_person_associations (organization_id, document_id, person_id, metadata)
  SELECT temp_var, l.id, p.id, '{"start_date": "2025-01-01", "end_date": "2026-01-01", "monthly_rent": 2500.00}'::jsonb
  FROM lease1 l CROSS JOIN john p
  UNION ALL
  SELECT temp_var, l.id, p.id, '{"start_date": "2025-02-15", "end_date": "2026-02-15", "monthly_rent": 2200.00}'::jsonb
  FROM lease2 l CROSS JOIN sarah p
  UNION ALL
  SELECT temp_var, a.id, p.id, '{"start_date": "2025-03-01", "end_date": "2027-03-01", "management_fee": 0.08}'::jsonb
  FROM agreement a CROSS JOIN david p;

  -- 10.3 Create organization-wide documents like escalation policies
  INSERT INTO documents (organization_id, title, data, type, visibility)
  VALUES
    (temp_var, 'Maintenance Escalation Policy', 
     E'# Maintenance Escalation Policy\n\n## Standard Maintenance Issues\n\n1. Tenant submits maintenance request\n2. Request is acknowledged within 24 hours\n3. Maintenance team schedules visit within 72 hours for non-emergency issues\n4. Resolution should occur within 7 days\n\n## Emergency Escalation\n\nFor water leaks, HVAC failure in extreme weather, electrical hazards, or security issues:\n\n1. Immediate acknowledgment required\n2. On-site response within 4 hours\n3. If not resolved within 24 hours, alert property manager\n4. If not resolved within 48 hours, alert regional director\n\n## After-Hours Protocol\n\nAfter 5pm and weekends:\n1. Emergency calls routed to on-call technician\n2. On-call technician must respond within 30 minutes\n3. If no response, automatic escalation to backup technician\n4. If urgent issue cannot be resolved, temporary accommodations may be arranged',
     'escalation_policy', 'internal'),
    (temp_var, 'Organization Privacy Policy', 
     E'# Privacy Policy\n\nSunset Properties is committed to protecting the privacy of our tenants, owners, and employees. This policy outlines how we collect, use, and safeguard your personal information.\n\n## Information Collection\n\nWe collect information such as names, contact details, payment information, and communication records solely for business purposes.\n\n## Information Use\n\nYour information is used to:\n- Manage your lease or property\n- Process payments\n- Address maintenance and service requests\n- Comply with legal obligations\n\n## Information Sharing\n\nWe do not sell your personal information. We may share information with service providers who help us operate our business, always under strict confidentiality agreements.',
     'markdown', 'external');

  -- 10.4 Associate documents with the organization
  WITH 
    escalation_policy AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Maintenance Escalation Policy'),
    privacy_policy AS (SELECT id FROM documents WHERE organization_id = temp_var AND title = 'Organization Privacy Policy')
  
  INSERT INTO document_organization_associations (organization_id, document_id, metadata)
  SELECT temp_var, e.id, '{"effective_date": "2025-01-01", "review_date": "2026-01-01", "approved_by": "Management Team"}'::jsonb
  FROM escalation_policy e
  UNION ALL
  SELECT temp_var, p.id, '{"effective_date": "2025-01-15", "review_date": "2026-01-15", "version": "1.0"}'::jsonb
  FROM privacy_policy p;

  -- 11. Create sample job and associate conversation with it
  WITH 
    property_id AS (SELECT id FROM properties WHERE organization_id = temp_var AND address = '123 Coastal Highway, Seaside, CA 90210'),
    person_id AS (SELECT id FROM people WHERE organization_id = temp_var AND name = 'John Smith'),
    user_id AS (SELECT id FROM users WHERE organization_id = temp_var AND clerk_id = 'user_2NfPEiAbcdSDa7G8zHrTyuQrtl2'), -- Emily Davis
    inserted_job AS (
      INSERT INTO jobs (organization_id, overview, person_id, property_id, state, assigned_user_id)
      SELECT 
        temp_var, 
        'Water leak in bathroom sink', 
        p.id, 
        prop.id,
        'conversation_ongoing',
        u.id
      FROM person_id p, property_id prop, user_id u
      RETURNING id
    ),
    inserted_conv AS (
      INSERT INTO conversations (organization_id, status, is_human_takeover, job_id, medium_type, medium_id)
      SELECT
        temp_var,
        'completed',
        FALSE,
        j.id,
        'phone_call',
        '555-123-4567'
      FROM inserted_job j
      RETURNING id
    )
  
  INSERT INTO messages (organization_id, conversation_id, role, content)
  SELECT 
    temp_var,
    c.id,
    'user',
    'There is a water leak in my apartment at 123 Coastal Highway. The bathroom sink is leaking.'
  FROM inserted_conv c
  UNION ALL
  SELECT 
    temp_var,
    c.id,
    'assistant',
    'I understand you have a water leak in your bathroom sink. I''ll create a maintenance request for this issue. Is there any water damage to the floor or cabinets?'
  FROM inserted_conv c
  UNION ALL
  SELECT 
    temp_var,
    c.id,
    'user',
    'Yes, the cabinet under the sink is getting wet, but I put a bucket there for now.'
  FROM inserted_conv c;

  -- 12. Create a maintenance task for the job
  WITH job_id AS (SELECT id FROM jobs WHERE organization_id = temp_var AND overview = 'Water leak in bathroom sink')
  
  INSERT INTO tasks (organization_id, job_id, description, task_type, status, priority)
  SELECT
    temp_var,
    j.id,
    'Fix leaking sink in bathroom at 123 Coastal Highway, Unit 101. Cabinet has water damage.',
    'maintenance',
    'open',
    'high'
  FROM job_id j;

END IF;
END $$;

COMMIT;
