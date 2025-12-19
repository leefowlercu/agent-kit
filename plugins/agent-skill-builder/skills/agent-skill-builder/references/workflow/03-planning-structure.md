# Planning Structure Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Reviewing Requirements and Archetype](#01--reviewing-requirements-and-archetype)
  - [02 / Designing Directory Structure](#02--designing-directory-structure)
  - [03 / Planning Workflow Hierarchy](#03--planning-workflow-hierarchy)
  - [04 / Defining Artifact Flow](#04--defining-artifact-flow)
  - [05 / Presenting Structure Plan](#05--presenting-structure-plan)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)
  - [Validation Process](#validation-process)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on designing the complete structure for the skill being built. The structure plan defines all files to be generated, their organization, and the relationships between them.

## Input Validation Criteria

This step requires validated output from Steps 1-2.

**Required Input**: `skill-requirements.json` with `archetype` field populated.

If this file does not exist, is invalid, or lacks the archetype decision, you **MUST** return to the appropriate prior step.

## Step Instructions

### 01 / Reviewing Requirements and Archetype

Read `skill-requirements.json` and confirm:
1. The skill name and purpose
2. The selected archetype (simple, moderate, or complex)
3. The complexity indicators that informed the archetype decision

### 02 / Designing Directory Structure

Based on the archetype, design the directory structure:

**Simple Archetype**:
```
skill-name/
├── SKILL.md
└── README.md (optional)
```

**Moderate Archetype**:
```
skill-name/
├── SKILL.md
├── README.md
└── references/
    └── [reference-files].md
```

**Complex Archetype**:
```
skill-name/
├── SKILL.md
├── README.md
├── references/
│   ├── workflow/
│   │   └── [phase]/
│   │       └── [stage]/
│   │           └── [step].md
│   ├── schemas/
│   │   └── [schema-files].json
│   └── templates/ (optional)
├── scripts/
│   └── [script-files].js or .py
└── .claude/
    └── settings.local.json
```

### 03 / Planning Workflow Hierarchy

For Moderate and Complex archetypes, plan the workflow hierarchy:

1. **Identify Phases**: Group related work into phases separated by user approval gates
2. **Identify Stages**: Within each phase, group steps that share a common objective
3. **Identify Steps**: Define discrete units of work that produce homogeneous outputs

**Step Design Rules to Follow**:
- Each Step produces artifacts of the same type (e.g., all JSON, all Markdown)
- Each Step has uniform validation that applies to all its outputs
- Steps that would produce different artifact types **MUST** be split into separate Steps

### 04 / Defining Artifact Flow

Document how artifacts flow between steps:

1. **Input Dependencies**: What each step requires from prior steps
2. **Output Artifacts**: What each step produces
3. **Validation Points**: Where schema validation occurs
4. **User Checkpoints**: Where user approval is required

### 05 / Presenting Structure Plan

Present the complete structure plan to the user for approval. The presentation **MUST** include:

1. **Directory Structure**: Visual tree of all files and folders
2. **File Manifest**: List of every file to be generated with brief descriptions
3. **Workflow Hierarchy**: Phases, Stages, and Steps (if applicable)
4. **Generation Order**: Sequence in which files will be created
5. **Reference Integrity Check**: Confirmation that references are one-level deep from SKILL.md

## Output Validation Criteria

### Output Format

The output format of this workflow step is structured JSON. The JSON output **MUST** conform to the schema defined in `references/schemas/skill-structure.schema.json`.

### Output Content

The output **MUST** include the complete structure plan:

```json
{
  "skillName": "...",
  "archetype": "simple" | "moderate" | "complex",
  "directoryStructure": {
    "root": "skill-name",
    "files": [
      { "path": "SKILL.md", "type": "skill-definition" },
      { "path": "README.md", "type": "documentation" }
    ],
    "directories": [
      { "path": "references/workflow", "purpose": "workflow step references" }
    ]
  },
  "fileManifest": [
    {
      "path": "...",
      "type": "...",
      "description": "...",
      "generationOrder": 1
    }
  ],
  "workflowHierarchy": {
    "phases": [
      {
        "number": 1,
        "name": "...",
        "stages": [
          {
            "number": 1,
            "name": "...",
            "objective": "...",
            "steps": [
              {
                "number": 1,
                "name": "...",
                "referenceFile": "...",
                "outputArtifacts": ["..."],
                "validationType": "..."
              }
            ]
          }
        ]
      }
    ]
  },
  "artifactFlow": [
    {
      "from": "step-1",
      "to": "step-2",
      "artifact": "...",
      "validationRequired": true | false
    }
  ]
}
```

For Simple archetype, the `workflowHierarchy` and `artifactFlow` fields may be omitted or set to null.

### Validation Process

After constructing the `skill-structure.json` document:

1. **Schema Validation**: Run validation against the structure schema
   ```bash
   node scripts/validate-json.js \
     --schema references/schemas/skill-structure.schema.json \
     --instance skill-structure.json
   ```

2. **Reference Depth Check**: Verify that no reference file references another reference file (one-level deep rule)

3. **File Writing**: Save the validated structure to `skill-structure.json`

### Internal Use

The structure plan is used in Phase 3 (Implementation) to:
- Generate files in the correct order
- Apply appropriate templates based on archetype
- Create proper cross-references between files
- Validate the generated skill against the planned structure
