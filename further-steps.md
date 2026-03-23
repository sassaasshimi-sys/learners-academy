# Roadmap: The Journey to Production

This document outlines the critical "Hardening" steps to transition the Learner's Academy from a world-class frontend prototype into a robust, database-driven production platform.

---

### Phase 1: The Cloud Core (Neon Integration)
**Goal**: Transition from `localStorage` to a serverless Postgres database.

1.  **Neon Setup**: 
    *   Initialize a [Neon.tech](https://neon.tech/) project.
    *   Configure the `.env` file with the `DATABASE_URL` connection string.
2.  **ORM Implementation (Prisma/Drizzle)**: 
    *   Design the `Schema` for Students, Teachers, and Assessments.
    *   Implement "Type-Safe" queries to ensure the frontend logic matches the database exactly.
3.  **Data Migration**:
    *   Write a one-time script to move current mock data into the Neon cloud.
    *   Update `DataContext` to fetch from the database instead of `localStorage`.

---

### Phase 2: Secure Proctoring (The Token System)
**Goal**: Implement "Access Codes" to ensure exam integrity.

1.  **Code Generation**:
    *   Update the Teacher Portal to generate a unique 6-digit **Access Token** (e.g., `LA-7721`) for every published assessment.
2.  **Student Gatekeeper**:
    *   Refactor the Student Entry page to require the Access Token.
    *   Implement a "Search-and-Route" logic: When the student enters a code, the system finds the specific paper in Neon and loads it instantly.
3.  **Proctoring Controls**:
    *   Add "Start/Stop" controls for teachers to remotely activate or expire access codes.

---

### Phase 3: System Hardening (Robustness)
**Goal**: Ensure the app can survive real-world usage and user errors.

1.  **Form Validation (Zod)**:
    *   Implement strict validation for Student Enrollment and Assessment creation to prevent database corruption.
2.  **Error Monitoring (Sentry)**:
    *   Integrate Sentry to track runtime crashes during live exams.
3.  **Premium Feedback (Shimmer/Skeleton)**:
    *   Replace simple "Loading..." text with sophisticated "Skeleton Screens" that match the elegant UI during data fetches.

---

### Phase 4: Identity & Security (Clerk/NextAuth)
**Goal**: Transition from "Mock Login" to secure, encrypted user sessions.

1.  **Clerk Integration**:
    *   Replace the custom `AuthContext` with Clerk for professional-grade login screens.
2.  **Role-Based Access (RBAC)**:
    *   Ensure Admin, Teacher, and Student routes are strictly locked down by the server, not just the frontend.

---

### Phase 5: Media & Static Assets
**Goal**: Finalize the "30 Images" project requirement.

1.  **Static Hosting**:
    *   Store the 30 Teacher/Admin profile images in a dedicated `/public/assets/profiles` folder.
    *   Link these images to the Neon database records for a seamless "Image-to-User" relationship.

---

**Current Status**: Complete Visual & Mobile Core (8.5/10).
**Next Priority**: Neon Account Configuration & Database Handshake.
