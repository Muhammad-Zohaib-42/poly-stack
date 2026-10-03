import {BrevoClient, Brevo, BrevoError} from "@getbrevo/brevo"
import { config } from "../config/config.js";

const brevo = new BrevoClient({
  apiKey: config.BREVO_API_KEY
})

export async function sendEmail(name, email, html) {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Verify Your Email - PolyStack",
      sender: { name: "PolyStack", email: config.SENDER_EMAIL },
      to: [{ name, email }],
      htmlContent: html
    });

    console.log('Email sent:', result);
  } catch (err) {
    if (err instanceof Brevo.UnauthorizedError) {
      console.error('Invalid API key');
    } else if (err instanceof Brevo.TooManyRequestsError) {
      const retryAfter = err.rawResponse.headers['retry-after'];
      console.error(`Rate limited. Retry after ${retryAfter} seconds`);
    } else if (err instanceof BrevoError) {
      console.error(`API Error ${err.statusCode}:`, err.message);
    }
  }
}