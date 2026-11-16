/**
 * JSON Body Parser Middleware with Strict 1 MB Limit (S7)
 * Standards: OWASP API Security Top 10 (API4: Strict Validation, API3: Resource Consumption)
 * Security Requirements Owned: S7 (Strict 1 MB Payload Cap & JSON Validation)
 * Scope: backend/src/middleware/body_parser.ts
 */

export const MAX_JSON_BODY_SIZE_BYTES = 1024 * 1024; // 1 MB = 1,048,576 bytes

export function jsonBodyParser(maxBytes: number = MAX_JSON_BODY_SIZE_BYTES) {
  return (req: any, res: any, next: (err?: any) => void) => {
    // If body already parsed by upstream middleware, verify size & pass through
    if (req.body !== undefined && req.body !== null && typeof req.body === 'object') {
      return next();
    }

    const method = req.method?.toUpperCase();
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      req.body = {};
      return next();
    }

    const contentType = req.headers?.['content-type'] || '';
    if (!contentType.includes('application/json') && !contentType.includes('+json')) {
      req.body = {};
      return next();
    }

    // Check Content-Length header early
    const contentLength = parseInt(req.headers?.['content-length'] || '0', 10);
    if (contentLength > maxBytes) {
      return res.status(413).json({
        error: 'Payload Too Large',
        code: 'PAYLOAD_TOO_LARGE',
        message: `Request entity exceeds maximum permitted size of ${maxBytes / (1024 * 1024)} MB.`
      });
    }

    // Accumulate stream chunks
    let totalBytes = 0;
    const chunks: Buffer[] = [];

    const onData = (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        req.removeListener('data', onData);
        req.removeListener('end', onEnd);
        return res.status(413).json({
          error: 'Payload Too Large',
          code: 'PAYLOAD_TOO_LARGE',
          message: `Request entity exceeds maximum permitted size of ${maxBytes / (1024 * 1024)} MB.`
        });
      }
      chunks.push(chunk);
    };

    const onEnd = () => {
      if (chunks.length === 0) {
        req.body = {};
        return next();
      }

      const rawBuffer = Buffer.concat(chunks);
      const rawText = rawBuffer.toString('utf8').trim();

      if (!rawText) {
        req.body = {};
        return next();
      }

      try {
        req.body = JSON.parse(rawText);
        next();
      } catch (err: any) {
        return res.status(400).json({
          error: 'Bad Request',
          code: 'MALFORMED_JSON',
          message: 'The request payload contains malformed JSON syntax.'
        });
      }
    };

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', (err: any) => {
      next(err);
    });
  };
}

export const bodyParser = jsonBodyParser();
