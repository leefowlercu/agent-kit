---
description: "Generate implementation plan from SPEC.md after analyzing codebase"
---

# Specification Planner

Generate an implementation plan document based on the specification and codebase analysis.

## Phase 1: Codebase Immersion

Before reading the specification, immerse yourself in the codebase to gain a comprehensive understanding of:

1. **Goals** - The project's purpose, target users, and primary objectives
2. **Technical Mechanisms** - Core technologies, frameworks, libraries, and architectural patterns
3. **Features** - Existing functionality and capabilities
4. **Conventions and Patterns** - Code style, naming conventions, file organization, testing patterns
5. **Physical Layout** - Directory structure, module boundaries, entry points

Use the Explore subagent to efficiently analyze the codebase structure and patterns.

## Phase 2: Specification Analysis

Read the `SPEC.md` file thoroughly. Understand:

- The feature or task being specified
- Requirements and constraints
- User stories or use cases
- Technical requirements
- Acceptance criteria

## Phase 3: Plan Generation

Create a `PLAN.md` document in the current working directory containing:

### Multi-Phase Implementation Plan

A structured, multi-phase plan that organizes implementation into logical phases. Each phase should represent a coherent milestone that can be completed and verified independently.

The plan should include:

- **Overview** - Brief summary of what will be implemented
- **Table of Contents** - Markdown-formatted table of contents with links to all subsequent major sections
- **Prerequisites** - Dependencies, setup, or preparation needed
- **Implementation Phases** - Distinct phases with clear boundaries and objectives:
  - Phase name and objective
  - Ordered steps within each phase
  - Expected outcome or deliverable for the phase
  - Verification criteria before proceeding to next phase
- **Files to Modify/Create** - Specific files that will be touched, organized by phase
- **Testing Strategy** - How each phase and the overall implementation will be verified
- **Potential Risks & Mitigations** - Known challenges or areas of uncertainty along with strategies to address them

### Implementation Checklist

A to-do style checklist organized by phase that can be followed during implementation:

```markdown
## Implementation Checklist

### Phase 1: [Phase Name]
- [ ] Step 1.1 description
- [ ] Step 1.2 description
- [ ] Phase 1 verification

### Phase 2: [Phase Name]
- [ ] Step 2.1 description
- [ ] Step 2.2 description
- [ ] Phase 2 verification
...
```

The checklist should:

- Be organized by implementation phase
- Be actionable and specific
- Follow the logical order of implementation within each phase
- Include verification steps at the end of each phase
- Be granular enough to track progress effectively

## Output

Write the complete plan to `PLAN.md` and provide a summary of the planned approach. After generating the document and providing the summary, offer to begin implementation of phase 1 of the plan, noting that you will keep track of your progress during implementation by updating the implementation checklist in `PLAN.md`.
