import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import EmailService from "../Services/EmailService";

async function sendVerificationEmail(userEmail: string, verificationToken: string): Promise<boolean> {
    const templatePath = path.join(__dirname, '../templates/verification-email.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    
    const verificationUrl = `${process.env.API_BASE_URL}/auth/verify-email?token=${verificationToken}`;
    
    const html = template({
      userEmail,
      verificationUrl,
      supportEmail: process.env.EMAIL_USER,
      appName:"Mainstack Test"
    });

    try {
      const emailService = new EmailService()
      await emailService.sendEmail({
        recipient: userEmail,
        subject: 'Verify Your Email Address',
        html,
      });
      return true;
    } catch (error) {
      console.error('Verification email error:', error);
      return false;
    }
  }

  export default sendVerificationEmail;
