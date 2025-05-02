# Product Requirements Document (PRD) - RoamRoute

## 1. Product Overview

RoamRoute is a desktop web application designed to help international tourists plan one-day trips in new cities. The MVP enables users to quickly generate an optimized sightseeing route based on a few questions, displays the route on an interactive map, and allows users to save the route after logging in. The application uses Google Places API to select attractions and generates a Google Maps link for easy navigation.

## 2. User Problem

Tourists visiting new cities often have limited time and face difficulties planning an efficient sightseeing route on their own. The main challenges are selecting the most interesting attractions, optimizing the route for time and distance, and the lack of tools for quickly and conveniently preparing a travel plan.

## 3. Functional Requirements

1. When a user enters the website and reaches the chat screen, they are welcomed by the AI chat, which immediately starts the conversation.
2. The AI chat initially asks the following questions:
   - What is your travel destination?
   - How much time do you want to spend sightseeing?

   **Chat Extension:**
   - After the AI suggests 5 places to visit based on the initial answers, the chat remains open for further conversation.
   - The user can provide extra context or requests (e.g., add a vegan restaurant, specific type of attraction, etc.).
   - The AI can ask clarifying questions if needed before suggesting additional locations.
   - The AI can add up to 3 more locations (for a total of 10 markers).
   - After each new suggestion, the AI summarizes all locations added so far and asks if the user wants to add more or proceed.

3. Generate an optimized sightseeing route based on user input (city, available time, starting point, preferences, mode of travel).
4. Display the route on an interactive map with attraction markers.
5. Provide a Google Maps link with the generated route.
6. Allow saving the route for logged-in users (login via Firebase).
7. Limit to one generated route per user per day.
8. Additional text field for user preferences regarding attractions.
9. English language support.
10. Store user email address for login and route saving purposes.
11. No route editing, export, ratings, statistics, notifications, or user support in the MVP.

## 4. Product Boundaries

- The application is available only on desktop in the MVP.
- No mobile device support at this stage.
- No editing of generated routes.
- No export of routes to files (PDF, CSV) or sharing outside Google Maps.
- No multi-language support (English only).
- No push notifications, user statistics, route ratings, or technical support in the MVP.
- No integration with other services (TripAdvisor, Yelp) in the MVP.
- Color palette and UI style will be determined at a later stage.
- No accessibility (WCAG) support at this stage (to be considered in the future).
- The minimum set of supported cities/regions will be defined before launch.

## 5. User Stories

### US-001: Generate a route without logging in
- Title: Generate a route as an anonymous user
- Description: As an anonymous user, I want to generate a sightseeing route based on my answers to a few questions so I can quickly plan my trip.
- Acceptance Criteria:
  - The user can generate a route without logging in.
  - The user answers questions: city, available time, starting point, preferences, mode of travel.
  - The route is displayed on an interactive map.
  - The user receives a Google Maps link with the route.
  - The user can generate only one route per day.

### US-002: Save a route after logging in
- Title: Save a route as a logged-in user
- Description: As a logged-in user, I want to save the generated route so I can return to it in the future.
- Acceptance Criteria:
  - The user must log in via Firebase to save a route.
  - After logging in, the user can save the route to their account.
  - Saved routes are available after logging in again.
  - The user can delete saved routes.

### US-003: Limit the number of routes
- Title: Limit the number of routes generated per day
- Description: As a user, I want to know how many routes I can generate per day so I don't exceed the application's limits.
- Acceptance Criteria:
  - The user (anonymous or logged-in) can generate only one route per day.
  - After exceeding the limit, an appropriate message is displayed.

### US-004: Attraction preferences
- Title: Add preferences for attractions
- Description: As a user, I want to provide additional preferences regarding attractions so the route is better tailored to my interests.
- Acceptance Criteria:
  - The route generation form includes a text field for preferences.
  - Preferences are considered when selecting attractions.

### US-005: Secure login and account management
- Title: Secure login and user account management
- Description: As a user, I want to securely log in to the application and manage my account so I can be sure my data is protected.
- Acceptance Criteria:
  - Login and registration are handled via Firebase.
  - Only the user's email address is stored.
  - The user can delete their account and associated data.
  - Access to saved routes requires logging in.

### US-006: Receive a Google Maps link
- Title: Share the route via Google Maps
- Description: As a user, I want to receive a Google Maps link with my route so I can easily navigate while sightseeing.
- Acceptance Criteria:
  - After generating a route, the user receives a Google Maps link.
  - The link includes all selected points.

### US-007: Manage AI costs
- Title: Limit route generation costs
- Description: As a product owner, I want to limit the cost of AI queries so the budget is not exceeded.
- Acceptance Criteria:
  - The system blocks route generation after exceeding the monthly cost limit ($2).
  - The user receives a message about exceeding the limit.

## 6. Success Metrics

1. Number of routes generated daily and monthly.
2. Number of routes saved by logged-in users.
3. Number of unique users using the application.
4. Keeping AI model query costs below $2 per month.
5. Application stability and availability (no critical errors).
6. Positive feedback from early users (e.g., satisfaction survey).
