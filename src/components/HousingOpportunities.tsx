import { useState } from "react";
import { Building2, Home, Briefcase, CreditCard, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Home,
    title: "Affordable Housing",
    description: "Government-supervised apartments at fair prices with flexible payment plans",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Pay in monthly installments, not one lump sum. Plans up to 20 years",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    description: "Find employment in new desert cities with growing industries",
  },
  {
    icon: MapPin,
    title: "New Cities",
    description: "Modern infrastructure in desert development zones across Egypt",
  },
  {
    icon: Users,
    title: "Community Living",
    description: "Join thriving communities with schools, hospitals, and amenities",
  },
  {
    icon: Building2,
    title: "Quality Construction",
    description: "New buildings with modern standards under government quality control",
  },
];

const HousingOpportunities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (user) {
      // Scroll to contact section
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/auth");
    }
  };

  return (
    <section id="housing" className="py-24 lg:py-32 bg-muted/30 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
            New Opportunity
          </span>
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-accent-foreground" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Housing & <span className="text-gradient">Job Opportunities</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cities are expensive, but the desert has room to grow. The government is building new cities 
            with affordable housing and job opportunities. SHIFT helps you find your new home.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">The Problem We Solve</h3>
                <p className="text-muted-foreground">
                  Cairo and major cities are overcrowded and expensive. Many young Egyptians struggle to 
                  find affordable housing or good jobs. Meanwhile, new desert cities have modern 
                  infrastructure but need people.
                </p>
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">SHIFT connects you</span> to government-supervised 
                  housing programs with flexible payment plans and employment opportunities in these growing areas.
                </p>
              </div>
              <div className="w-full md:w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Building2 className="w-20 h-20 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button size="lg" onClick={handleApply} className="min-w-48">
              {user ? "Apply for Housing" : "Sign Up to Apply"}
            </Button>
            <span className="text-muted-foreground text-sm">
              Join thousands already building their future
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HousingOpportunities;
