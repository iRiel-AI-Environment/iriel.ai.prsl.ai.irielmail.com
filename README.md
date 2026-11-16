
# iRiel AI - Personal Intelligence Environment

**Created by Robert Software Labs**  
**Product:** iRiel Personal Intelligence Environment (PIE)  
**Architecture:** PRSL-AI Ecosystem v6.3  
**Project:** Existing Lovable project  
**Implementation target:** Production-oriented, fully functional application

Build and evolve the existing iRiel AppWeb into a complete Personal Intelligence Environment. This must be a real working application, not a clickable prototype or a collection of disconnected screens.

Preserve the existing project architecture, working functionality, canonical contracts, and visual identity.

## 1. ARCHITECTURAL FOUNDATION

Follow PRSL-AI Ecosystem v6.3 as the authoritative architectural baseline.

Respect these architectural definitions:

- **iRiel Personal Intelligence:** Personal intelligence, contextual understanding, reasoning, and interaction.
- **iRiel Resonance:** Continuity across time, devices, environments, models, and capabilities.
- **Memory:** Persistent contextual information governed by user authorization and privacy policies.
- **iSpace:** Integrated personal environment within iRiel.
- **iVault:** Isolated personal storage.
- **iApps:** Native applications and capabilities available within iRiel.
- **iRiel Devices:** Hardware and platform family integrating with the iRiel environment.

These are not interchangeable concepts. Do not create duplicate architectural layers or independent applications.

Use existing PRSL-AI contracts and capabilities. Do not reinvent Router, Policy Engine, Runtime, Provider Resolution, or other already-defined architectural responsibilities.

Maintain:
- Human First.
- Privacy by Default.
- Provider Agnosticism.
- Local-First Processing.
- User Sovereignty.
- Accessibility and Inclusion.
- Contextual Continuity.
- Interoperability.

## 2. VISUAL DESIGN — LOCKED

Use the supplied design references:

- IMG_0075.png
- IMG_0071.jpeg

Before writing code, inspect every relevant image, design.md, UI kit tokens, shell HTML, component HTML, and parts HTML.

Follow the existing visual language precisely:

- OLED black backgrounds: #000000 / #050505.
- Frosted glass surfaces.
- Subtle translucent borders.
- Restrained iridescent lighting.
- Clean Apple/VisionOS-inspired typography.
- Minimalist spatial composition.
- Smooth transitions.
- Consistent spacing and component proportions.

Do not introduce a new visual direction.

Reference images define the intended appearance and interaction moments, not the complete application implementation.

## 3. CENTRAL PRESENCE

Implement the central iRiel Presence as a horizontal iridescent glass capsule with an internal chromatic light beam.

Support four real interaction states:

**Idle**
- Soft breathing illumination.
- Subtle glass reflections.
- Continuous ambient presence.

**Listening**
- Horizontal acoustic waveforms.
- "Listening..." indicator.
- Active microphone control.
- Red stop button.
- Actual microphone permission and capture handling.

**Thinking**
- Dynamic chromatic pulse.
- Processing animation.
- Accurate execution feedback.

**Responding**
- Smooth transition into compact header presence.
- Persistent visual feedback.

Animations must reflect actual application states.

## 4. HOME SCREEN

Main heading:

**Ask or Search with iRiel**

Implement a floating command composer containing:

- Attachment button (+).
- Input: "Ask or search..."
- Microphone button.
- Send button.

Quick suggestions:

- Summarize this for me
- Search the web
- Work with my files
- Help me plan
- Brainstorm ideas

Implement actual actions for every suggestion.

The composer must support text, voice, attachments, submission, cancellation, loading, and error states.

Footer:

Left: "iRiel · Human first. Always."

Right: "A PRSL-AI creation"

## 5. APPLICATION NAVIGATION

### Topbar

- macOS-inspired window controls.
- iRiel wordmark.
- Quick search.
- iSpace access button.
- Circular user avatar.

### Left navigation dock

Implement a collapsible navigation sidebar:

1. New Chat
2. Search
3. Files
4. Projects
5. Agents
6. Devices
7. Settings

Support active states, keyboard navigation, responsive behavior, and functional navigation.

## 6. iSPACE — INTEGRATED ENVIRONMENT

Implement iSpace as an integrated area of iRiel, not a separate application.

Header:

**iSpace — Your personal intelligence environment.**

Include:
- Back navigation.
- User avatar.
- Internal Presence capsule.
- "iRiel · Always with you."

Navigation sections:

- Profile
- Memory
- Connections
- Devices
- Agents
- Customization
- Privacy
- About

Each section must have a functional interface.

### Profile

Support:

- Name.
- Email.
- Timezone.
- Language.
- Personal preferences.

Load authenticated user information when available. Do not invent account information or hardcode example credentials as real user data.

## 7. iVAULT — PERSONAL STORAGE

Implement iVault as an isolated environment for user-owned content.

Categories:

- Documents.
- Media.
- Projects.
- Personal resources.

### Canonical IRC-001 storage separation

Personal content belongs to iVault.

The following must never consume user iVault quota:

- Model weights.
- Inference caches.
- Temporary runtime data.
- Internal vector indexes.
- System-managed intelligence resources.
- Infrastructure artifacts.

Implement actual storage isolation, independent accounting, and appropriate lifecycle management.

Do not simply exclude infrastructure resources from the visual quota calculation while storing everything in the same user-controlled storage boundary.

### Storage interface

Implement:

- Total quota.
- Used storage.
- Available storage.
- Category breakdown.
- Upload progress.
- File preview.
- Download.
- Rename.
- Delete.
- Search.
- Sorting.
- Empty states.
- Storage-limit handling.

Configurable product tiers:

- Free — 16 GB.
- Standard — 50 GB.
- Plus — 1 TB.
- Advanced — 2 TB.

These are proposed plan definitions. Do not claim subscription activation, payment processing, or actual entitlement without the corresponding backend integration.

## 8. EXPERIENCE CONTRACT

Implement six selectable native experiences:

- Everyday
- Thinking
- Research
- Creative
- Developer
- Private

Experiences define interaction behavior, contextual handling, presentation, and authorized capability selection.

They are not separate agents, applications, or architectural foundations.

### Everyday
General personal assistance and daily interactions.

### Thinking
Deeper reasoning, structured analysis, and problem-solving.

### Research
Research, source discovery, evidence organization, and synthesis.

### Creative
Writing, ideation, and creative workflows.

### Developer
Programming, architecture, debugging, and technical workflows.

### Private
Strictly isolated local execution.

Private requirements:

- Local-only execution.
- No external provider calls.
- No federation calls.
- No telemetry.
- No implicit external synchronization.
- Explicit isolation status.
- Verified availability of local capabilities.

Block unauthorized external execution at the actual execution boundary.

Never display a privacy guarantee that the runtime cannot verify.

Do not silently switch to an external provider when local execution is unavailable.

## 9. CONVERSATION EXPERIENCE

Implement a functional conversation environment with:

- Conversation history.
- Context continuity.
- Streaming responses when supported.
- Cancellation.
- Retry.
- Message actions.
- File attachments.
- Source references.
- Conversation organization.
- Loading states.
- Error handling.

### Rich response cards

Support structured cards containing:

- Summaries.
- Topics.
- Key findings.
- References.
- Source metadata.
- Relevant actions.

Support verified sources such as The Verge, OpenAI, Google DeepMind, and other actual retrieved sources.

Never fabricate source identities, citations, verification badges, or URLs.

Cards must follow the approved design system.

## 10. NATIVE INTELLIGENCE

iRiel must provide operational intelligence from the first interaction.

Integrate with existing PRSL-AI capabilities and contracts.

Implement:

- Intent interpretation.
- Context management.
- Capability discovery.
- Provider resolution.
- Policy evaluation.
- Authorized execution.
- Response streaming where supported.
- Error recovery.

Maintain provider agnosticism.

Do not make a single AI provider the architectural foundation.

Do not duplicate existing PRSL-AI infrastructure.

If an external service is unavailable, implement the complete application-side workflow up to its integration boundary.

Clearly distinguish real execution from development fixtures.

Never present simulated intelligence as a real model response.

## 11. MULTILINGUAL SUPPORT

Implement functional localization for:

- English.
- Portuguese.
- Spanish.
- French.
- German.
- Japanese.

Prepare the localization architecture for additional languages.

Requirements:

- Dynamic language switching.
- Persistent language preference.
- Localized navigation.
- Localized interface labels.
- Localized empty states.
- Localized errors.
- Date and number formatting.
- RTL support where required.

Use a centralized localization architecture instead of scattered hardcoded strings.

## 12. REQUIRED INTERACTION FLOWS

Implement these complete workflows:

### Personal conversation
Input → Intent interpretation → Capability resolution → Policy evaluation → Authorized execution → Response → Context continuity.

### Web research
Research request → Capability selection → External authorization → Source retrieval → Evidence presentation → References.

### iVault upload
File selection → Validation → Storage resolution → Upload → Progress → Confirmation → File listing.

### Experience switching
Experience selection → Contract loading → Policy evaluation → Environment update → Confirmation.

### Private execution
Private activation → Local capability verification → Isolation enforcement → External execution blocking → Authorized local execution → Verified status.

### iSpace management
Section selection → Data loading → User modification → Validation → Authorization → Persistence → Updated interface.

Every flow must have appropriate loading, success, failure, cancellation, and empty states.

## 13. RESPONSIVE DESIGN

Validate the complete application at these exact viewport sizes:

| Device | Resolution |
|---|---|
| Mobile | 393 × 764 |
| Tablet Portrait | 744 × 1133 |
| Tablet Landscape | 1133 × 744 |
| Desktop | 1280 × 832 |

Implement adaptive navigation, responsive cards, touch-friendly controls, adaptive composers, and continuous Presence.

Avoid horizontal overflow and preserve visual consistency.

## 14. ENGINEERING REQUIREMENTS

Build on the existing repository.

Before implementation:

1. Inspect the repository.
2. Inspect design.md.
3. Inspect all referenced images.
4. Inspect the UI kit tokens.
5. Inspect shell and component HTML.
6. Inspect existing integrations.
7. Identify existing architectural contracts.
8. Map screens to functional workflows.
9. Identify missing dependencies.

Engineering requirements:

- Modular architecture.
- Strict TypeScript.
- Reusable components.
- Separation of UI and business logic.
- Explicit state management.
- Validated contracts.
- Secure authentication.
- Authorization at execution boundaries.
- Error handling.
- Accessibility.
- Minimal dependencies.
- No duplicated architecture.

Preserve existing functionality and avoid unnecessary rewrites.

Development fixtures may only be used in isolated development environments. Never mix simulated data with production user data.

## 15. QUALITY ASSURANCE

After implementation:

- Run the application.
- Validate all six experiences.
- Validate all required workflows.
- Test iSpace navigation.
- Test iVault uploads.
- Verify storage isolation.
- Verify Private execution restrictions.
- Test multilingual switching.
- Test authentication and authorization.
- Test keyboard accessibility.
- Test empty and error states.
- Inspect browser console.
- Run TypeScript validation.
- Run available automated tests.
- Run production build.

Capture and inspect screenshots at all four required viewport sizes.

Compare each completed screen against its corresponding reference and correct unintended visual differences.

Do not report successful validation for tests that were not actually executed.

## 16. FINAL DELIVERY REPORT

At completion, provide:

### Implemented
Completed features and validated workflows.

### Integrations
Connected services and verified capabilities.

### Remaining Dependencies
External integrations that still require configuration or authorization.

### Validation
Build status, tests, screenshots, viewport checks, and remaining failures.

### Changed from the mockups
Every deliberate visual or structural change and its justification.

### Added beyond the mockups
Every additional workflow, state, interaction, and operational behavior.

---

**FINAL DIRECTIVE**

Build iRiel as one coherent Personal Intelligence Environment.

Do not reduce the product to a visual prototype.

Do not introduce independent architectural foundations.

Do not compromise user sovereignty, privacy, continuity, or provider agnosticism.

Preserve the supplied design language.

Implement the actual product behavior behind every designed interaction.

Use PRSL-AI Ecosystem v6.3 as the authoritative architectural reference.

