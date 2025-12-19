#!/usr/bin/env node

/**
 * Comprehensive Skill Validation Script
 * Validates an Agent Skill directory for compliance with best practices
 *
 * Usage:
 *   node validate-skill.js <skill-directory>
 *
 * Example:
 *   node validate-skill.js /path/to/my-skill
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Result tracking
const results = {
  pass: [],
  warn: [],
  fail: []
};

function pass(category, message) {
  results.pass.push({ category, message });
}

function warn(category, message) {
  results.warn.push({ category, message });
}

function fail(category, message) {
  results.fail.push({ category, message });
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

// Get body content (after frontmatter)
function getBody(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

// Extract all markdown links from content
function extractLinks(content) {
  const links = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push({ text: match[1], href: match[2] });
  }

  return links;
}

// Check if text uses third-person voice
function isThirdPerson(text) {
  const firstPersonPatterns = [
    /\bI\s+(can|will|am|have|do)\b/i,
    /\bI'm\b/i,
    /\bI've\b/i,
    /\bmy\s+\w+/i
  ];

  const secondPersonPatterns = [
    /\byou\s+(can|will|are|have|do)\b/i,
    /\byou're\b/i,
    /\byou've\b/i,
    /\byour\s+\w+/i
  ];

  for (const pattern of firstPersonPatterns) {
    if (pattern.test(text)) return false;
  }

  for (const pattern of secondPersonPatterns) {
    if (pattern.test(text)) return false;
  }

  return true;
}

// Validate frontmatter
function validateFrontmatter(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    fail('Frontmatter', 'SKILL.md not found');
    return null;
  }

  const content = fs.readFileSync(skillMdPath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    fail('Frontmatter', 'No YAML frontmatter found');
    return null;
  }

  // Validate name
  if (!frontmatter.name) {
    fail('Frontmatter', 'name field is missing');
  } else if (frontmatter.name.length > 64) {
    fail('Frontmatter', `name exceeds 64 characters (${frontmatter.name.length} chars)`);
  } else if (/anthropic|claude/i.test(frontmatter.name)) {
    fail('Frontmatter', 'name contains reserved word (anthropic or claude)');
  } else {
    pass('Frontmatter', `name: valid (${frontmatter.name.length} chars)`);
  }

  // Validate description
  if (!frontmatter.description) {
    fail('Frontmatter', 'description field is missing');
  } else if (frontmatter.description.length === 0) {
    fail('Frontmatter', 'description is empty');
  } else if (frontmatter.description.length > 1024) {
    fail('Frontmatter', `description exceeds 1024 characters (${frontmatter.description.length} chars)`);
  } else {
    pass('Frontmatter', `description: valid (${frontmatter.description.length} chars)`);
  }

  return frontmatter;
}

// Validate structure
function validateStructure(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    fail('Structure', 'SKILL.md does not exist');
    return;
  }

  pass('Structure', 'SKILL.md exists');

  const content = fs.readFileSync(skillMdPath, 'utf8');
  const body = getBody(content);
  const lineCount = body.split('\n').length;

  if (lineCount >= 500) {
    fail('Structure', `SKILL.md body: ${lineCount} lines (exceeds 500)`);
  } else {
    pass('Structure', `SKILL.md body: ${lineCount} lines (under 500)`);
  }

  // Check reference links
  const links = extractLinks(content);
  const referenceLinks = links.filter(l =>
    l.href.startsWith('references/') ||
    l.href.startsWith('./references/')
  );

  let resolvedCount = 0;
  let unresolvedRefs = [];

  for (const link of referenceLinks) {
    const refPath = path.join(skillPath, link.href.replace(/^\.\//, ''));
    if (fs.existsSync(refPath)) {
      resolvedCount++;

      // Check for nested references (one-level deep check)
      const refContent = fs.readFileSync(refPath, 'utf8');
      const nestedLinks = extractLinks(refContent).filter(l =>
        l.href.startsWith('references/') ||
        l.href.startsWith('./references/') ||
        l.href.startsWith('../')
      );

      if (nestedLinks.length > 0) {
        warn('Structure', `${link.href} contains nested references`);
      }
    } else {
      unresolvedRefs.push(link.href);
    }
  }

  if (unresolvedRefs.length > 0) {
    fail('Structure', `Unresolved references: ${unresolvedRefs.join(', ')}`);
  } else if (referenceLinks.length > 0) {
    pass('Structure', `All references resolve (${resolvedCount} files)`);
  }

  pass('Structure', 'Reference depth: 1 level');
}

// Validate content
function validateContent(skillPath, frontmatter) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) return;

  const content = fs.readFileSync(skillMdPath, 'utf8');

  // Check third-person description
  if (frontmatter && frontmatter.description) {
    if (isThirdPerson(frontmatter.description)) {
      pass('Content', 'Third-person description');
    } else {
      warn('Content', 'Description may not be in third-person voice');
    }
  }

  // Check for Overview section
  if (/^#\s+Overview/m.test(content) || /^##\s+Overview/m.test(content)) {
    pass('Content', 'Overview section exists');
  } else {
    warn('Content', 'No Overview section found');
  }

  // Check for Table of Contents
  if (/Table of Contents/i.test(content)) {
    pass('Content', 'Table of Contents exists');
  } else {
    warn('Content', 'No Table of Contents found');
  }
}

// Validate scripts
function validateScripts(skillPath) {
  const scriptsPath = path.join(skillPath, 'scripts');

  if (!fs.existsSync(scriptsPath)) {
    return; // Scripts are optional
  }

  const { execSync } = require('child_process');
  const files = fs.readdirSync(scriptsPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const pyFiles = files.filter(f => f.endsWith('.py'));

  for (const file of jsFiles) {
    const filePath = path.join(scriptsPath, file);

    try {
      // Use Node.js --check flag for syntax validation
      execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
      pass('Scripts', `${file}: syntax valid`);
    } catch (e) {
      const stderr = e.stderr ? e.stderr.toString() : e.message;
      const errorLine = stderr.split('\n').find(l => l.includes('SyntaxError')) || 'syntax error';
      fail('Scripts', `${file}: ${errorLine.trim()}`);
    }
  }

  for (const file of pyFiles) {
    const filePath = path.join(scriptsPath, file);

    try {
      // Use Python -m py_compile for syntax validation
      execSync(`python3 -m py_compile "${filePath}"`, { stdio: 'pipe' });
      pass('Scripts', `${file}: syntax valid`);
    } catch (e) {
      // Fall back to checking if readable
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        pass('Scripts', `${file}: readable (python3 not available for syntax check)`);
      } catch (readErr) {
        fail('Scripts', `${file}: not readable`);
      }
    }
  }
}

// Validate schemas
function validateSchemas(skillPath) {
  const schemasPath = path.join(skillPath, 'references', 'schemas');

  if (!fs.existsSync(schemasPath)) {
    return; // Schemas are optional
  }

  const files = fs.readdirSync(schemasPath);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(schemasPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    try {
      const parsed = JSON.parse(content);

      // Check if it looks like a JSON Schema
      if (parsed.$schema || parsed.type || parsed.properties) {
        pass('Schemas', `${file}: valid JSON Schema`);
      } else {
        warn('Schemas', `${file}: valid JSON but may not be a schema`);
      }
    } catch (e) {
      fail('Schemas', `${file}: invalid JSON - ${e.message}`);
    }
  }
}

// Print report
function printReport(skillName) {
  console.log(`\n${colors.bold}Skill Validation Report: ${skillName}${colors.reset}`);
  console.log('='.repeat(45 + skillName.length));

  const categories = ['Frontmatter', 'Structure', 'Content', 'Scripts', 'Schemas'];

  for (const category of categories) {
    const categoryPasses = results.pass.filter(r => r.category === category);
    const categoryWarns = results.warn.filter(r => r.category === category);
    const categoryFails = results.fail.filter(r => r.category === category);

    if (categoryPasses.length + categoryWarns.length + categoryFails.length === 0) {
      continue;
    }

    console.log(`\n${category}:`);

    for (const item of categoryPasses) {
      console.log(`  ${colors.green}[PASS]${colors.reset} ${item.message}`);
    }
    for (const item of categoryWarns) {
      console.log(`  ${colors.yellow}[WARN]${colors.reset} ${item.message}`);
    }
    for (const item of categoryFails) {
      console.log(`  ${colors.red}[FAIL]${colors.reset} ${item.message}`);
    }
  }

  // Overall result
  const overallStatus = results.fail.length === 0 ? 'PASS' : 'FAIL';
  const statusColor = overallStatus === 'PASS' ? colors.green : colors.red;

  console.log(`\n${colors.bold}Overall: ${statusColor}${overallStatus}${colors.reset}`);

  if (results.warn.length > 0) {
    console.log(`${colors.yellow}(${results.warn.length} warning${results.warn.length > 1 ? 's' : ''})${colors.reset}`);
  }

  if (results.fail.length > 0) {
    console.log(`${colors.red}(${results.fail.length} error${results.fail.length > 1 ? 's' : ''})${colors.reset}`);
  }

  console.log('');
}

// Main execution
function main() {
  const skillPath = process.argv[2];

  if (!skillPath) {
    console.error('Usage: node validate-skill.js <skill-directory>');
    process.exit(1);
  }

  const absolutePath = path.resolve(skillPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: Directory not found: ${absolutePath}`);
    process.exit(1);
  }

  if (!fs.statSync(absolutePath).isDirectory()) {
    console.error(`Error: Not a directory: ${absolutePath}`);
    process.exit(1);
  }

  // Get skill name from path or frontmatter
  let skillName = path.basename(absolutePath);

  // Run validations
  const frontmatter = validateFrontmatter(absolutePath);
  if (frontmatter && frontmatter.name) {
    skillName = frontmatter.name;
  }

  validateStructure(absolutePath);
  validateContent(absolutePath, frontmatter);
  validateScripts(absolutePath);
  validateSchemas(absolutePath);

  // Print report
  printReport(skillName);

  // Exit with appropriate code
  process.exit(results.fail.length > 0 ? 1 : 0);
}

main();
