# API Plan

## API Philosophy

Our API will follow these principles:

### 1. RESTful Design

- Follow RESTful conventions and best practices
- Utilize appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate HTTP status codes
- Use plural nouns for resource collections (e.g., `/documents` not `/document`)

### 2. Authentication and Authorization

- Use Clerk for authentication
- Inject organization context from auth tokens
- Enforce data isolation between organizations
- Support role-based access control

### 3. Request/Response Format

- Use JSON for all request and response bodies
- Provide consistent response structures
- Include metadata for pagination and filtering
- Return detailed error messages and codes

### 4. Pagination (Stripe-style)

- Default limit of 10 items per page, maximum of 100
- Use cursor-based pagination with `starting_after` and `ending_before` parameters
- Include `has_more` flag in responses
- Provide `total_count` when available and requested

### 5. Error Handling

- Use standard HTTP status codes
- Include error codes and messages
- Provide actionable error information
- Log detailed errors on the server

## Authentication with Clerk

### Overview

We'll use Clerk for authentication, which provides:
- User management
- Organization/team management
- Multi-factor authentication
- OAuth providers
- Session management

### Integration

1. **Backend Integration**:
   - Install Clerk SDK
   - Set up middleware to verify JWTs from Clerk
   - Extract user and organization information from JWTs

2. **Frontend Integration**:
   - Use Clerk's React components for auth UI
   - Implement sign-in, sign-up, and organization switching

### Local Development with Clerk

For local development, we'll set up a sandbox mode that allows:

1. **Development Environment Detection**:
   - Automatically detect development environment
   - Enable sandbox features based on environment

2. **Sandbox Authentication**:
   - Implement a `/api/v1/auth/sandbox/login` endpoint
   - Allow bypassing Clerk in development
   - Support default credentials for testing

3. **Configuration**:
   - Use environment variables for Clerk API keys
   - Support a `.env.local` file for development settings
   - Allow override of sandbox organization and user

## API Endpoints

### Authentication and Organization Management

#### Base URL
```
/api/v1/auth
/api/v1/organizations
```

#### Authentication Endpoints

##### 1. Get Current User
```
GET /api/v1/auth/me
```

**Description:**
Returns the current authenticated user with organization context.

**Response:**
```json
{
  "id": "uuid",
  "clerk_id": "string",
  "name": "string",
  "primary_email": "string",
  "primary_phone": "string",
  "image_url": "string",
  "role": "admin|manager|maintenance|leasing_agent|support",
  "is_active": boolean,
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "organization": {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "subscription_tier": "string",
    "role": "owner|admin|member"
  }
}
```

##### 2. Development Sandbox Authentication
```
POST /api/v1/auth/sandbox/login
```

**Description:**
Endpoint for local development to bypass Clerk authentication.

**Request Body:**
```json
{
  "organization_id": "uuid", // Optional, will use default if not provided
  "user_id": "uuid" // Optional, will use default if not provided
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    // User details
  },
  "organization": {
    // Organization details
  },
  "dev_mode": true
}
```

#### Organization Endpoints

##### 1. List Organizations (for users with multiple organizations)
```
GET /api/v1/organizations
```

**Description:**
Returns all organizations the current user is a member of.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "primary_domain": "string",
      "image_url": "string",
      "subscription_tier": "string",
      "user_role": "owner|admin|member"
    }
  ],
  "has_more": boolean,
  "total_count": number
}
```

##### 2. Get Organization
```
GET /api/v1/organizations/:id
```

**Description:**
Returns details for a specific organization.

**Response:**
```json
{
  "id": "uuid", 
  "clerk_id": "string",
  "name": "string",
  "slug": "string",
  "primary_domain": "string",
  "status": "active|suspended|trial|canceled",
  "subscription_tier": "string",
  "subscription_expires_at": "timestamp",
  "image_url": "string",
  "settings": {},
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

##### 3. Create Organization
```
POST /api/v1/organizations
```

**Description:**
Creates a new organization and adds the current user as an owner.

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "primary_domain": "string",
  "image_url": "string",
  "settings": {}
}
```

**Response:**
Same as Get Organization

##### 4. Update Organization
```
PUT /api/v1/organizations/:id
```

**Description:**
Updates an existing organization.

**Request Body:**
Same fields as Create Organization

**Response:**
Same as Get Organization

##### 5. List Organization Members
```
GET /api/v1/organizations/:id/members
```

**Description:**
Returns all members of an organization.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "string",
      "email": "string",
      "role": "owner|admin|member",
      "image_url": "string",
      "joined_at": "timestamp"
    }
  ],
  "has_more": boolean,
  "total_count": number
}
```

##### 6. Add Organization Member
```
POST /api/v1/organizations/:id/members
```

**Description:**
Invites a new member to the organization.

**Request Body:**
```json
{
  "email": "string",
  "role": "admin|member"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "email": "string",
  "role": "owner|admin|member",
  "image_url": "string",
  "joined_at": "timestamp",
  "invitation_sent": boolean
}
```

##### 7. Update Organization Member
```
PUT /api/v1/organizations/:id/members/:user_id
```

**Description:**
Updates a member's role in the organization.

**Request Body:**
```json
{
  "role": "admin|member"
}
```

**Response:**
Same as Add Organization Member response

##### 8. Remove Organization Member
```
DELETE /api/v1/organizations/:id/members/:user_id
```

**Description:**
Removes a member from the organization.

**Response:**
```json
{
  "success": true
}
```

## Implementation Plan

### Phase 1: Authentication and Organization Management
- [ ] Setup project structure and dependencies
- [ ] Integrate Clerk SDK
- [ ] Create middleware for JWT verification
- [ ] Implement organization context middleware
- [ ] Create user endpoint (/api/v1/auth/me)
- [ ] Create organization management endpoints
- [ ] Implement sandbox authentication for local development
  - [ ] Add configuration option for auto-login in development
  - [ ] Create middleware to inject default credentials in dev mode
  - [ ] Support environment variable configuration for default org/user
- [ ] Write tests for authentication and organization management

### Setup Instructions for Clerk

1. **Install Dependencies**:
   ```bash
   npm install @clerk/clerk-sdk-node
   # or
   yarn add @clerk/clerk-sdk-node
   ```

2. **Environment Variables**:
   Create a `.env` file with the following variables:
   ```
   CLERK_API_KEY=your_api_key
   CLERK_JWT_KEY=your_jwt_key
   CLERK_FRONTEND_API=your_frontend_api
   DEVELOPMENT_MODE=true
   SANDBOX_ORG_ID=default_org_id
   SANDBOX_USER_ID=default_user_id
   ```

3. **Middleware Setup**:
   ```javascript
   // middleware/auth.js
   const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
   
   // Production auth middleware
   const requireAuth = ClerkExpressRequireAuth({
     // Clerk options
   });
   
   // Development sandbox middleware
   const sandboxAuth = (req, res, next) => {
     if (process.env.DEVELOPMENT_MODE !== 'true') {
       return next(new Error('Sandbox mode only available in development'));
     }
     
     // Get user and org from request or use defaults
     const userId = req.body.user_id || process.env.SANDBOX_USER_ID;
     const orgId = req.body.organization_id || process.env.SANDBOX_ORG_ID;
     
     // Fetch user and org from database
     // Attach to request object
     
     next();
   };
   
   // Combined middleware that chooses based on environment
   const auth = (req, res, next) => {
     if (process.env.DEVELOPMENT_MODE === 'true' && req.path === '/api/v1/auth/sandbox/login') {
       return sandboxAuth(req, res, next);
     }
     
     return requireAuth(req, res, next);
   };
   
   module.exports = { requireAuth, sandboxAuth, auth };
   ```

4. **Organization Context Middleware**:
   ```javascript
   // middleware/organization.js
   const organizationContext = (req, res, next) => {
     // In production, get org ID from Clerk session
     const orgId = req.auth?.orgId || req.body.organization_id;
     
     if (!orgId) {
       return res.status(400).json({ error: 'Organization context required' });
     }
     
     // Fetch organization from database
     // Attach to request
     
     next();
   };
   
   module.exports = { organizationContext };
   ```

5. **Express Setup**:
   ```javascript
   const express = require('express');
   const { auth } = require('./middleware/auth');
   const { organizationContext } = require('./middleware/organization');
   
   const app = express();
   
   // Auth routes (no org context required)
   app.get('/api/v1/auth/me', auth, (req, res) => {
     // Return current user
   });
   
   app.post('/api/v1/auth/sandbox/login', (req, res) => {
     // Handle sandbox login
   });
   
   // Organization routes
   app.use('/api/v1/organizations', auth, organizationContext);
   app.get('/api/v1/organizations', (req, res) => {
     // List organizations
   });
   
   // ... other routes
   ```

This focused implementation gives us a solid foundation for authentication and organization management, which we can build upon as we develop the rest of the API.
