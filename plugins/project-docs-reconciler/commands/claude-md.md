---
description: "Initialize or update the project CLAUDE.md file."
---

The project `CLAUDE.md` file is located at `CLAUDE.md` in the project root. This file provides context and instructions for Agents when working with the project.

Check if this file exists:
- **If it does not exist:** Proceed to **Initialization Mode**
- **If it exists:** Proceed to **Reconciliation Mode**

---

## Shared Guidelines

When drafting or updating this documentation, you

- **MUST** focus on high-level aspects of the project, ensuring it provides clear insights into architecture, conventions, and development workflows.
- **MUST NOT** include low-level implementation details or exhaustive technical specifications that may change frequently during development.
- **MUST** ensure that the documentation is accurate and reflects the current state of the project as understood from your analysis of the codebase.
- **MUST** strike a balance between being comprehensive and concise, providing enough information to be useful without overwhelming the reader with unnecessary details.
- **MUST** include actionable development commands that can be executed directly.
- **MUST** validate that the subsystem documentation links are accurate and point to existing files.

**Section Description Syntax:** `**<section-identifier>: <section-level>** { - section-title} - <section-description> { - section-example} {, section-example}...`

**Section Description Examples:**
 - `**Project Overview: H2** - A high-level description of the project's purpose and goals.`
 - `**Development Commands: H2** - Common commands for building, testing, and running the application.`
 - `**Building & Testing: H3** - Commands for building and testing the project.`

The structure of the `CLAUDE.md` file **MUST** include **ONLY** the following sections, in order:

1. **CLAUDE.md: H1** - The literal title "CLAUDE.md".
2. **ToC: H2** - Table of Contents - A markdown table of contents that links to the subsequent header sections.
3. **Project Overview: H2** - Project Overview - A high-level description of the project's purpose, goals, and key features.
4. **Project Principles: H2** - Project Principles - Guiding principles and philosophies that inform development decisions for this project.
5. **High-Level Architecture: H2** - High-Level Architecture - An overview of the system architecture, major components, and how they interact.
6. **Subsystems Reference: H2** - Subsystems - Links and brief descriptions of subsystem documentation located in `docs/subsystems/*/README.md`.
7. **Conventions & Patterns: H2** - Conventions & Patterns - Code conventions, naming patterns, and stylistic choices used throughout the project.
8. **Code Organization Principles: H2** - Code Organization Principles - How code is organized within the project, including directory structure rationale.
9. **Testing Approach: H2** - Testing Approach - Testing philosophy, frameworks used, and how tests are organized.
10. **Development Commands: H2** - Development Commands - Common development commands.
    - **Building & Testing: H3** - Building & Testing - Commands for building the project and running tests. Investigate package.json, Makefile, or similar build configuration files to extract these commands.
    - **Running the Application: H3** - Running the Application - Commands for running the application locally and/or remotely.

---

## Initialization Mode

Immerse yourself in this codebase, gaining a deep understanding of its goals, its technical features and mechanisms, specific conventions and patterns it follows, the various subsystems that comprise it, any existing project build, test, or configuration orchestration files (`package.json`, `Makefile`, etc.), and any existing test suites or testing frameworks.

Before writing the `CLAUDE.md` file, use the `AskUserQuestion` tool to ask if the user would like to establish any **Project Principles** to include. These are guiding principles and philosophies that inform development decisions for this project (e.g., "prefer composition over inheritance", "optimize for readability", "follow Unix philosophy").

Once you have a comprehensive understanding and gathered any user-provided principles, proceed to create a `CLAUDE.md` file at the project root.

- For **Subsystems Reference**, scan `docs/subsystems/` for existing subsystem documentation and link to each.
- For **Development Commands**, investigate package.json, Makefile, or similar build configuration files to extract common commands.

---

## Reconciliation Mode

Evaluate the current `CLAUDE.md` against the codebase. Evaluate it for:

- **Comprehensiveness:** Does the `CLAUDE.md` sufficiently cover all aspects needed for Claude Code to understand the project?
- **Accuracy:** Are the claims made in the `CLAUDE.md` accurate and based in the truth as represented by this codebase?
- **Conciseness:** Are there subsections or content that are unnecessary, redundant, or out-of-date?
- **Actionability:** Are the development commands accurate and executable?

Be comprehensive in your evaluation. Use a subagent for each major section to focus on that section specifically and validate its content against the codebase.

After evaluating each section, compile a summary of changes, additions, and deletions needed to bring the `CLAUDE.md` up to date with the current codebase.
