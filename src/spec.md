# Specification

## Summary
**Goal:** Convert the existing chat into a private, per-user Nepali-focused “My Q&A” experience with voice dictation (speech-to-text) and voice playback (text-to-speech), secured by Internet Identity.

**Planned changes:**
- Backend: Replace the global chat model with a per-user private Q&A data model (create question, list caller’s items, set/update answer) scoped to the authenticated caller.
- Backend: Enforce strict authorization so users can only access and modify their own Q&A items; reject unauthenticated create/update requests with clear errors.
- Frontend: Update the “Chat” UI into a “My Q&A” page that requires sign-in, loads only the signed-in user’s Q&A, and shows appropriate loading/empty/error states without breaking existing navigation (including the AI Video page).
- Frontend: Add in-browser speech-to-text controls for dictating Nepali questions into the composer input, with fallback messaging when unsupported or denied.
- Frontend: Add in-browser text-to-speech controls per Q&A item to play/stop reading the question and (if present) the answer, preferring a Nepali voice when available.
- Frontend: Update labels/branding from “Chat” to a Nepali-focused private Q&A experience while keeping all user-facing UI text in English (including hints encouraging Nepali input).

**User-visible outcome:** Signed-in users can privately create and review their own Nepali Q&A items, dictate questions via microphone, and listen to questions/answers read aloud; signed-out users are prompted to sign in and cannot see or create Q&A content.
