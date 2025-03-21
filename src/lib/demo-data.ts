/**
 * This file contains consistent demo data for the Proptuna application.
 * Use this data for UI development and demo purposes.
 */

// Properties with consistent details
export const properties = [
  {
    id: "prop-vista-1",
    address: "Vista Ridge",
    unit: "Unit 1",
    city: "Boulder",
    state: "CO",
    zip: "80302",
    type: "Apartment",
    tag: "Residential",
    image: "/images/property-1.jpg",
    tenants: [
      {
        id: "tenant-john",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(303) 555-1234",
        avatar: "/images/avatar-1.jpg"
      }
    ],
    createdAt: "2023-06-10T14:00:00Z",
    updatedAt: "2023-12-15T09:30:00Z"
  },
  {
    id: "prop-vista-2",
    address: "Vista Ridge",
    unit: "Unit 2",
    city: "Boulder",
    state: "CO",
    zip: "80302",
    type: "Apartment",
    tag: "Residential",
    image: "/images/property-2.jpg",
    tenants: [
      {
        id: "tenant-jane",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(303) 555-5678",
        avatar: "/images/avatar-2.jpg"
      }
    ],
    createdAt: "2023-07-05T11:15:00Z",
    updatedAt: "2023-11-20T16:45:00Z"
  },
  {
    id: "prop-woodmoor",
    address: "935 Woodmoor",
    unit: "",
    city: "Denver",
    state: "CO",
    zip: "80202",
    type: "House",
    tag: "Residential",
    image: "/images/property-3.jpg",
    tenants: [
      {
        id: "tenant-robert",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "(303) 555-9012",
        avatar: "/images/avatar-3.jpg"
      }
    ],
    createdAt: "2023-02-18T09:00:00Z",
    updatedAt: "2023-10-05T14:20:00Z"
  }
];

// People with consistent details
export const people = [
  {
    id: "person-john",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(303) 555-1234",
    type: "Tenant",
    role: "Primary",
    property: "Vista Ridge - Unit 1",
    propertyId: "prop-vista-1",
    avatar: "/images/avatar-1.jpg",
    createdAt: "2023-06-10T14:00:00Z",
    updatedAt: "2023-12-15T09:30:00Z"
  },
  {
    id: "person-jane",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(303) 555-5678",
    type: "Tenant",
    role: "Primary",
    property: "Vista Ridge - Unit 2",
    propertyId: "prop-vista-2",
    avatar: "/images/avatar-2.jpg",
    createdAt: "2023-07-05T11:15:00Z",
    updatedAt: "2023-11-20T16:45:00Z"
  },
  {
    id: "person-robert",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(303) 555-9012",
    type: "Tenant",
    role: "Primary",
    property: "935 Woodmoor",
    propertyId: "prop-woodmoor",
    avatar: "/images/avatar-3.jpg",
    createdAt: "2023-02-18T09:00:00Z",
    updatedAt: "2023-10-05T14:20:00Z"
  },
  {
    id: "person-maria",
    name: "Maria Garcia",
    email: "maria.garcia@proptuna.com",
    phone: "(303) 555-3456",
    type: "Staff",
    role: "Property Manager",
    avatar: "/images/avatar-4.jpg",
    createdAt: "2022-11-10T08:00:00Z",
    updatedAt: "2023-09-15T11:30:00Z"
  },
  {
    id: "person-alex",
    name: "Alex Chen",
    email: "alex.chen@proptuna.com",
    phone: "(303) 555-7890",
    type: "Staff",
    role: "Maintenance",
    avatar: "/images/avatar-5.jpg",
    createdAt: "2022-12-05T10:15:00Z",
    updatedAt: "2023-08-20T13:45:00Z"
  }
];

// Documents with consistent details
export const documents = [
  {
    id: "doc-maintenance-101",
    title: "Property Maintenance Guidelines",
    type: "markdown",
    data: "# Property Maintenance Guidelines\n\nThis document outlines the standard procedures for handling maintenance requests at all Proptuna properties.\n\n## Emergency Maintenance\n\nEmergency maintenance issues include:\n- Water leaks that cannot be contained\n- Complete loss of electricity\n- Gas leaks\n- No heat during winter months\n- Air conditioning failure during extreme heat\n- Broken locks on exterior doors\n\nFor these issues, call the emergency maintenance line immediately at (303) 555-0000.\n\n## Standard Maintenance\n\nFor non-emergency maintenance:\n1. Submit a request through the tenant portal\n2. Include detailed description and photos if possible\n3. Specify preferred contact method and availability\n\nStandard maintenance requests are typically addressed within 48 hours.\n\n## Preventative Maintenance\n\nRegular inspections are conducted quarterly to check:\n- HVAC systems\n- Plumbing fixtures\n- Smoke and CO detectors\n- Appliance functionality\n\nTenants will receive notice at least 48 hours before any scheduled maintenance visit.",
    visibility: "external",
    metadata: {
      author: "Maria Garcia",
      created: "2023-04-15T10:00:00Z",
      lastUpdated: "2023-11-10T14:30:00Z",
      version: "2.1"
    },
    created_at: "2023-04-15T10:00:00Z",
    updated_at: "2023-11-10T14:30:00Z",
    version: 2,
    associations: {
      properties: [
        { id: "prop-vista-1", address: "Vista Ridge - Unit 1" },
        { id: "prop-vista-2", address: "Vista Ridge - Unit 2" },
        { id: "prop-woodmoor", address: "935 Woodmoor" }
      ],
      people: [
        { id: "person-maria", name: "Maria Garcia", type: "Staff" },
        { id: "person-alex", name: "Alex Chen", type: "Staff" }
      ],
      tags: [
        { id: "tag-1", name: "Maintenance" },
        { id: "tag-2", name: "Guidelines" }
      ]
    }
  },
  {
    id: "doc-tenant-handbook",
    title: "Tenant Handbook - Maintenance Section",
    type: "pdf",
    data: "PDF content would be here",
    visibility: "external",
    metadata: {
      author: "Maria Garcia",
      created: "2023-03-20T09:00:00Z",
      lastUpdated: "2023-10-05T11:15:00Z",
      version: "1.2"
    },
    created_at: "2023-03-20T09:00:00Z",
    updated_at: "2023-10-05T11:15:00Z",
    version: 1,
    associations: {
      properties: [
        { id: "prop-vista-1", address: "Vista Ridge - Unit 1" },
        { id: "prop-vista-2", address: "Vista Ridge - Unit 2" },
        { id: "prop-woodmoor", address: "935 Woodmoor" }
      ],
      people: [
        { id: "person-john", name: "John Doe", type: "Tenant" },
        { id: "person-jane", name: "Jane Smith", type: "Tenant" },
        { id: "person-robert", name: "Robert Johnson", type: "Tenant" }
      ],
      tags: [
        { id: "tag-2", name: "Guidelines" },
        { id: "tag-3", name: "Tenants" }
      ]
    }
  },
  {
    id: "doc-emergency-protocol",
    title: "Emergency Maintenance Protocols",
    type: "markdown",
    data: "# Emergency Maintenance Protocols\n\n## Definition of Emergency\n\nAn emergency is defined as a situation that presents an immediate risk to health, life, property, or environment.\n\n## Emergency Contact Procedure\n\n1. Call the emergency maintenance line: (303) 555-0000\n2. If no answer, call the property manager: (303) 555-3456\n3. For life-threatening emergencies, call 911 first\n\n## Common Emergency Scenarios\n\n### Water Leaks\n- Turn off water at the source if possible\n- Place containers to catch water\n- Remove valuable items from affected area\n\n### Gas Leaks\n- Evacuate the premises immediately\n- Do not turn on/off any electrical switches\n- Call the gas company from outside the building\n\n### Power Outages\n- Check if outage affects only your unit or the whole building\n- Report to maintenance team\n- Use flashlights, not candles\n\n### HVAC Failures\n- During extreme weather, report immediately\n- Use alternative heating/cooling methods safely\n- Document room temperature\n\n## After-Hours Procedures\n\nAfter regular business hours:\n1. Call the emergency line\n2. Leave detailed message if no answer\n3. Use the online portal to submit ticket\n4. Follow up in the morning if non-life-threatening\n\n## Documentation\n\nAfter any emergency:\n1. Take photos of damage\n2. Note time and date of incident\n3. List any personal property affected\n4. Submit formal report within 24 hours",
    visibility: "internal",
    metadata: {
      author: "Alex Chen",
      created: "2023-05-10T15:30:00Z",
      lastUpdated: "2023-11-25T09:45:00Z",
      version: "1.5"
    },
    created_at: "2023-05-10T15:30:00Z",
    updated_at: "2023-11-25T09:45:00Z",
    version: 1,
    associations: {
      properties: [
        { id: "prop-vista-1", address: "Vista Ridge - Unit 1" },
        { id: "prop-vista-2", address: "Vista Ridge - Unit 2" },
        { id: "prop-woodmoor", address: "935 Woodmoor" }
      ],
      people: [
        { id: "person-maria", name: "Maria Garcia", type: "Staff" },
        { id: "person-alex", name: "Alex Chen", type: "Staff" }
      ],
      tags: [
        { id: "tag-1", name: "Maintenance" },
        { id: "tag-4", name: "Emergency" }
      ]
    }
  },
  {
    id: "doc-lease-terms",
    title: "Standard Lease Agreement Terms",
    type: "pdf",
    data: "PDF content would be here",
    visibility: "external",
    metadata: {
      author: "Maria Garcia",
      created: "2023-01-15T11:00:00Z",
      lastUpdated: "2023-08-20T14:30:00Z",
      version: "2.0"
    },
    created_at: "2023-01-15T11:00:00Z",
    updated_at: "2023-08-20T14:30:00Z",
    version: 2,
    associations: {
      properties: [
        { id: "prop-vista-1", address: "Vista Ridge - Unit 1" },
        { id: "prop-vista-2", address: "Vista Ridge - Unit 2" },
        { id: "prop-woodmoor", address: "935 Woodmoor" }
      ],
      people: [
        { id: "person-john", name: "John Doe", type: "Tenant" },
        { id: "person-jane", name: "Jane Smith", type: "Tenant" },
        { id: "person-robert", name: "Robert Johnson", type: "Tenant" }
      ],
      tags: [
        { id: "tag-5", name: "Legal" },
        { id: "tag-6", name: "Lease" }
      ]
    }
  },
  {
    id: "doc-rental-payment",
    title: "Rental Payment Policies",
    type: "markdown",
    data: "# Rental Payment Policies\n\n## Payment Due Date\n\nRent payments are due on the 1st day of each month. A grace period extends until the 5th day of the month, after which late fees will apply.\n\n## Payment Methods\n\n### Online Portal (Preferred)\n- Log in to your tenant portal at https://portal.proptuna.com\n- Use bank account (ACH) or credit/debit card\n- Set up recurring payments to avoid late fees\n\n### Bank Transfer\n- Use the following account details:\n  - Bank: First National Bank\n  - Account Name: Proptuna Properties LLC\n  - Account Number: XXXX1234\n  - Routing Number: XXXXX5678\n  - Reference: Your property address and unit\n\n### Check or Money Order\n- Make payable to \"Proptuna Properties LLC\"\n- Include your property address and unit number in memo\n- Deliver to management office or mail to:\n  - Proptuna Properties\n  - 123 Main Street\n  - Boulder, CO 80302\n\n## Late Payments\n\n- Late fee of 5% of monthly rent applies after the 5th day of the month\n- Additional $10 per day fee applies after the 10th day\n- Consistent late payments may affect lease renewal eligibility\n\n## Insufficient Funds\n\n- Returned checks or failed electronic payments incur a $35 fee\n- After two returned payments, tenant must use certified funds for six months\n\n## Payment Receipts\n\n- All payments are recorded in the tenant portal\n- For check payments, receipts are provided upon request\n- Year-end payment summaries are provided by January 31st\n\n## Rent Increases\n\n- Rent increases are communicated at least 60 days before lease renewal\n- Standard increases range from 2-5% annually based on market conditions\n- Lease renewals with new rent terms require signature 30 days before current lease expiration",
    visibility: "external",
    metadata: {
      author: "Maria Garcia",
      created: "2023-02-05T13:45:00Z",
      lastUpdated: "2023-09-15T10:30:00Z",
      version: "1.3"
    },
    created_at: "2023-02-05T13:45:00Z",
    updated_at: "2023-09-15T10:30:00Z",
    version: 1,
    associations: {
      properties: [
        { id: "prop-vista-1", address: "Vista Ridge - Unit 1" },
        { id: "prop-vista-2", address: "Vista Ridge - Unit 2" },
        { id: "prop-woodmoor", address: "935 Woodmoor" }
      ],
      people: [
        { id: "person-john", name: "John Doe", type: "Tenant" },
        { id: "person-jane", name: "Jane Smith", type: "Tenant" },
        { id: "person-robert", name: "Robert Johnson", type: "Tenant" }
      ],
      tags: [
        { id: "tag-6", name: "Lease" },
        { id: "tag-7", name: "Payments" }
      ]
    }
  }
];

// AI Conversations with consistent details
export const aiConversations = [
  {
    id: "conv-1",
    state: "in progress",
    overview: "Dishwasher repair request",
    date: "2023-12-15T13:30:00Z",
    property: {
      address: "Vista Ridge",
      unit: "Unit 1",
      city: "Boulder",
      state: "CO",
      zip: "80302",
      type: "Apartment"
    },
    person: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(303) 555-1234"
    },
    conversation: [
      {
        sender: "John Doe",
        message: "My dishwasher isn't draining properly. It leaves water at the bottom after every cycle.",
        timestamp: "2023-12-15T13:30:00Z"
      },
      {
        sender: "AI Assistant",
        message: "I'm sorry to hear about your dishwasher issue. Let me help troubleshoot this. Have you noticed any food debris in the dishwasher drain? Sometimes that can cause drainage problems.",
        timestamp: "2023-12-15T13:31:00Z"
      },
      {
        sender: "John Doe",
        message: "I checked and cleaned the filter already, but it's still not draining.",
        timestamp: "2023-12-15T13:33:00Z"
      },
      {
        sender: "AI Assistant",
        message: "Thank you for checking that. In this case, I'll create a maintenance request for your dishwasher. A technician will be assigned to inspect and repair it within the next 48 hours.",
        timestamp: "2023-12-15T13:34:00Z"
      }
    ],
    tasks: [
      {
        id: "task-1",
        description: "Inspect and repair dishwasher drainage issue at Vista Ridge Unit 1",
        status: "assigned",
        created: "2023-12-15T13:35:00Z",
        createdBy: "AI Assistant",
        notified: ["Alex Chen"]
      }
    ],
    documents: [
      {
        title: "Property Maintenance Guidelines",
        type: "markdown",
        uploadDate: "2023-04-15T10:00:00Z"
      }
    ],
    isLive: true,
    needsAttention: false
  },
  {
    id: "conv-2",
    state: "Attention needed!",
    overview: "Water leak from upstairs bathroom",
    date: "2023-12-16T09:15:00Z",
    property: {
      address: "Vista Ridge",
      unit: "Unit 2",
      city: "Boulder",
      state: "CO",
      zip: "80302",
      type: "Apartment"
    },
    person: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(303) 555-5678"
    },
    conversation: [
      {
        sender: "Jane Smith",
        message: "There's water leaking from my bathroom ceiling! It's coming through the light fixture and I'm worried it could cause electrical issues.",
        timestamp: "2023-12-16T09:15:00Z"
      },
      {
        sender: "AI Assistant",
        message: "This is an emergency situation. I'm creating a high-priority maintenance task immediately. Please turn off the circuit breaker to that bathroom if you can safely do so, and place a bucket to catch the water. A maintenance technician will be dispatched right away.",
        timestamp: "2023-12-16T09:16:00Z"
      }
    ],
    tasks: [
      {
        id: "task-2",
        description: "EMERGENCY: Water leak from ceiling/light fixture at Vista Ridge Unit 2",
        status: "in progress",
        created: "2023-12-16T09:17:00Z",
        createdBy: "AI Assistant",
        notified: ["Alex Chen", "Maria Garcia"]
      }
    ],
    documents: [
      {
        title: "Emergency Maintenance Protocols",
        type: "markdown",
        uploadDate: "2023-05-10T15:30:00Z"
      }
    ],
    isLive: true,
    needsAttention: true,
    suggestedAction: "Maintenance manager review needed for potential damage to multiple units"
  },
  {
    id: "conv-3",
    state: "chat ended",
    overview: "Rental payment question",
    date: "2023-12-10T14:45:00Z",
    property: {
      address: "935 Woodmoor",
      unit: "",
      city: "Denver",
      state: "CO",
      zip: "80202",
      type: "House"
    },
    person: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(303) 555-9012"
    },
    conversation: [
      {
        sender: "Robert Johnson",
        message: "I'm going to be traveling on the 1st next month. Can I make my rent payment early?",
        timestamp: "2023-12-10T14:45:00Z"
      },
      {
        sender: "AI Assistant",
        message: "Absolutely! You can make an early payment through your tenant portal at any time. Early payments are always welcome and will be credited to your account immediately.",
        timestamp: "2023-12-10T14:46:00Z"
      },
      {
        sender: "Robert Johnson",
        message: "Great, thank you! I'll make the payment next week before I leave.",
        timestamp: "2023-12-10T14:48:00Z"
      },
      {
        sender: "AI Assistant",
        message: "You're welcome! That sounds perfect. Your payment will be recorded and you'll receive a confirmation email once it's processed. Have a great trip!",
        timestamp: "2023-12-10T14:49:00Z"
      }
    ],
    documents: [
      {
        title: "Rental Payment Policies",
        type: "markdown",
        uploadDate: "2023-02-05T13:45:00Z"
      }
    ],
    isLive: false,
    needsAttention: false
  },
  {
    id: "conv-4",
    state: "task created",
    overview: "Heating system not working properly",
    date: "2023-12-12T16:20:00Z",
    property: {
      address: "Vista Ridge",
      unit: "Unit 1",
      city: "Boulder",
      state: "CO",
      zip: "80302",
      type: "Apartment"
    },
    person: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(303) 555-1234"
    },
    conversation: [
      {
        sender: "John Doe",
        message: "My heating system isn't working well. It's only getting to about 65 degrees even though I have the thermostat set to 72.",
        timestamp: "2023-12-12T16:20:00Z"
      },
      {
        sender: "AI Assistant",
        message: "I'm sorry to hear that your heating system isn't working properly. Let me ask a few troubleshooting questions. Have you checked if all vents are open and unblocked?",
        timestamp: "2023-12-12T16:21:00Z"
      },
      {
        sender: "John Doe",
        message: "Yes, I've checked all the vents and they're clear. I also changed the filter last month.",
        timestamp: "2023-12-12T16:23:00Z"
      },
      {
        sender: "AI Assistant",
        message: "Thank you for checking those things. Since you've already tried the basic troubleshooting, I'll create a maintenance task for an HVAC technician to inspect your heating system. Someone should contact you within 24 hours to schedule an appointment.",
        timestamp: "2023-12-12T16:24:00Z"
      }
    ],
    tasks: [
      {
        id: "task-3",
        description: "HVAC system inspection and repair at Vista Ridge Unit 1 - heating not reaching set temperature",
        status: "scheduled",
        created: "2023-12-12T16:25:00Z",
        createdBy: "AI Assistant",
        notified: ["Alex Chen"]
      }
    ],
    documents: [
      {
        title: "Property Maintenance Guidelines",
        type: "markdown",
        uploadDate: "2023-04-15T10:00:00Z"
      }
    ],
    isLive: false,
    needsAttention: false
  }
];

// Maintenance tasks with consistent details
export const maintenanceTasks = [
  {
    id: "task-1",
    title: "Dishwasher repair",
    description: "Inspect and repair dishwasher drainage issue at Vista Ridge Unit 1",
    status: "assigned",
    priority: "medium",
    propertyId: "prop-vista-1",
    property: "Vista Ridge - Unit 1",
    created: "2023-12-15T13:35:00Z",
    createdBy: "AI Assistant",
    assignedTo: "Alex Chen",
    scheduledFor: "2023-12-17T10:00:00Z",
    completedAt: null,
    notes: []
  },
  {
    id: "task-2",
    title: "Water leak emergency",
    description: "EMERGENCY: Water leak from ceiling/light fixture at Vista Ridge Unit 2",
    status: "in progress",
    priority: "high",
    propertyId: "prop-vista-2",
    property: "Vista Ridge - Unit 2",
    created: "2023-12-16T09:17:00Z",
    createdBy: "AI Assistant",
    assignedTo: "Alex Chen",
    scheduledFor: "2023-12-16T10:00:00Z",
    completedAt: null,
    notes: [
      {
        text: "Initial inspection complete. Found leak from upstairs bathroom. Turned off water to that unit. Need to assess water damage.",
        timestamp: "2023-12-16T10:30:00Z",
        author: "Alex Chen"
      }
    ]
  },
  {
    id: "task-3",
    title: "HVAC inspection",
    description: "HVAC system inspection and repair at Vista Ridge Unit 1 - heating not reaching set temperature",
    status: "scheduled",
    priority: "medium",
    propertyId: "prop-vista-1",
    property: "Vista Ridge - Unit 1",
    created: "2023-12-12T16:25:00Z",
    createdBy: "AI Assistant",
    assignedTo: "Alex Chen",
    scheduledFor: "2023-12-18T14:00:00Z",
    completedAt: null,
    notes: [
      {
        text: "Scheduled with tenant. Will bring replacement parts for common HVAC issues.",
        timestamp: "2023-12-13T09:15:00Z",
        author: "Alex Chen"
      }
    ]
  },
  {
    id: "task-4",
    title: "Garage door repair",
    description: "Garage door not closing completely at 935 Woodmoor",
    status: "completed",
    priority: "medium",
    propertyId: "prop-woodmoor",
    property: "935 Woodmoor",
    created: "2023-12-08T11:20:00Z",
    createdBy: "Maria Garcia",
    assignedTo: "Alex Chen",
    scheduledFor: "2023-12-09T15:00:00Z",
    completedAt: "2023-12-09T16:15:00Z",
    notes: [
      {
        text: "Adjusted garage door sensors and lubricated tracks. Door now functioning properly.",
        timestamp: "2023-12-09T16:15:00Z",
        author: "Alex Chen"
      }
    ]
  }
];

// Function to get data by ID
export const getPropertyById = (id: string) => {
  return properties.find(property => property.id === id);
};

export const getPersonById = (id: string) => {
  return people.find(person => person.id === id);
};

export const getDocumentById = (id: string) => {
  return documents.find(document => document.id === id);
};

export const getConversationById = (id: string) => {
  return aiConversations.find(conversation => conversation.id === id);
};

export const getTaskById = (id: string) => {
  return maintenanceTasks.find(task => task.id === id);
};
