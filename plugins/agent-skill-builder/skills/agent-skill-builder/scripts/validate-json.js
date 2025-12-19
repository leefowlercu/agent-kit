#!/usr/bin/env node

/**
 * JSON Schema Validation Script
 * Validates a JSON instance against a JSON Schema (Draft 2020-12)
 *
 * Usage:
 *   node validate-json.js --schema <schema-file> --instance <json-file>
 *
 * Example:
 *   node validate-json.js \
 *     --schema references/schemas/skill-requirements.schema.json \
 *     --instance skill-requirements.json
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs(args) {
  const result = { schema: null, instance: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schema' && args[i + 1]) {
      result.schema = args[i + 1];
      i++;
    } else if (args[i] === '--instance' && args[i + 1]) {
      result.instance = args[i + 1];
      i++;
    }
  }

  return result;
}

// Load and parse JSON file
function loadJSON(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${e.message}`);
  }
}

// Validate type
function validateType(value, type, path) {
  const errors = [];
  const actualType = Array.isArray(value) ? 'array' : typeof value;

  if (Array.isArray(type)) {
    if (!type.includes(actualType) && !(type.includes('null') && value === null)) {
      errors.push(`${path}: expected one of [${type.join(', ')}], got ${actualType}`);
    }
  } else if (type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected array, got ${actualType}`);
    }
  } else if (type === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push(`${path}: expected object, got ${actualType}`);
    }
  } else if (type === 'integer') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      errors.push(`${path}: expected integer, got ${actualType}`);
    }
  } else if (type === 'null') {
    if (value !== null) {
      errors.push(`${path}: expected null, got ${actualType}`);
    }
  } else if (actualType !== type) {
    errors.push(`${path}: expected ${type}, got ${actualType}`);
  }

  return errors;
}

// Validate value against schema
function validate(value, schema, path = '$') {
  const errors = [];

  if (schema === true) return [];
  if (schema === false) return [`${path}: schema is false, no value allowed`];

  // Handle type validation
  if (schema.type) {
    errors.push(...validateType(value, schema.type, path));
    if (errors.length > 0 && !Array.isArray(schema.type)) return errors;
  }

  // Handle enum validation
  if (schema.enum) {
    if (!schema.enum.includes(value)) {
      errors.push(`${path}: value must be one of [${schema.enum.join(', ')}]`);
    }
  }

  // Handle const validation
  if (schema.const !== undefined) {
    if (value !== schema.const) {
      errors.push(`${path}: value must be ${JSON.stringify(schema.const)}`);
    }
  }

  // Handle string constraints
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: string length ${value.length} is less than minimum ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path}: string length ${value.length} exceeds maximum ${schema.maxLength}`);
    }
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push(`${path}: string does not match pattern ${schema.pattern}`);
      }
    }
  }

  // Handle number constraints
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: value ${value} is less than minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: value ${value} exceeds maximum ${schema.maximum}`);
    }
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      errors.push(`${path}: value ${value} must be greater than ${schema.exclusiveMinimum}`);
    }
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
      errors.push(`${path}: value ${value} must be less than ${schema.exclusiveMaximum}`);
    }
  }

  // Handle array validation
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: array length ${value.length} is less than minimum ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path}: array length ${value.length} exceeds maximum ${schema.maxItems}`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validate(item, schema.items, `${path}[${index}]`));
      });
    }
    if (schema.uniqueItems) {
      const seen = new Set();
      value.forEach((item, index) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          errors.push(`${path}[${index}]: duplicate item in array with uniqueItems`);
        }
        seen.add(key);
      });
    }
  }

  // Handle object validation
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // Check required properties
    if (schema.required) {
      for (const prop of schema.required) {
        if (!(prop in value)) {
          errors.push(`${path}: missing required property "${prop}"`);
        }
      }
    }

    // Validate properties
    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        if (prop in value) {
          errors.push(...validate(value[prop], propSchema, `${path}.${prop}`));
        }
      }
    }

    // Check additionalProperties
    if (schema.additionalProperties === false) {
      const allowedProps = new Set(Object.keys(schema.properties || {}));
      for (const prop of Object.keys(value)) {
        if (!allowedProps.has(prop)) {
          errors.push(`${path}: additional property "${prop}" is not allowed`);
        }
      }
    } else if (typeof schema.additionalProperties === 'object') {
      const allowedProps = new Set(Object.keys(schema.properties || {}));
      for (const [prop, propValue] of Object.entries(value)) {
        if (!allowedProps.has(prop)) {
          errors.push(...validate(propValue, schema.additionalProperties, `${path}.${prop}`));
        }
      }
    }
  }

  return errors;
}

// Main execution
function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.schema || !args.instance) {
    console.error('Usage: node validate-json.js --schema <schema-file> --instance <json-file>');
    process.exit(1);
  }

  try {
    const schema = loadJSON(args.schema);
    const instance = loadJSON(args.instance);

    const errors = validate(instance, schema);

    if (errors.length === 0) {
      console.log(`✓ Validation successful: ${args.instance} conforms to ${args.schema}`);
      process.exit(0);
    } else {
      console.error(`✗ Validation failed: ${errors.length} error(s) found\n`);
      errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
      });
      process.exit(1);
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
