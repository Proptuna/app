# Proptuna Refactoring Plan: Next.js to React + Express with i18n

This document outlines our detailed plan for refactoring the Proptuna application from Next.js to a standard React + Express architecture while adding internationalization (i18n) support. We'll maintain all existing functionality while improving code organization and maintainability.

## Current Progress (March 21, 2025)

### ✅ Completed
- Set up `/client` directory with Vite for React frontend
- Set up `/server` directory with Express backend
- Configure hot reloading for both client and server
- Set up single command to start both client and server
- Configure CORS to allow client-server communication
- Set up basic API endpoints for properties with mock data
- Configure AI controller for conversation management
- **Set up i18n infrastructure**:
  - Created i18n configuration with direct imports of translation files
  - Implemented I18nProvider component for language state management
  - Created LanguageSelector component for switching languages
  - Added translation files for common, sidebar, ai, and properties namespaces
  - Created utility components for translations (TranslatedText)
  - Added date and number formatting utilities for i18n

### 🔄 In Progress
- Porting the UI layout structure from the original app
- Implementing sidebar component with i18n support
- Setting up routing with React Router

### ⏭️ Next Steps
- Add theme control (light/dark mode)
- Continue porting UI components one by one
- Implement feature-specific pages (AI, Properties, People, Documents)

## Project Structure Overview

The refactored application has a clear separation between client and server:

### Client (`/client`)
- React application built with Vite
- Uses React Router for routing
- Implements i18n with react-i18next
- Organized by feature with shared components

### Server (`/server`)
- Express application
- RESTful API endpoints
- Controllers for different features
- Database integration with Supabase

## Core Application Understanding

Proptuna is an AI-powered property management platform with the following key features:

- **AI Chat Interface**: Handles property communication, maintenance issues, and general inquiries
- **Property Management**: Tracks properties, their details, and associations
- **Document Management**: Stores and organizes property-related documents
- **People Management**: Manages tenants, owners, and their contact information
- **AI Conversations Management**: Tracks conversations and related tasks

The application uses Supabase as its database with tables for properties, people, documents, jobs, tasks, conversations, and various association tables.

## Refactoring Approach

We're taking an **incremental approach** to this refactoring:

1. Focus on getting the minimum app running first
2. Add components back one by one from the old codebase
3. Ensure each component works properly before moving to the next
4. Take things one step at a time rather than trying to do everything at once

## Original Component Structure Analysis

### Layout System
- `src/app/layout.tsx`: Main layout component that:
  - Imports global CSS
  - Sets up the basic HTML structure
  - Includes the Sidebar component
  - Wraps the main content area
  - Adds Vercel Analytics

### Navigation System
- `src/app/(components)/sidebar.tsx`: Complex sidebar component that:
  - Uses Next.js Link component for navigation
  - Provides a responsive navigation interface
  - Includes user profile dropdown
  - Uses Lucide icons for visual elements
  - Implements active state styling for current route

### Styling System
- `src/app/globals.css`: Contains:
  - Tailwind directives
  - CSS variables for theming (light/dark mode)
  - Custom styling for markdown content
  - Base styles for the application

### Routing System
- `src/app/page.tsx`: Simple redirect to the AI page
  - Uses Next.js router for navigation
  - Shows a loading spinner during redirect

### Server Controllers
- `server/src/controllers/ai.controller.ts`: Handles AI-related functionality:
  - Manages conversations
  - Processes AI requests
  - Integrates with LLM services
  - Uses a prompt template system

- `server/src/controllers/document.controller.ts`: Handles document management:
  - CRUD operations for documents
  - Document tagging functionality
  - Integration with Supabase

### API Routes
- `server/src/routes/document.routes.ts`: Sets up document-related endpoints:
  - Document CRUD operations
  - Tag management endpoints

## Key Features to Preserve

- **AI Assistant**: Interactive chat interface that can answer questions about properties and create maintenance tasks
- **AI Conversations Management**: Tracks past AI interactions with properties, people, and maintenance tasks
- **Property Management**: Tracks properties, their details, and associations with tenants and documents
- **Document Management**: Stores and organizes property-related documents with tagging and association capabilities
- **People Management**: Manages tenants, owners, and their contact information

## Refactoring Goals

1. **Architecture Change**: Convert from Next.js to React + Express
2. **Internationalization**: Add multi-language support throughout the application
3. **Code Organization**: Break down large components into smaller, more manageable pieces
4. **Maintain Functionality**: Ensure all existing features continue to work
5. **Vercel Deployment**: Ensure the refactored application can be deployed to Vercel

## 1. Internationalization (i18n) Implementation

### Core i18n Infrastructure

- [x] Set up i18next with react-i18next integration
  - [x] Create `/client/src/i18n/index.ts` with configuration
  - [x] Set up language detection using i18next-browser-languagedetector
  - [x] Configure direct imports for translation files
  - [x] Add language switching functionality

- [x] Create translation namespaces for different parts of the application:
  - [x] `common.json`: Shared UI elements, buttons, labels
  - [x] `sidebar.json`: Sidebar navigation items and tooltips
  - [x] `properties.json`: Property management terminology
  - [x] `ai.json`: AI conversation and chat interface
  - [ ] `documents.json`: Document management terms
  - [ ] `people.json`: People management terminology
  - [ ] `tasks.json`: Maintenance and task-related terms

- [x] Create I18nProvider component to wrap the application
  - [x] Add language context provider
  - [x] Implement language detection and persistence
  - [x] Handle language switching

### Translation Files

- [x] Create base English (en) translation files for core namespaces
  - [x] Extract text from existing components
  - [x] Organize by feature area
  - [x] Use nested keys for better organization

- [x] Add French (fr) translations for core namespaces
  - [x] Ensure proper formatting for dates, numbers, etc.
  - [x] Handle pluralization rules

- [x] Implement fallback mechanism for missing translations
  - [x] Default to English for missing keys

### UI Components for Localization

- [x] Create translation utility components:
  - [x] `TranslatedText` component for complex translations with variables
  - [x] Date/time formatting utilities in `dateFormatter.ts`
  - [x] Number formatting utilities in `numberFormatter.ts`

- [x] Build language selector component
  - [x] Add dropdown for language selection
  - [x] Show language options with names
  - [x] Persist selection in localStorage

## 2. UI Migration

### Layout Structure

- [x] Create `/client/src/components/Layout/MainLayout.tsx` based on the original layout
  - [x] Port the basic HTML structure
  - [ ] Add theme provider for light/dark mode
  - [x] Include the sidebar component

- [ ] Port CSS variables from original globals.css to our Tailwind configuration
  - [ ] Maintain the same color scheme
  - [ ] Preserve dark mode support
  - [ ] Keep the custom markdown styling

### Sidebar Component

- [x] Create `/client/src/components/Sidebar/Sidebar.tsx` with the same functionality
  - [x] Port the navigation items with React Router
  - [x] Ensure mobile responsiveness
  - [x] Translate all text content with i18n
  - [x] Implement user profile dropdown

- [ ] Add additional sidebar features:
  - [ ] Collapsible state with persistence
  - [ ] Keyboard shortcuts
  - [ ] Mobile-specific behavior

### Main UI Components

- [ ] Migrate components by feature area:
  - [ ] AI Chat interface components
  - [ ] Property management components
  - [ ] Document management components
  - [ ] People management components
  - [ ] Task and job management components

- [ ] Break down large components into smaller, focused components

## 3. API Migration

- [ ] Set up Express middleware for authentication, logging, and error handling
- [ ] Implement API routes for all features
- [ ] Create services for database interactions
- [ ] Set up controllers for business logic
- [ ] Add validation for API requests
- [ ] Implement error handling and response formatting

## 4. Feature-Specific Migration

### 4.1 AI Chat System

- [ ] Migrate LLM client from Next.js API routes to Express
- [ ] Implement conversation management API
- [ ] Create AI chat UI components with i18n support
- [ ] Add conversation history and management

### 4.2 Property Management

- [ ] Implement property CRUD API
- [ ] Create property listing and detail components
- [ ] Add property filtering and search
- [ ] Implement property association with people and documents

### 4.3 Document Management

- [ ] Implement document CRUD API
- [ ] Create document upload and preview components
- [ ] Add document tagging and categorization
- [ ] Implement document association with properties and people

### 4.4 People Management

- [ ] Implement people CRUD API
- [ ] Create people listing and detail components
- [ ] Add people filtering and search
- [ ] Implement people association with properties and documents

## 5. Testing and Deployment

- [ ] Set up unit tests for components
- [ ] Add integration tests for API endpoints
- [ ] Configure E2E tests for critical user flows
- [ ] Set up CI/CD pipeline
- [ ] Configure Vercel deployment

## 6. Documentation

- [ ] Update README with setup instructions
- [ ] Add API documentation
- [ ] Create component documentation
- [ ] Add translation guide for adding new languages
