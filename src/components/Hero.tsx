import { Button } from "@/components/ui/button";
import { ArrowDown, MapPin, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToContent = () => {
    document.getElementById("what-is-shift")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Modern Egyptian cityscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-5 py-2 text-primary-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Decentralizing Egypt's Future</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-up text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-tight" style={{ animationDelay: "0.1s" }}>
            <span className="block">SHIFT</span>
          </h1>

          {/* Tagline */}
          <p className="animate-fade-up text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 font-medium leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Bringing the Heart of the City to Your Doorstep
          </p>

          {/* Subtext */}
          <p className="animate-fade-up text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto" style={{ animationDelay: "0.3s" }}>
            Move the service to the people, so the people don't have to move.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center pt-4" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="lg" onClick={scrollToContent}>
              <Heart className="w-5 h-5" />
              Discover SHIFT
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <button 
            onClick={scrollToContent}
            className="flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
