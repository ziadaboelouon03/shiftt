import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type AuthStep = "info" | "email-sent" | "set-password";

const emailSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("info");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user came from magic link (needs to set password)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If user has a session but no password set (came from magic link)
      if (session?.user) {
        const hasPassword = session.user.user_metadata?.has_password;
        if (!hasPassword) {
          setIsSettingPassword(true);
          setAuthStep("set-password");
          setEmail(session.user.email || "");
          setFullName(session.user.user_metadata?.full_name || "");
        } else {
          // User already has password, redirect to home
          navigate("/");
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
    // If user is fully set up, redirect to home
    if (!loading && user && !isSettingPassword) {
      const hasPassword = user.user_metadata?.has_password;
      if (hasPassword) {
        navigate("/");
      }
    }
  }, [user, loading, navigate, isSettingPassword]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
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

      // Send magic link using Supabase (free!)
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            has_password: false, // Will be set to true after password setup
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Check your email!",
        description: "We sent you a verification link.",
      });
      setAuthStep("email-sent");
    } catch (err: any) {
      console.error("Error sending magic link:", err);
      toast({
        title: "Failed to send email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validation = passwordSchema.safeParse({ password, confirmPassword });
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

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password,
        data: {
          has_password: true,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password set successfully!",
        description: "Please sign in with your new password.",
      });

      // Sign out and redirect to sign in
      await supabase.auth.signOut();
      setIsSettingPassword(false);
      setIsSignUp(false);
      setAuthStep("info");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error setting password:", err);
      toast({
        title: "Failed to set password",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMagicLink = async () => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            has_password: false,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email resent!",
        description: "Please check your inbox.",
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
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setAuthStep("info");
    setPassword("");
    setConfirmPassword("");
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
    if (isSettingPassword) return "Set your password";
    if (!isSignUp) return "Welcome back";
    switch (authStep) {
      case "info": return "Create your account";
      case "email-sent": return "Check your email";
      default: return "Create your account";
    }
  };

  const renderSignUpContent = () => {
    if (isSettingPassword || authStep === "set-password") {
      return (
        <form onSubmit={handleSetPassword} className="space-y-5">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-muted-foreground text-sm">
              Email verified! Now set your password for <span className="font-medium text-foreground">{email}</span>
            </p>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Setting password...
              </span>
            ) : (
              "Set Password & Continue"
            )}
          </Button>
        </form>
      );
    }

    switch (authStep) {
      case "info":
        return (
          <form onSubmit={handleSendMagicLink} className="space-y-5">
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
                  Sending link...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        );

      case "email-sent":
        return (
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Check your email</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We sent a verification link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Click the link in your email to verify and set your password.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendMagicLink}
                disabled={isLoading}
                className="w-full text-sm text-primary hover:underline"
              >
                {isLoading ? "Sending..." : "Resend email"}
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
          </div>
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
        {isSignUp && !isSettingPassword && (
          <div className="flex justify-center gap-2 mb-6">
            {["info", "email-sent"].map((step, index) => (
              <div
                key={step}
                className={`h-2 w-16 rounded-full transition-colors ${
                  index <= ["info", "email-sent"].indexOf(authStep)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
          {isSignUp || isSettingPassword ? (
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

          {!isSettingPassword && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
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
