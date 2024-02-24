import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: 'k.borysenko.kyiv@gmail.com' };
  await sgMail.send(email);
  return true;
}

export default sendEmail;