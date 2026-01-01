import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";

const Summary = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Large Quote Mark */}
      <div className="absolute top-20 left-10 text-primary/5">
        <Quote className="w-40 h-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
              The Summary
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              In Simple Terms
            </h2>
          </div>

          {/* Summary Content */}
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed text-center">
              SHIFT stops Cairo from getting too crowded by making sure you 
              <span className="text-gradient font-bold"> don't need to go there</span>.
            </p>

            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              By putting doctors, government offices, and financial resources into smaller towns, 
              people can enjoy a <span className="text-foreground font-semibold">"Big City" life</span> in 
              a <span className="text-foreground font-semibold">"Small Town" setting</span>.
            </p>

            {/* Quote Block */}
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center shadow-elevated relative overflow-hidden">
              <div className="absolute inset-0 geometric-pattern opacity-20" />
              <blockquote className="relative z-10">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-tight">
                  "Move the service to the people, so the people don't have to move."
                </p>
              </blockquote>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button variant="hero" size="lg">
                Join the Movement
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;
