import { Building2, Users, TrendingUp } from "lucide-react";

const WhatIsShift = () => {
  return (
    <section id="what-is-shift" className="py-24 lg:py-32 bg-gradient-warm relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
              The Vision
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              What is <span className="text-gradient">SHIFT</span>?
            </h2>
          </div>

          {/* Main Content */}
          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl md:text-2xl text-foreground font-medium text-center">
              Right now, millions of people crowd into Cairo because that's where the best hospitals, 
              government offices, and jobs are. This makes the city too crowded and the countryside too quiet.
            </p>

            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border/50">
              <p className="text-center text-foreground text-xl md:text-2xl font-semibold">
                SHIFT is a plan to build <span className="text-gradient">Mini-Service Centers</span> in 
                smaller towns and secondary cities.
              </p>
              <p className="text-center mt-4 text-muted-foreground">
                It moves the "important stuff" out of Cairo so you can live, work, and stay healthy 
                exactly where you are.
              </p>
            </div>
          </div>

          {/* Stats/Impact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 hover:border-primary/30">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Decentralized Services</h3>
              <p className="text-muted-foreground text-sm">Essential services brought directly to secondary cities</p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 hover:border-primary/30">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Community Focused</h3>
              <p className="text-muted-foreground text-sm">People can thrive in their hometowns with their families</p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 hover:border-primary/30">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Economic Growth</h3>
              <p className="text-muted-foreground text-sm">Local businesses flourish with accessible resources</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsShift;
