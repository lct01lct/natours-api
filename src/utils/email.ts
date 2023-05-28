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
