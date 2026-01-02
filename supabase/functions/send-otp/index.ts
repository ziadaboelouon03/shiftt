import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOtpRequest {
  email: string;
  fullName: string;
}

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: SendOtpRequest = await req.json();
    
    console.log("Sending OTP to:", email);

    // Generate OTP code
    const otpCode = generateOtp();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mark any existing unused codes for this email as used
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("email", email)
      .eq("used", false);

    // Store OTP in database
    const { error: dbError } = await supabase.from("otp_codes").insert({
      email,
      full_name: fullName,
      code: otpCode,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store OTP code");
    }

    // Send email with OTP
    const emailResponse = await resend.emails.send({
      // NOTE: Resend requires a verified domain/sender. Using resend.dev works without domain verification.
      from: "SHIFT <onboarding@resend.dev>",
      to: [email],
      subject: "Your SHIFT Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px; text-align: center;">Welcome to SHIFT</h1>
            <p style="color: #666666; font-size: 16px; text-align: center; margin-bottom: 32px;">Hi ${fullName}, here's your verification code:</p>
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px;">${otpCode}</span>
            </div>
            <p style="color: #888888; font-size: 14px; text-align: center; margin-bottom: 0;">This code expires in 10 minutes.</p>
            <p style="color: #888888; font-size: 14px; text-align: center;">If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailResponse?.error) {
      console.error("Resend error:", emailResponse.error);
      throw new Error(emailResponse.error.message ?? "Failed to send email");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse?.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
