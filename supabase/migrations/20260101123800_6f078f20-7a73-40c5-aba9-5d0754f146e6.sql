-- Remove all insecure public policies from otp_codes table
-- The secure edge functions (send-otp, verify-otp) use service role key which bypasses RLS

DROP POLICY IF EXISTS "Anyone can verify OTP codes" ON public.otp_codes;
DROP POLICY IF EXISTS "Anyone can create OTP codes" ON public.otp_codes;
DROP POLICY IF EXISTS "Anyone can update OTP codes" ON public.otp_codes;

-- No public policies needed - all OTP operations go through secure edge functions