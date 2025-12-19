# Generating Schemas Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Identifying Schemas to Generate](#01--identifying-schemas-to-generate)
  - [02 / Designing Schema Structure](#02--designing-schema-structure)
  - [03 / Generating Each Schema File](#03--generating-each-schema-file)
  - [04 / Validating Schemas](#04--validating-schemas)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Schema Standards](#schema-standards)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on generating JSON schemas for Complex archetype skills. Schemas are used to validate intermediate artifacts between workflow steps, ensuring data integrity throughout the skill's execution.

## Input Validation Criteria

This step applies only to **Complex** archetype skills.

**Required Inputs**:
- `skill-requirements.json` with archetype = "complex"
- `skill-structure.json` with artifact flow defined

If the archetype is "simple" or "moderate", this step **SHOULD** be skipped.

## Step Instructions

### 01 / Identifying Schemas to Generate

From `skill-structure.json`, identify which artifacts require schema validation:

1. Review the `artifactFlow` array
2. Identify artifacts where `validationRequired` = true
3. For each such artifact, a schema file is needed

Common schemas for skill workflows include:
- Requirements schema (validating gathered requirements)
- Structure schema (validating structure plans)
- Output schemas (validating step outputs)

### 02 / Designing Schema Structure

For each schema to generate, design its structure:

1. **Identify Required Fields**: What properties must always be present?
2. **Define Types**: What type is each property (string, number, array, object)?
3. **Set Constraints**: What constraints apply (minLength, enum values, patterns)?
4. **Handle Optional Fields**: Which properties are optional?

### 03 / Generating Each Schema File

For each schema file:

**Sub-step 01: Create Schema Header**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "[Schema Title]",
  "description": "[What this schema validates]",
  "type": "object"
}
```

**Sub-step 02: Define Properties**
```json
{
  "properties": {
    "fieldName": {
      "type": "string",
      "description": "...",
      "minLength": 1
    }
  }
}
```

**Sub-step 03: Define Required Fields**
```json
{
  "required": ["field1", "field2"]
}
```

**Sub-step 04: Set Additional Properties**
```json
{
  "additionalProperties": false
}
```

Setting `additionalProperties: false` enforces strict validation - no unexpected fields allowed.

**Sub-step 05: Write Schema File**
- Write to `references/schemas/[schema-name].schema.json`
- Use descriptive naming (e.g., `skill-requirements.schema.json`)

### 04 / Validating Schemas

After generating all schema files:

1. **Syntax Validation**: Ensure each schema is valid JSON
2. **Schema Validation**: Ensure each schema is a valid JSON Schema
3. **Cross-Reference**: Verify schema file names match references in workflow steps

## Output Validation Criteria

### Output Format

The output is multiple JSON Schema files in `references/schemas/`.

### Schema Standards

Generated schemas **MUST** follow these standards:

1. **Version**: Use JSON Schema Draft 2020-12
2. **Strict Mode**: Set `additionalProperties: false` for strict validation
3. **Required Fields**: Explicitly list all required properties
4. **Types**: Specify types for all properties
5. **Descriptions**: Include descriptions for complex properties
6. **Enums**: Use enum constraints for properties with fixed values

**Example Schema Structure**:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Skill Requirements",
  "description": "Schema for validating skill requirements gathered in Step 1",
  "type": "object",
  "additionalProperties": false,
  "required": ["skillName", "purpose", "archetype"],
  "properties": {
    "skillName": {
      "type": "string",
      "description": "Name of the skill",
      "minLength": 1,
      "maxLength": 64
    },
    "purpose": {
      "type": "string",
      "description": "Primary purpose of the skill",
      "minLength": 1
    },
    "archetype": {
      "type": "string",
      "description": "Selected skill archetype",
      "enum": ["simple", "moderate", "complex"]
    }
  }
}
```

### Internal Use

Generated schemas are used by validation scripts to ensure data integrity. They are referenced in workflow step files under "Validation Process" sections. You **MUST** inform the user when all schemas have been generated and list the schema files created.
