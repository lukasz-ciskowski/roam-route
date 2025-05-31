# Tech Stack - RoamRoute

## Frontend Architecture

### Core Framework
- **Astro 5** - Static site generator with island architecture for optimal performance
- **Angular 19 (AnalogJS)** - Interactive components using standalone architecture
- **TypeScript 5** - Type-safe development across the entire application

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework for responsive design
- **Angular Material** - Component library for consistent UI patterns
- **Custom CSS** - Application-specific styling and theming

### State Management & Reactivity
- **Angular Signals** - Modern reactive state management
- **Nanostores** - Shared state between Astro islands
- **Reactive Forms** - Form handling with validation

## Backend Services

### Authentication & Database
- **Firebase Authentication** - Secure user authentication with Google sign-in
- **Firebase Firestore** - NoSQL database for storing shared routes and user data
- **Firebase Admin SDK** - Server-side Firebase operations

### AI & Machine Learning
- **Google Gemini AI (Genkit)** - Conversational AI for route planning
  - `gemini15Flash` - Primary model for route generation
  - `gemini25ProExp0325` - Alternative model configuration
- **Custom AI Contexts** - Specialized prompts for travel assistance and route descriptions

### API & Actions
- **Astro Actions** - Server-side API endpoints with type safety
- **Zod Validation** - Runtime type checking and validation

## Map & Visualization

### Mapping Technology
- **Leaflet** - Interactive map library for route visualization
- **CartoDB Tiles** - High-quality map tiles for better user experience
- **Custom Markers** - Location pins with popup information
- **Animated Polylines** - Smooth route path animations

## Development & Testing

### Testing Framework
- **Playwright** - End-to-end testing across different browsers
- **Vitest** - Unit testing for components and services
- **Angular Testing Utilities** - Component testing helpers

### Build & Development
- **Vite** - Fast development server and build tool
- **PNPM** - Efficient package management
- **TypeScript Configuration** - Strict type checking and modern JS features

### Code Quality
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Feature-Sliced Design (FSD)** - Architectural methodology for scalable code organization

## Project Structure

```
app/
├── src/
│   ├── features/          # Feature-based modules (FSD)
│   ├── services/          # Business logic and API calls
│   ├── shared/            # Reusable components
│   ├── layouts/           # Astro layouts
│   ├── pages/             # Astro pages and API routes
│   ├── contexts/          # AI prompt contexts
│   └── app/               # App configuration
├── public/                # Static assets
└── test/                  # Test utilities and setup
```

## Performance Optimizations

### Frontend Performance
- **Island Architecture** - Selective hydration for optimal loading
- **Client Directives** - Fine-grained control over component hydration
  - `client:visible` - Hydrate when visible in viewport
  - `client:load` - Immediate hydration for critical components
  - `client:only` - Client-side only rendering
- **Code Splitting** - Automatic bundle optimization

### Backend Efficiency
- **Firestore Queries** - Optimized database queries with pagination
- **AI Model Selection** - Cost-effective model choices for different operations
- **Server-side Rendering** - Pre-rendered static content for faster initial loads

## Security & Privacy

### Authentication Security
- **Firebase Security Rules** - Database access control
- **Session Cookies** - Secure authentication state management
- **User Data Protection** - Minimal data collection and secure storage

### Data Validation
- **Input Sanitization** - All user inputs validated and sanitized
- **Type Safety** - End-to-end type checking prevents runtime errors
- **Error Boundaries** - Graceful error handling and user feedback

## Development Guidelines

### Architecture Principles
- **Feature-Sliced Design** - Modular, scalable architecture
- **Standalone Components** - No NgModules, modern Angular patterns
- **Functional Programming** - Functional guards, resolvers, and utilities
- **Signal-based State** - Modern reactive patterns over RxJS where appropriate

### Code Standards
- **Component Structure** - Separate HTML templates, TypeScript logic
- **Styling Approach** - Tailwind-first with Material Design components
- **Error Handling** - Early returns, guard clauses, proper error boundaries
- **Testing Strategy** - E2E tests for user flows, unit tests for business logic

## Deployment & Infrastructure

### Build Configuration
- **Static Site Generation** - Pre-built pages for optimal performance
- **Asset Optimization** - Automatic image and code optimization
- **Environment Configuration** - Secure environment variable management

### Production Considerations
- **CDN Distribution** - Global content delivery for fast loading
- **Monitoring** - Error tracking and performance monitoring
- **Scalability** - Architecture designed for horizontal scaling
