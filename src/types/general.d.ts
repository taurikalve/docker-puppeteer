declare module 'http' {
  interface IncomingHttpHeaders {
    'x-user-data'?: string;
  }
}
