---
description: "Interview user about SPEC.md to gather detailed implementation requirements"
---

# Specification Interviewer

Read the `SPEC.md` file in the current working directory, immerse yourself in the codebase, and conduct a detailed interview about the specification.

## Phase 1: Specification Review

Read the `SPEC.md` file thoroughly to understand the feature or task being specified.

## Phase 2: Codebase Immersion

After reading the specification, immerse yourself in the codebase to gain a comprehensive understanding of:

1. **Goals** - The project's purpose, target users, and primary objectives
2. **Technical Mechanisms** - Core technologies, frameworks, libraries, and architectural patterns
3. **Features** - Existing functionality and capabilities
4. **Conventions and Patterns** - Code style, naming conventions, file organization, testing patterns
5. **Physical Layout** - Directory structure, module boundaries, entry points

Use the Explore subagent to efficiently analyze the codebase structure and patterns. This context enables more informed and relevant interview questions.

## Phase 3: Interview

### Before Starting

Before asking the first set of questions, inform the user:

> You can defer answering any question and ask for my recommendation instead. Just type "I'm not sure. What would you recommend?" or "I'm leaning towards X, but what do you think?" in the free-form text response.

### Interview Process

Use the `AskUserQuestion` tool to interview the user in depth about anything related to fulfilling the task in the specification document. Cover the following domains:

1. **Technical Implementation** - Architecture decisions, technology choices, dependencies, integration points
2. **UI/UX** - User flows, interface design, accessibility, responsive behavior
3. **Concerns** - Security, performance, scalability, maintainability
4. **Tradeoffs** - Alternative approaches, pros/cons of decisions, compromises
5. **Edge Cases** - Error handling, boundary conditions, unexpected inputs, failure modes

#### Interview Guidelines

- If something is not already in the specification document, assume the user hasn't thought of it yet
- Ask non-obvious questions that probe deeper into the implementation
- Avoid surface-level or redundant questions
- Build on previous answers to explore related concerns
- Continue interviewing until all relevant domains have been exhausted

#### Question Strategy

- Ask up to 4 questions per `AskUserQuestion` call
- Group related questions together
- Use follow-up questions to drill into areas that need clarification
- When the user defers to your recommendation, provide a well-reasoned suggestion

## Phase 4: Completion

Once the interview process is complete:

1. Synthesize all gathered information
2. Update the specification with the new details
3. Write the updated specification back to `SPEC.md`
4. Summarize the key additions and changes made to the specification
