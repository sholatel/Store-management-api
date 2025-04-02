import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ISendEmailOptions } from '../Interfaces/custom.interface';

dotenv.config();




class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send email to a single recipient
   */
  async sendEmail(options: ISendEmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Mainstack Test" <${process.env.EMAIL_USER}>`,
        to: options.recipient,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Verify transporter connection
   */
  async verifyConnection(): Promise<boolean> {
    return this.transporter.verify()
      .then(() => true)
      .catch(() => false);
  }
}

export default EmailService;