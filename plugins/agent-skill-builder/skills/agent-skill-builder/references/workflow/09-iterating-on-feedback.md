# Iterating on Feedback Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Gathering User Feedback](#01--gathering-user-feedback)
  - [02 / Categorizing Feedback](#02--categorizing-feedback)
  - [03 / Implementing Changes](#03--implementing-changes)
  - [04 / Re-validating](#04--re-validating)
  - [05 / Confirming Completion](#05--confirming-completion)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Iteration Guidelines](#iteration-guidelines)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on iterating on the generated skill based on user feedback. Iteration is a critical part of skill development, allowing refinements based on real-world testing and user observations.

## Input Validation Criteria

This step requires:
- Completed validation from Phase 4 (Step 8)
- User feedback on the generated skill

This step is the sole focus of Phase 5: Iteration. This step may be repeated multiple times based on user needs.

## Step Instructions

### 01 / Gathering User Feedback

Collect feedback from the user about the generated skill:

1. **Testing Results**: Ask if the user has tested the skill and what issues they encountered
2. **Behavioral Observations**: Ask if the skill behaves as expected
3. **Missing Features**: Ask if any capabilities are missing
4. **Improvements**: Ask for any suggested improvements

**Feedback Collection Questions**:
- "Have you had a chance to test the generated skill?"
- "Did the skill invoke correctly when expected?"
- "Were there any unexpected behaviors or errors?"
- "Is there anything you'd like to change or improve?"

### 02 / Categorizing Feedback

Categorize each piece of feedback:

| Category | Description | Priority |
|----------|-------------|----------|
| **Bug** | Skill doesn't work as documented | High |
| **Missing Feature** | Expected capability not present | Medium |
| **Enhancement** | Improvement to existing functionality | Medium |
| **Documentation** | Clarification or correction needed | Low |
| **Style** | Formatting or consistency issue | Low |

### 03 / Implementing Changes

For each feedback item, determine the appropriate response:

**Bugs**:
1. Identify the root cause
2. Determine which file(s) need modification
3. Make the correction
4. Document the change

**Missing Features**:
1. Assess impact on archetype (may require upgrade from Simple to Moderate/Complex)
2. Update structure plan if needed
3. Generate new artifacts
4. Update existing artifacts to reference new content

**Enhancements**:
1. Evaluate feasibility and scope
2. Implement changes
3. Update related documentation

**Documentation Issues**:
1. Locate the affected section
2. Make corrections
3. Verify related content is consistent

### 04 / Re-validating

After implementing changes, re-run validation:

1. Execute the validation script
2. Review the updated validation report
3. Confirm all issues from previous validation are resolved
4. Confirm no new issues were introduced

### 05 / Confirming Completion

Present the changes to the user:

1. **Summary of Changes**: List all modifications made
2. **Updated Validation Report**: Show the new validation results
3. **Next Steps**: Ask if additional iteration is needed

**Iteration Loop**:
```
Feedback → Categorize → Implement → Validate → Present → [Repeat or Complete]
```

Continue iterating until the user confirms the skill meets their requirements.

## Output Validation Criteria

### Output Format

The output is an updated skill with changes based on user feedback.

### Iteration Guidelines

**When to Iterate**:
- User reports issues during testing
- Validation reveals problems
- User requests changes or improvements

**When to Complete**:
- User confirms skill works as expected
- Validation passes without errors
- No further changes requested

**Iteration Limits**:
- There is no fixed limit on iterations
- Each iteration should address specific feedback
- Avoid scope creep - major new features may warrant a new skill

### Internal Use

This step is designed to be repeated until the user is satisfied with the generated skill. You **SHOULD**:
- Keep track of changes made across iterations
- Maintain a changelog of modifications
- Ensure each iteration improves the skill

You **MUST** ask the user if they want to continue iterating or if they are satisfied with the current state of the skill.
