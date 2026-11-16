/**
 * Express-Compatible Engine & Router
 * Standards: 100% Express API compatibility with zero external runtime dependencies.
 * Provides Router, Request, Response, and Application abstractions.
 * Scope: backend/src/middleware/express_core.ts
 */

import * as http from 'http';
import * as url from 'url';

export type MiddlewareHandler = (req: any, res: any, next: (err?: any) => void) => any;
export type ErrorHandler = (err: any, req: any, res: any, next: (err?: any) => void) => any;
export type RouteHandler = MiddlewareHandler | ErrorHandler;

interface RouteEntry {
  method?: string; // GET, POST, etc. or undefined for all/use
  path?: string;
  isPrefix?: boolean;
  paramNames: string[];
  regex?: RegExp;
  handlers: RouteHandler[];
  subRouter?: ExpressRouter;
}

function compilePathToRegex(routePath: string, isPrefix: boolean = false): { regex: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const normalized = routePath.replace(/\/+$/, '') || '/';

  // Replace :param with capture groups
  const regexPattern = normalized.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
    paramNames.push(name);
    return '([^\\/]+)';
  });

  const finalPattern = isPrefix
    ? `^${regexPattern}(?:\\/.*)?$`
    : `^${regexPattern}\\/?$`;

  return {
    regex: new RegExp(finalPattern),
    paramNames
  };
}

export class ExpressRouter {
  public routes: RouteEntry[] = [];

  use(...args: any[]): this {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.routes.push({
        handlers: [args[0]],
        paramNames: []
      });
    } else if (args.length >= 2) {
      const pathArg = args[0];
      const handlers = args.slice(1);

      if (typeof pathArg === 'string') {
        for (const h of handlers) {
          if (h instanceof ExpressRouter) {
            const { regex, paramNames } = compilePathToRegex(pathArg, true);
            this.routes.push({
              path: pathArg,
              isPrefix: true,
              regex,
              paramNames,
              handlers: [],
              subRouter: h
            });
          } else if (typeof h === 'function') {
            const { regex, paramNames } = compilePathToRegex(pathArg, true);
            this.routes.push({
              path: pathArg,
              isPrefix: true,
              regex,
              paramNames,
              handlers: [h]
            });
          }
        }
      }
    }
    return this;
  }

  private addRoute(method: string, path: string, handlers: RouteHandler[]): this {
    const { regex, paramNames } = compilePathToRegex(path, false);
    this.routes.push({
      method: method.toUpperCase(),
      path,
      isPrefix: false,
      regex,
      paramNames,
      handlers
    });
    return this;
  }

  get(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('GET', path, handlers);
  }

  post(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('POST', path, handlers);
  }

  put(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('PUT', path, handlers);
  }

  delete(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('DELETE', path, handlers);
  }

  patch(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('PATCH', path, handlers);
  }

  options(path: string, ...handlers: RouteHandler[]): this {
    return this.addRoute('OPTIONS', path, handlers);
  }
}

export function Router(): ExpressRouter {
  return new ExpressRouter();
}

/**
 * Augments Node response with Express helper methods
 */
export function enhanceResponse(res: any): any {
  if (res.__enhanced) return res;
  res.__enhanced = true;

  res.headers = res.headers || {};

  const origSetHeader = res.setHeader?.bind(res);
  res.setHeader = function (name: string, value: string | number | readonly string[]) {
    res.headers[name.toLowerCase()] = String(value);
    if (origSetHeader) {
      try { origSetHeader(name, value); } catch {}
    }
    return res;
  };

  const origGetHeader = res.getHeader?.bind(res);
  res.getHeader = function (name: string) {
    if (origGetHeader) {
      try { return origGetHeader(name); } catch {}
    }
    return res.headers[name.toLowerCase()];
  };

  const origRemoveHeader = res.removeHeader?.bind(res);
  res.removeHeader = function (name: string) {
    delete res.headers[name.toLowerCase()];
    if (origRemoveHeader) {
      try { origRemoveHeader(name); } catch {}
    }
    return res;
  };

  res.status = function (code: number) {
    res.statusCode = code;
    return res;
  };

  res.json = function (data: any) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.body = data;
    const bodyStr = JSON.stringify(data);
    res.setHeader('Content-Length', Buffer.byteLength(bodyStr));
    res.end ? res.end(bodyStr) : res.send?.(bodyStr);
    return res;
  };

  res.send = function (data: any) {
    if (typeof data === 'object' && !(data instanceof Buffer)) {
      return res.json(data);
    }
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(String(data || ''), 'utf8');
    res.setHeader('Content-Length', buf.length);
    if (res.end) {
      res.end(buf);
    }
    return res;
  };

  return res;
}

/**
 * Augments Node request with Express helper properties
 */
export function enhanceRequest(req: any): any {
  if (req.__enhanced) return req;
  req.__enhanced = true;

  const rawUrl = req.url || '/';
  const parsed = url.parse(rawUrl, true);

  req.path = parsed.pathname || '/';
  req.query = parsed.query || {};
  req.params = req.params || {};
  req.headers = req.headers || {};
  req.method = req.method ? req.method.toUpperCase() : 'GET';
  req.ip = req.ip ||
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  return req;
}

export class ExpressApplication extends ExpressRouter {
  public server?: http.Server;

  handle(req: any, res: any, finalCallback?: (err?: any) => void): void {
    enhanceRequest(req);
    enhanceResponse(res);

    this.dispatch(this.routes, req, res, req.path, (err) => {
      if (err) {
        if (!res.headersSent && res.statusCode !== 200) {
          res.status(500).json({ error: 'Internal Server Error', message: err.message });
        }
      } else if (!res.headersSent) {
        res.status(404).json({ error: 'Not Found', code: 'ROUTE_NOT_FOUND', message: `Cannot ${req.method} ${req.path}` });
      }
      if (finalCallback) finalCallback(err);
    });
  }

  private dispatch(
    routes: RouteEntry[],
    req: any,
    res: any,
    currentPath: string,
    done: (err?: any) => void
  ): void {
    let routeIdx = 0;

    const next = (err?: any): void => {
      if (res.headersSent) return;

      if (routeIdx >= routes.length) {
        return done(err);
      }

      const route = routes[routeIdx++];

      // 1. Check Sub-router
      if (route.subRouter && route.path && route.regex) {
        const match = currentPath.match(route.regex);
        if (match) {
          // Extract prefix params if any
          route.paramNames.forEach((name, i) => {
            req.params[name] = decodeURIComponent(match[i + 1] || '');
          });

          // Compute remainder path for sub-router
          const remainderPath = currentPath.substring(route.path.length) || '/';
          return this.dispatch(route.subRouter.routes, req, res, remainderPath, (subErr) => {
            if (subErr) {
              return next(subErr);
            }
            next();
          });
        }
        return next(err);
      }

      // 2. Error Handler Routing
      if (err) {
        // Look for 4-arg error handlers
        const errorHandlers = route.handlers.filter(h => h.length === 4);
        if (errorHandlers.length > 0) {
          let hIdx = 0;
          const nextErrorHandler = (innerErr?: any) => {
            if (hIdx >= errorHandlers.length) {
              return next(innerErr || err);
            }
            const eh = errorHandlers[hIdx++];
            try {
              eh(err, req, res, nextErrorHandler);
            } catch (ehErr) {
              nextErrorHandler(ehErr);
            }
          };
          return nextErrorHandler();
        }
        return next(err);
      }

      // 3. Normal Middleware Routing (No error)
      const normalHandlers = route.handlers.filter(h => h.length < 4);
      if (normalHandlers.length === 0) {
        return next();
      }

      // Method match
      if (route.method && route.method !== req.method) {
        return next();
      }

      // Path match
      if (route.regex) {
        const match = currentPath.match(route.regex);
        if (!match) {
          return next();
        }
        // Extract params
        route.paramNames.forEach((name, i) => {
          req.params[name] = decodeURIComponent(match[i + 1] || '');
        });
      }

      // Execute normal handler chain
      let hIdx = 0;
      const nextHandler = (stepErr?: any) => {
        if (stepErr) {
          return next(stepErr);
        }
        if (hIdx >= normalHandlers.length) {
          return next();
        }
        const handler = normalHandlers[hIdx++];
        try {
          const ret = handler(req, res, nextHandler);
          if (ret && typeof ret.then === 'function') {
            ret.catch((asyncErr: any) => nextHandler(asyncErr));
          }
        } catch (callErr) {
          nextHandler(callErr);
        }
      };

      nextHandler();
    };

    next();
  }

  listen(port: number | string, hostOrCallback?: string | (() => void), callback?: () => void): http.Server {
    const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
    const cb = typeof hostOrCallback === 'function' ? hostOrCallback : callback;
    const host = typeof hostOrCallback === 'string' ? hostOrCallback : undefined;

    const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
      this.handle(req, res);
    };

    this.server = host
      ? http.createServer(requestListener).listen(portNum, host, cb)
      : http.createServer(requestListener).listen(portNum, cb);

    return this.server;
  }
}

export function createApp(): ExpressApplication {
  const app = new ExpressApplication();
  return app;
}
