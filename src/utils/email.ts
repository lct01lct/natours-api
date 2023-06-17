import { User } from '@/models';
import nodemailer from 'nodemailer';

export interface EmailOptions {
  email: string;
  subject?: string;
  message?: string;
}

export const sendEmail = async ({ email: to, subject, message: text }: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME.replace('your-mail', '0bbd8ebb352b78'),
      pass: process.env.DATABASE_PASSWORD.replace('your-password', '0bbd8ebb352b78'),
    },
  });

  await transporter.sendMail({ from: 'Liuchuntao <hello@liuchuntao.io>', to, subject, text });
};

export class Email {
  private to: string;
  private firstName: string;
  private form = `Liuchuntao <${process.env.EMAIL_FROM}>`;

  constructor(user: User, private url: string) {
    this.to = user.email;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      // @ts-ignore
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME.replace('your-mail', '0bbd8ebb352b78'),
        pass: process.env.DATABASE_PASSWORD.replace('your-password', '0bbd8ebb352b78'),
      },
    });
  }

  async send(template: string, subject: string) {}

  async sendWelcome() {
    this.send('Welcome', 'Welcome to the Natours Family!');
  }
}
