import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { z } from "zod";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  governorate: z.string().min(1, "Please select a governorate"),
  housingType: z.string().min(1, "Please select housing type"),
  message: z.string().max(1000).optional(),
});

const governorates = [
  "New Cairo", "6th of October", "New Administrative Capital", 
  "El Alamein", "New Mansoura", "Borg El Arab",
  "New Assiut", "New Sohag", "New Minya"
];

const housingTypes = [
  "Studio Apartment", "1-Bedroom", "2-Bedroom", "3-Bedroom", "Villa"
];

const ContactForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    governorate: "",
    housingType: "",
    familySize: "",
    employmentStatus: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    const validation = applicationSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Please fill in required fields",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("housing_applications").insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        governorate: formData.governorate,
        housing_type: formData.housingType,
        family_size: formData.familySize ? parseInt(formData.familySize) : null,
        employment_status: formData.employmentStatus || null,
        message: formData.message || null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We will contact you soon with available options.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        governorate: "",
        housingType: "",
        familySize: "",
        employmentStatus: "",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
                Apply Now
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Start Your <span className="text-gradient">Application</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form to apply for housing or job opportunities in Egypt's new cities. 
                Our team will contact you with available options.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Available Locations</h4>
                  <p className="text-muted-foreground text-sm">New Cairo, 6th of October, New Administrative Capital, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Support Hotline</h4>
                  <p className="text-muted-foreground text-sm">16000 (Government Housing Helpline)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email Us</h4>
                  <p className="text-muted-foreground text-sm">info@shift.eg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
            {!user ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Please sign in to submit an application</p>
                <Button asChild>
                  <a href="/auth">Sign In / Sign Up</a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ahmed Mohamed"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20 xxx xxx xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familySize">Family Size</Label>
                    <Input
                      id="familySize"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.familySize}
                      onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="governorate">Preferred City *</Label>
                    <select
                      id="governorate"
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select a city</option>
                      {governorates.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="housingType">Housing Type *</Label>
                    <select
                      id="housingType"
                      value={formData.housingType}
                      onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select type</option>
                      {housingTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <select
                    id="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Select status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="seeking">Seeking Employment</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your needs..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Application
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
