# Proptuna

Proptuna is a property management application that helps you manage properties, tenants, documents, and more.

## Project Structure

The project is organized into two main parts:

- `client`: React frontend application
- `server`: Express backend API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install server dependencies:

```bash
cd server
npm install
```

2. Install client dependencies:

```bash
cd client
npm install
```

### Running the Application

You can start both the client and server with a single command from the root directory:

```bash
yarn dev
```

This will start:
- The server on http://localhost:5001
- The client on http://localhost:3000

Or you can start them separately:

1. Start the server:

```bash
cd server
yarn dev
```

2. Start the client:

```bash
cd client
yarn dev
```

## Features

- Property management
- Document management
- Tenant tracking
- AI-powered conversations

## Development Approach

This project follows an incremental refactoring approach:

1. Focus on getting the minimum viable app running first
2. Add components back one by one from the old codebase
3. Ensure each component works properly before moving to the next
4. Take things one step at a time rather than trying to do everything at once
