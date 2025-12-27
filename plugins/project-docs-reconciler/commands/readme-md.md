---
description: "Initialize or update the main README.md file for the project."
---

The main project documentation file is located at `README.md` in the project root.

Check if this file exists:
- **If it does not exist:** Proceed to **Initialization Mode**
- **If it exists:** Proceed to **Reconciliation Mode**

---

## Shared Guidelines

When drafting or updating this documentation, you

- **MUST** focus on the high-level aspects of the project, ensuring it provides clear insights into its purpose, goals, and how to get started.
- **MUST NOT** include low-level implementation details or exhaustive technical specifications that may change frequently during development.
- **MUST** ensure that the documentation is accurate and reflects the current state of the project as understood from your analysis of the codebase.
- **MUST** strike a balance between being comprehensive and concise, providing enough information to be useful without overwhelming the reader with unnecessary details.

**Section Description Syntax:** `**<section-identifier>: <section-level>** { - section-title} - <section-description> { - section-example} {, section-example}...`

**Section Description Examples:**
 - `**Project Title: H1** - The name of the project in Title Case.`
 - `**Installation: H2** - Installation Instructions - Instructions on how to install and set up the project.`
 - `**Project Tagline: N/A** - A brief, catchy tagline that summarizes the project's purpose or mission.`
 - `**Current Version: N/A** - The current version of the project, derived from git tags or version files. If no versioning is found use "N/A". - **Current Version**: v0.13.0 ([CHANGELOG.md](CHANGELOG.md)), **Current Version**: N/A`

The README.md **MUST** include the following sections, in order, **AT MINIMUM**:

1. **Project Title: H1** - The name of the project in Title Case. Investigate the project git uri or folder name and derive a suitable project title.
2. **Badges: N/A** - A set of badges that indicate the build status, coverage, license, and other relevant information about the project. - `[![Build Status](badge-image-source)](badge-link), [![License](badge-image-source)](badge-link)`
3. **Project Tagline: N/A** - A brief tagline that summarizes the project's purpose or mission.
4. **Current Version: N/A** - The current version of the project, derived from git tags or version files. If no versioning is found use "N/A". - `**Current Version**: v0.13.0 ([CHANGELOG.md](CHANGELOG.md)), **Current Version**: N/A`
5. **ToC: H2** - Table of Contents - A markdown table of contents that links to the subsequent header sections in the README.md.
6. **Overview: H2** - Overview - A brief, high-level description of the project's purpose, goals, and key features.
7. **Quick Start: H2** - Quick Start - Step-by-step instructions to get the project up and running quickly.

---

## Initialization Mode

Immerse yourself in this codebase, gaining a deep understanding of its goals, its technical features and mechanisms, specific conventions and patterns it follows, and the various subsystems that comprise it. Once you have a comprehensive understanding, proceed to create a README.md file at the project root.

- Derive **Project Title** from the project git uri or folder name.
- Set **Current Version** by inferring the current version from git tags or version files. Use "N/A" if no versioning is found.

---

## Reconciliation Mode

Evaluate the current README.md against the codebase. Evaluate it for:

- **Comprehensiveness:** Is the README.md sufficiently comprehensive in its documentation of this codebase?
- **Accuracy:** Are the claims made in the README.md accurate and based in the truth as represented by this codebase?
- **Conciseness:** Are there sections or content in the README.md that are unnecessary or out-of-date?
- **Tone:** The tone of the README.md should be professional and the content should be technical in nature.

Be comprehensive in your evaluation. Use a subagent for each major section of the README.md to focus on that section specifically and validate its content against the codebase.

After evaluating each section, compile a summary of changes, additions, and deletions needed to bring the README.md up to date with the current codebase. If changes are made:

- **Current Version:** Update to reflect the current version of the project as inferred from git tags or version files.
