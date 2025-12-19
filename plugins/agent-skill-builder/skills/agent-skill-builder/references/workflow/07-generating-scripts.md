# Generating Scripts Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Identifying Scripts to Generate](#01--identifying-scripts-to-generate)
  - [02 / Selecting Script Language](#02--selecting-script-language)
  - [03 / Generating Validation Scripts](#03--generating-validation-scripts)
  - [04 / Generating Utility Scripts](#04--generating-utility-scripts)
  - [05 / Validating Scripts](#05--validating-scripts)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Script Standards](#script-standards)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on generating automation scripts for Complex archetype skills. Scripts handle validation, transformation, and other automated tasks that benefit from imperative code execution.

## Input Validation Criteria

This step applies only to **Complex** archetype skills.

**Required Inputs**:
- `skill-requirements.json` with `scriptLanguagePreference`
- `skill-structure.json` with scripts defined in file manifest

If the archetype is "simple" or "moderate", this step **SHOULD** be skipped.

## Step Instructions

### 01 / Identifying Scripts to Generate

From `skill-structure.json`, identify scripts to generate:

1. Review the `fileManifest` array
2. Filter for files with `type` = "script"
3. Common scripts include:
   - `validate-json.js/.py` - JSON schema validation
   - `validate-skill.js/.py` - Comprehensive skill validation

### 02 / Selecting Script Language

Based on `scriptLanguagePreference` in requirements:

- **"javascript"**: Generate `.js` files for Node.js execution
- **"python"**: Generate `.py` files for Python execution
- **"no-preference"**: Default to JavaScript

### 03 / Generating Validation Scripts

**JSON Validation Script** (`validate-json.js` or `validate-json.py`):

Purpose: Validate JSON files against JSON Schema

Requirements:
- Accept `--schema` and `--instance` arguments
- Load and parse schema file
- Load and parse instance file
- Perform validation
- Report success or detailed errors with JSON pointer locations
- Exit with code 0 on success, 1 on failure

**Skill Validation Script** (`validate-skill.js` or `validate-skill.py`):

Purpose: Comprehensive skill validation

Requirements:
- Accept skill directory path as argument
- Check SKILL.md exists
- Validate frontmatter (name ≤64 chars, description ≤1024 chars)
- Check SKILL.md body under 500 lines
- Verify all reference links resolve
- Check reference depth (one level)
- Validate script syntax (if present)
- Validate schema files (if present)
- Report results with PASS/WARN/FAIL indicators

### 04 / Generating Utility Scripts

If the skill requires additional utility scripts:

1. Identify the purpose of each script
2. Design the interface (arguments, inputs, outputs)
3. Implement with error handling
4. Document parameters (no magic numbers)

**Script Design Principles**:
- **Solve, don't punt**: Handle errors explicitly rather than failing silently
- **Self-documenting**: All constants should have comments explaining their purpose
- **Graceful degradation**: Provide helpful error messages for common issues
- **Dependency checking**: Check for required packages and provide install instructions

### 05 / Validating Scripts

After generating all scripts:

**For JavaScript**:
```bash
node --check scripts/validate-json.js
node --check scripts/validate-skill.js
```

**For Python**:
```bash
python3 -m py_compile scripts/validate_json.py
python3 -m py_compile scripts/validate_skill.py
```

## Output Validation Criteria

### Output Format

The output is script files in the `scripts/` directory.

### Script Standards

Generated scripts **MUST** follow these standards:

1. **Argument Parsing**: Use proper argument parsing (yargs/commander for JS, argparse for Python)
2. **Error Handling**: Catch and report errors with helpful messages
3. **Exit Codes**: Return 0 for success, non-zero for failure
4. **Dependencies**: Check for required packages at runtime
5. **Documentation**: Include usage comments at top of file

**JavaScript Script Template**:
```javascript
#!/usr/bin/env node

/**
 * Script Name - Brief description
 *
 * Usage: node script-name.js [options]
 *
 * Options:
 *   --option  Description of option
 */

const fs = require('fs');
const path = require('path');

// Constants with explanatory comments
const MAX_NAME_LENGTH = 64; // YAML frontmatter name limit

function main() {
  // Parse arguments
  // Perform operations
  // Handle errors
  // Report results
}

main();
```

**Python Script Template**:
```python
#!/usr/bin/env python3
"""
Script Name - Brief description

Usage: python3 script_name.py [options]

Options:
    --option  Description of option
"""

import argparse
import sys
import json

# Constants with explanatory comments
MAX_NAME_LENGTH = 64  # YAML frontmatter name limit

def main():
    # Parse arguments
    # Perform operations
    # Handle errors
    # Report results
    pass

if __name__ == '__main__':
    main()
```

### Internal Use

Generated scripts are executed during skill validation and workflow execution. They are referenced in workflow step files under "Validation Process" sections. You **MUST** inform the user when all scripts have been generated, list the files created, and note any required dependencies.
