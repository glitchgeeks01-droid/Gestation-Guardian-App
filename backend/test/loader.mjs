import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'zod') {
    try {
      return await nextResolve(specifier, context);
    } catch {
      const shimPath = path.resolve(__dirname, 'zod_shim.mjs');
      return nextResolve(pathToFileURL(shimPath).href, context);
    }
  }

  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' && context.parentURL && (specifier.startsWith('./') || specifier.startsWith('../'))) {
      const parentPath = fileURLToPath(context.parentURL);
      const parentDir = path.dirname(parentPath);
      
      const candidates = [
        specifier + '.ts',
        specifier + '.js',
        path.join(specifier, 'index.ts'),
        path.join(specifier, 'index.js')
      ];

      for (const cand of candidates) {
        const resolvedPath = path.resolve(parentDir, cand);
        if (fs.existsSync(resolvedPath)) {
          return nextResolve(pathToFileURL(resolvedPath).href, context);
        }
      }
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url.endsWith('.ts')) {
    let source = typeof result.source === 'string'
      ? result.source
      : (result.source ? Buffer.from(result.source).toString('utf8') : null);

    if (source) {
      let modified = false;
      // Convert value imports of pure interfaces into type imports for strip-only mode
      if (source.includes("import { Queryable } from '../core/audit'")) {
        source = source.replace("import { Queryable } from '../core/audit'", "import type { Queryable } from '../core/audit'");
        modified = true;
      }
      if (source.includes("import { Queryable } from '../core/audit';")) {
        source = source.replace("import { Queryable } from '../core/audit';", "import type { Queryable } from '../core/audit';");
        modified = true;
      }
      if (modified) {
        return {
          ...result,
          source
        };
      }
    }
  }
  return result;
}
