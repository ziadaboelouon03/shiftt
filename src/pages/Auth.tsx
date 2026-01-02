import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type AuthStep = "info" | "verify" | "password";

const emailSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("info");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validation = emailSchema.safeParse({ fullName, email });
      if (!validation.success) {
        const fieldErrors: { [key: string]: string } = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Use custom OTP edge function that sends actual 6-digit codes
      const response = await supabase.functions.invoke("send-otp", {
        body: { email, fullName },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send code");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Verification code sent!",
        description: "Please check your email for the 6-digit code.",
      });
      setAuthStep("verify");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      toast({
        title: "Failed to send code",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (otpCode.length !== 6) {
        setErrors({ otp: "Please enter the 6-digit code" });
        setIsLoading(false);
        return;
      }

      // Verify OTP using custom edge function
      const response = await supabase.functions.invoke("verify-otp", {
        body: { email, code: otpCode },
      });

      if (response.error) {
        setErrors({ otp: response.error.message || "Verification failed" });
        setIsLoading(false);
        return;
      }

      if (!response.data?.valid) {
        setErrors({ otp: response.data?.error || "Invalid or expired code" });
        setIsLoading(false);
        return;
      }

      // OTP verified - now create/sign in the user with a generated password
      const tempPassword = `SHIFT_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      
      // Try to sign up the user (will fail if already exists, which is fine)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: { full_name: response.data.fullName || fullName },
        },
      });

      // If user already exists, sign them in with magic link approach
      if (signUpError?.message?.includes("already registered")) {
        // For existing users, we'll use the admin API approach
        toast({
          title: "Account exists",
          description: "Please use the sign-in form with your password.",
          variant: "destructive",
        });
        setIsSignUp(false);
        setAuthStep("info");
        setIsLoading(false);
        return;
      }

      if (signUpError) {
        throw signUpError;
      }

      toast({
        title: "Welcome to SHIFT!",
        description: "Your account has been created.",
      });
      navigate("/");
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      toast({
        title: "Verification failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email, fullName },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send code");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Code resent!",
        description: "Please check your email for the new code.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validation = signInSchema.safeParse({ email, password });
      if (!validation.success) {
        const fieldErrors: { [key: string]: string } = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSignUp = () => {
    setAuthStep("info");
    setOtpCode("");
    setPassword("");
    setErrors({});
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setAuthStep("info");
    setOtpCode("");
    setPassword("");
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStepTitle = () => {
    if (!isSignUp) return "Welcome back";
    switch (authStep) {
      case "info": return "Create your account";
      case "verify": return "Verify your email";
      default: return "Create your account";
    }
  };

  const renderSignUpContent = () => {
    switch (authStep) {
      case "info":
        return (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ahmed Mohamed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending code...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        );

      case "verify":
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
              {errors.otp && (
                <p className="text-sm text-destructive text-center">{errors.otp}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="w-full text-sm text-primary hover:underline"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={resetSignUp}
                className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Use a different email
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="text-4xl font-bold text-foreground">SHIFT</span>
          </a>
          <p className="text-muted-foreground mt-2">{getStepTitle()}</p>
        </div>

        {/* Progress Indicator for Sign Up */}
        {isSignUp && (
          <div className="flex justify-center gap-2 mb-6">
            {["info", "verify"].map((step, index) => (
              <div
                key={step}
                className={`h-2 w-16 rounded-full transition-colors ${
                  index <= ["info", "verify"].indexOf(authStep)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
          {isSignUp ? (
            renderSignUpContent()
          ) : (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;