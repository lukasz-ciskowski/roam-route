# AI Rules for Zippy Journey

ZippyJourney is a web application that helps international tourists quickly generate optimized one-day sightseeing routes in new cities. Users answer a few questions, and the app creates a personalized walking tour, displaying it on an interactive map with a shareable Google Maps link. The platform leverages AI and Google Places data to ensure the most valuable attractions are included within the user's available time.

## Tech Stack

- Astro 5
- TypeScript 5
- Angular19 (Analogjs)
- Tailwind 4
- Angular Material

## Project Structure

When introducing changes to the project, always follow the directory structure as it is described in Feature Sliced Design (FSD) pattern.
The main project written in Astro code is inside `./app/src` subdirectory

## Coding practices

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.

## Frontend

### General Guidelines

- Use Astro components (.astro) for static content and layout
- Implement framework components in Analogjs only when interactivity is needed

### Guidelines for Astro

#### ASTRO_ISLANDS

- Use client:visible directive for components that should hydrate when visible in viewport
- Implement shared state with nanostores instead of prop drilling between islands
- Use content collections for type-safe content management of structured content
- Leverage client:media directive for components that should only hydrate at specific breakpoints
- Implement partial hydration strategies to minimize JavaScript sent to the client
- Use client:only for components that should never render on the server
- Leverage client:idle for non-critical UI elements that can wait until the browser is idle
- Implement client:load for components that should hydrate immediately
- Use Astro's transition:* directives for view transitions between pages
- Leverage props for passing data from Astro to framework components

### Guidelines for Angular

#### ANGULAR_MATERIAL

- When possible use the material components

#### ANGULAR_CODING_STANDARDS

- Use standalone components, directives, and pipes instead of NgModules
- Always split up modules to component.ts, component.html.ts and component.css and import it
- Implement signals for state management instead of traditional RxJS-based approaches
- Use the new inject function instead of constructor injection
- Implement control flow with @if, @for, and @switch instead of *ngIf, *ngFor, etc.
- Leverage functional guards and resolvers instead of class-based ones
- Use the new deferrable views for improved loading states
- Implement OnPush change detection strategy for improved performance
- Implement proper lazy loading with loadComponent and loadChildren
