
"use server";

import twilio from 'twilio';

export async function sendSms(phone: string, message: string): Promise<{ success: boolean; message?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        const missingVars = [
            !accountSid && "TWILIO_ACCOUNT_SID",
            !authToken && "TWILIO_AUTH_TOKEN",
            !fromNumber && "TWILIO_PHONE_NUMBER"
        ].filter(Boolean).join(', ');
        
        const errorMsg = `Server configuration error: The following environment variables are not set: ${missingVars}. Please check your .env file.`;
        console.error(errorMsg);
        return { success: false, message: errorMsg };
    }

    try {
        const client = twilio(accountSid, authToken);
        const response = await client.messages.create({
            body: message,
            from: fromNumber,
            to: phone,
        });

        console.log("SMS sent successfully with SID:", response.sid);
        return { success: true };
    } catch (error: any) {
        console.error("Twilio error sending SMS:", error);
        return { success: false, message: `Twilio Error: ${error.message}` };
    }
}
