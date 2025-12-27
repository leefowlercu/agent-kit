---
description: "Initialize or update subsystem documentation."
argument-hint: "<subsystem-name>"
---

The subsystem documentation file is located at `docs/subsystems/$1/README.md`.

Check if this file exists:
- **If it does not exist:** Proceed to **Initialization Mode**
- **If it exists:** Proceed to **Reconciliation Mode**

---

## Shared Guidelines

When drafting or updating this documentation, you

- **MUST** focus on the high-level aspects of the $1 subsystem, ensuring that it provides clear insights into its functionality, design principles, and interactions with other parts of the system.
- **MUST NOT** include low-level implementation details, code snippets, or exhaustive technical specifications, as those may change frequently during development.
- **MUST** ensure that the documentation is accurate and reflects the current state of the $1 subsystem as understood from your analysis of the codebase.
- **MUST** strike a balance between being comprehensive and concise, providing enough information to be useful without overwhelming the reader with unnecessary details.

**Section Description Syntax:** `**<section-identifier>: <section-level>** { - section-title} - <section-description> { - section-example} {, section-example}...`

**Section Description Examples:**
 - `**Subsystem Title: H1** - The name of the subsystem in Title Case.`
 - `**Subsystem Tagline: N/A** - A brief, catchy tagline that summarizes the subsystem's purpose or mission.`
 - `**Documented Version: N/A** - The current documented version of the subsystem. - **Documented Version**: v0.1.0, **Documented Version**: N/A`
 - `**Design Principles: H2** - Design Principles - An explanation of the core design principles and architectural patterns.`

The structure of the subsystem README.md file **MUST** include **ONLY** the following sections, in order:

1. **Subsystem Title: H1** - The name of the subsystem in Title Case. Derive a suitable title based on the subsystem's purpose and functionality.
2. **Subsystem Tagline: N/A** - A brief, catchy tagline that summarizes the subsystem's purpose or mission.
3. **Documented Version: N/A** - The version of the $1 subsystem being documented, derived from git tags or version files. If no versioning is found use "N/A". - `**Documented Version**: v0.13.0, **Documented Version**: N/A`
4. **Last Updated: N/A** - The date when the documentation was last updated. Use the format YYYY-MM-DD. - `**Last Updated**: 2024-06-15`
5. **ToC: H2** - Table of Contents - A markdown table of contents that links to the subsequent header sections in the README.md.
6. **Overview: H2** - Overview - A brief, high-level description of the $1 subsystem, its purpose, goals, and key features.
7. **Design Principles: H2** - Design Principles - An explanation of the core design principles and architectural patterns that guide the development of the $1 subsystem.
8. **Key Components: H2** - Key Components - A high-level description of the main components or modules that make up the $1 subsystem.
9. **Integration Points: H2** - Integration Points - An outline of how the $1 subsystem integrates with other subsystems or components within the codebase.
10. **Glossary: H2** - Glossary - Definitions of any specialized terms or concepts relevant to the $1 subsystem.

---

## Initialization Mode

Immerse yourself in this codebase, gaining a deep understanding of its goals, its technical features and mechanisms, specific conventions and patterns it follows, and the various subsystems that comprise it. Once you have a comprehensive understanding, proceed to create a README.md file at `docs/subsystems/$1/README.md`. This file will serve as high-level documentation for the $1 subsystem.

- Create the directory `docs/subsystems/$1/` if it does not already exist.
- Set **Documented Version** by inferring the current version from git tags or version files. Use "N/A" if no versioning is found.
- Set **Last Updated** to the current date in YYYY-MM-DD format.

---

## Reconciliation Mode

Read the subsystem documentation file and immerse yourself in this codebase, gaining a deep understanding of the $1 subsystem it documents. Evaluate the documentation against the current state of the codebase.

Evaluate the documentation for:

- **Comprehensiveness:** Does the documentation sufficiently cover all aspects of this subsystem?
- **Accuracy:** Are the claims made in the documentation accurate and based in the truth as represented by this codebase?
- **Conciseness:** Are there subsections or content that are unnecessary, redundant, or out-of-date?
- **Tone:** The tone should be professional and the content should be technical in nature.

Be comprehensive in your evaluation. Use a subagent for each major section (Overview, Design Principles, Key Components, Integration Points, Glossary) to focus on that section specifically and validate its content against the codebase.

If the existing documentation does not conform to the required structure, restructure it accordingly.

After evaluating each section, compile a summary of changes, additions, and deletions needed to bring the documentation up to date with the current codebase. If changes are made:

- **Documented Version:** Update to reflect the current version of the $1 subsystem as inferred from git tags or version files.
- **Last Updated:** Update to the current date using the format YYYY-MM-DD.

---

# Subsystem Documentation Index

After completing the above steps for the $1 subsystem documentation, proceed to initialize or reconcile the Subsystem Documentation Index.

The index file is located at `docs/subsystems/README.md`.

Check if this file exists:
- **If it does not exist:** Proceed to **Index Initialization Mode**
- **If it exists:** Proceed to **Index Reconciliation Mode**

---

## Index Shared Guidelines

When drafting or updating the index documentation, you

- **MUST** provide a comprehensive catalogue of all subsystem documentation in `docs/subsystems/*/`.
- **MUST** include accurate status indicators for each subsystem's documentation state.
- **MUST** ensure all links to subsystem documentation are valid and point to existing files.
- **MUST** maintain consistency between the index entries and the actual subsystem documentation.
- **MUST NOT** include detailed implementation information; the index should provide overview and navigation only.

**Section Description Syntax:** `**<section-identifier>: <section-level>** { - section-title} - <section-description> { - section-example} {, section-example}...`

The structure of the index README.md file **MUST** include **ONLY** the following sections, in order:

1. **Title: H1** - "Subsystems Documentation" - The literal title for the index.
2. **Introduction: N/A** - A brief description explaining that this directory contains detailed technical documentation for each major subsystem.
3. **Last Updated: N/A** - The date when the index was last updated. Use the format YYYY-MM-DD. - `**Last Updated:** 2024-06-15`
4. **Purpose: H2** - Purpose - What the subsystem documentation provides (overview, design principles, key components, integration points, and glossary).
5. **Available Subsystems: H2** - Available Subsystems - A categorized table of contents with anchor links to each subsystem entry below.
6. **Subsystem Entries: H3/H4** - One entry per documented subsystem, organized by category. Use your understanding of the project and its architecture to determine categories. Each entry includes:
   - Title with link to subdirectory - `#### [Subsystem Name](./subsystem-name/)`
   - Status badge - `**Status:** ✅ Documented`
   - Brief description of the subsystem's purpose
   - Key Features list - Major capabilities
   - Primary Components list - Key files and their purposes
   - Link to full documentation - `**See:** [subsystem-name/README.md](./subsystem-name/README.md)`
7. **Documentation Status Legend: H2** - Documentation Status Legend - Explanation of status indicators:
    - ✅ **Documented** - Complete documentation available
    - 🚧 **Planned** - Documentation planned but not yet written
    - 📝 **Draft** - Documentation in progress
    - 🔄 **Needs Update** - Documentation exists but may be outdated
8. **Recent Updates: N/A** - A brief changelog of recent documentation updates. - `**Recent Updates:**\n- Added daemon subsystem documentation (2024-06-15)`

---

## Index Initialization Mode

Scan the `docs/subsystems/` directory for all existing subsystem documentation subdirectories. For each subdirectory containing a `README.md`, extract key information to populate the index.

Create a `docs/subsystems/README.md` file with:

- Create the `docs/subsystems/` directory if it does not already exist.
- Scan for existing `docs/subsystems/*/README.md` files.
- For each found subsystem, extract: title, tagline/description, key features, and primary components.
- Organize subsystems into logical categories based on their purpose and functionality. Use your understanding of the project and its architecture to determine categories.
- Set **Last Updated** to the current date in YYYY-MM-DD format.
- Add an entry to **Recent Updates** noting the index creation.

---

## Index Reconciliation Mode

Read the existing index file and evaluate it against the current state of `docs/subsystems/*/` subdirectories.

Evaluate the index for:

- **Completeness:** Does the index include entries for all subsystem documentation in `docs/subsystems/*/`?
- **Accuracy:** Do the status badges, descriptions, and component lists match the actual subsystem documentation?
- **Link Validity:** Do all links point to existing files?
- **Currency:** Has the $1 subsystem entry been added or updated to reflect recent changes?

After evaluation:

- Add an entry for the $1 subsystem if it does not exist in the index.
- Update the $1 subsystem entry if it exists but is inaccurate or incomplete.
- Update **Last Updated** to the current date in YYYY-MM-DD format.
- Add an entry to **Recent Updates** noting the changes made.
