import { defineMiddleware } from 'astro:middleware';

// Define the middleware
export const onRequest = defineMiddleware(async (context, next) => {
  // Allow all requests to proceed normally
  return next();
}); 