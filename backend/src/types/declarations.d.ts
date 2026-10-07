declare module 'js-yaml';
declare module 'uuid';
declare module 'express' {
  export interface Request {
    body: unknown;
    params: Record<string, string>;
    query: Record<string, string>;
    url: string;
    method: string;
  }
  export interface Response {
    status(code: number): Response;
    json(body: unknown): Response;
  }
  export interface NextFunction {
    (err?: unknown): void;
  }
}
