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
    }
  }
}
