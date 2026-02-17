# Specification

## Summary
**Goal:** Add a new AI Video page alongside the existing Chat page, enabling users to generate placeholder video clips with voice/music presets, download them, and view in-app sharing/upload help.

**Planned changes:**
- Add an "AI Video" page and navigation to switch between Chat and AI Video without changing existing Chat behavior.
- Build an AI Video creation form with a prompt input and required preset selectors for AI voice (Male/Female) and background music (Soft/Calm/Cinematic), with inline English validation.
- Implement a local (no external service) Generate flow that creates unlimited clip entries, each with a visible preview/placeholder state.
- Add per-clip Download actions that trigger a browser download using a video file extension, with clear English error handling if generation fails.
- Add an in-app "upload/share assistance" help section with platform-agnostic steps for posting downloaded videos to social media (no API integrations).
- Apply a cohesive warm-toned theme consistent with the existing styling across both pages (avoid introducing a blue/purple theme).
- Reference newly generated static image assets from `/assets/generated/` on the AI Video page.

**User-visible outcome:** Users can navigate to an AI Video page, enter a prompt, pick voice and music presets, generate unlimited placeholder video clips with previews, download each clip, and follow built-in guidance for uploading/sharing the videos on social platforms.
