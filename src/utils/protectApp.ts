import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore;
import xssClean from 'xss-clean';
import hpp from 'hpp';

export function protectApp(app: Express, path: string = '/api') {
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this ip, please try again one hour!',
  }); // allow 100 REQUESTs from the same ip in one hour.

  app.use(path, limiter);

  // Set security HTTP headers
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],

        fontSrc: ["'self'", 'https:', 'data:'],

        scriptSrc: ["'self'", 'https://*.cloudflare.com'],

        scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],

        styleSrc: ["'self'", 'https:', 'unsafe-inline'],

        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com'],
      },
    })
  );

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against cross-site scripting
  app.use(xssClean());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    })
  );
}
