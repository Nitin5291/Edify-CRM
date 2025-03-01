import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "YOUR_ACCOUNT_SID";
const authToken = process.env.TWILIO_ACCOUNT_TOKEN || "YOUR_AUTH_TOKEN";
const twilioClient = twilio(accountSid, authToken);

export { twilioClient };
