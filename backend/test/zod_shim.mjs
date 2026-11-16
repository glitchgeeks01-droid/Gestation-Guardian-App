/**
 * Lightweight Zod Shim for Standalone Test Execution
 * Implements core schema parsing and validation semantics conforming to Zod API.
 * Scope: backend/test/
 */

export class ZodError extends Error {
  constructor(issues = []) {
    super(JSON.stringify(issues));
    this.name = 'ZodError';
    this.issues = issues;
  }
}

class BaseSchema {
  constructor() {
    this._checks = [];
    this._optional = false;
    this._nullable = false;
  }

  optional() {
    const s = Object.create(this);
    s._optional = true;
    return s;
  }

  nullable() {
    const s = Object.create(this);
    s._nullable = true;
    return s;
  }

  refine(fn, message) {
    const s = Object.create(this);
    s._refinements = [...(this._refinements || []), { fn, message }];
    return s;
  }

  safeParse(val) {
    try {
      const parsed = this.parse(val);
      return { success: true, data: parsed };
    } catch (err) {
      if (err instanceof ZodError) {
        return { success: false, error: err };
      }
      return { success: false, error: new ZodError([{ message: err.message }]) };
    }
  }
}

class ZodNumber extends BaseSchema {
  constructor() {
    super();
    this._min = null;
    this._max = null;
    this._isInt = false;
  }

  int(msg) {
    this._isInt = true;
    this._intMsg = msg;
    return this;
  }

  min(limit, msg) {
    this._min = { limit, msg: typeof msg === 'string' ? msg : msg?.message };
    return this;
  }

  max(limit, msg) {
    this._max = { limit, msg: typeof msg === 'string' ? msg : msg?.message };
    return this;
  }

  positive(msg) {
    return this.min(1, msg);
  }

  parse(val) {
    if (val === undefined && this._optional) return undefined;
    if (val === null && this._nullable) return null;
    if (typeof val !== 'number' || isNaN(val)) {
      throw new ZodError([{ code: 'invalid_type', expected: 'number', received: typeof val, message: 'Expected number' }]);
    }
    if (this._isInt && !Number.isInteger(val)) {
      throw new ZodError([{ code: 'not_an_integer', message: this._intMsg || 'Expected integer' }]);
    }
    if (this._min !== null && val < this._min.limit) {
      throw new ZodError([{ code: 'too_small', minimum: this._min.limit, message: this._min.msg || `Number must be >= ${this._min.limit}` }]);
    }
    if (this._max !== null && val > this._max.limit) {
      throw new ZodError([{ code: 'too_big', maximum: this._max.limit, message: this._max.msg || `Number must be <= ${this._max.limit}` }]);
    }
    if (this._refinements) {
      for (const r of this._refinements) {
        if (!r.fn(val)) {
          throw new ZodError([{ code: 'custom', message: r.message || 'Validation failed' }]);
        }
      }
    }
    return val;
  }
}

class ZodString extends BaseSchema {
  constructor() {
    super();
    this._min = null;
    this._max = null;
    this._regex = null;
  }

  min(limit, msg) {
    this._min = { limit, msg: typeof msg === 'string' ? msg : msg?.message };
    return this;
  }

  max(limit, msg) {
    this._max = { limit, msg: typeof msg === 'string' ? msg : msg?.message };
    return this;
  }

  regex(re, msg) {
    this._regex = { re, msg };
    return this;
  }

  url(msg) {
    return this.refine(v => {
      try { new URL(v); return true; } catch { return false; }
    }, msg);
  }

  parse(val) {
    if (val === undefined && this._optional) return undefined;
    if (val === null && this._nullable) return null;
    if (typeof val !== 'string') {
      throw new ZodError([{ code: 'invalid_type', expected: 'string', received: typeof val, message: 'Expected string' }]);
    }
    if (this._min !== null && val.length < this._min.limit) {
      throw new ZodError([{ code: 'too_small', minimum: this._min.limit, message: this._min.msg || `String length must be >= ${this._min.limit}` }]);
    }
    if (this._max !== null && val.length > this._max.limit) {
      throw new ZodError([{ code: 'too_big', maximum: this._max.limit, message: this._max.msg || `String length must be <= ${this._max.limit}` }]);
    }
    if (this._regex !== null && !this._regex.re.test(val)) {
      throw new ZodError([{ code: 'invalid_string', message: this._regex.msg || 'String does not match format' }]);
    }
    if (this._refinements) {
      for (const r of this._refinements) {
        if (!r.fn(val)) {
          throw new ZodError([{ code: 'custom', message: r.message || 'Validation failed' }]);
        }
      }
    }
    return val;
  }
}

class ZodArray extends BaseSchema {
  constructor(elementSchema) {
    super();
    this.elementSchema = elementSchema;
    this._min = null;
    this._max = null;
  }

  min(limit, msg) {
    this._min = limit;
    return this;
  }

  max(limit, msg) {
    this._max = limit;
    return this;
  }

  parse(val) {
    if (val === undefined && this._optional) return undefined;
    if (val === null && this._nullable) return null;
    if (!Array.isArray(val)) {
      throw new ZodError([{ code: 'invalid_type', expected: 'array', received: typeof val, message: 'Expected array' }]);
    }
    if (this._min !== null && val.length < this._min) {
      throw new ZodError([{ code: 'too_small', message: `Array must have at least ${this._min} items` }]);
    }
    if (this._max !== null && val.length > this._max) {
      throw new ZodError([{ code: 'too_big', message: `Array must have at most ${this._max} items` }]);
    }
    return val.map(item => this.elementSchema.parse(item));
  }
}

class ZodObject extends BaseSchema {
  constructor(shape) {
    super();
    this.shape = shape;
    this._strict = false;
  }

  strict() {
    const s = Object.create(this);
    s._strict = true;
    return s;
  }

  parse(val) {
    if (val === undefined && this._optional) return undefined;
    if (val === null && this._nullable) return null;
    if (typeof val !== 'object' || val === null || Array.isArray(val)) {
      throw new ZodError([{ code: 'invalid_type', expected: 'object', received: typeof val, message: 'Expected object' }]);
    }

    const issues = [];
    const result = {};

    for (const [key, schema] of Object.entries(this.shape)) {
      try {
        const parsedField = schema.parse(val[key]);
        if (parsedField !== undefined) {
          result[key] = parsedField;
        }
      } catch (err) {
        if (err instanceof ZodError) {
          issues.push(...err.issues.map(iss => ({ ...iss, path: [key, ...(iss.path || [])] })));
        } else {
          issues.push({ path: [key], message: err.message });
        }
      }
    }

    if (this._strict) {
      for (const key of Object.keys(val)) {
        if (!(key in this.shape)) {
          issues.push({ code: 'unrecognized_keys', keys: [key], message: `Unrecognized key '${key}'` });
        }
      }
    }

    if (issues.length > 0) {
      throw new ZodError(issues);
    }

    if (this._refinements) {
      for (const r of this._refinements) {
        if (!r.fn(result)) {
          throw new ZodError([{ code: 'custom', message: r.message || 'Validation failed' }]);
        }
      }
    }

    return result;
  }
}

class ZodEnum extends BaseSchema {
  constructor(values) {
    super();
    this.values = values;
  }

  default(val) {
    this._default = val;
    return this;
  }

  parse(val) {
    if (val === undefined && this._default !== undefined) return this._default;
    if (!this.values.includes(val)) {
      throw new ZodError([{ code: 'invalid_enum_value', message: `Expected one of ${this.values.join(', ')}` }]);
    }
    return val;
  }
}

export const z = {
  object: (shape) => new ZodObject(shape),
  string: (opts) => new ZodString(),
  number: (opts) => new ZodNumber(),
  array: (schema) => new ZodArray(schema),
  enum: (values) => new ZodEnum(values),
  coerce: {
    number: () => new ZodNumber()
  }
};
