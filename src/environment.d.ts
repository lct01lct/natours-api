export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      DATABASE: string;
      DATABASE_LOCAL: string;
      DATABASE_PASSWORD: string;
      JWT_SECRET: string;
      JWT_EXPIRED_IN: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
    }
  }
}
