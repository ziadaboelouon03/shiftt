import { Monitor, FileText, Wifi, HelpCircle } from "lucide-react";

const centerFeatures = [
  {
    icon: Monitor,
    title: "Doctor's Room",
    description: "A private consultation space with a computer for tele-health appointments with specialists",
  },
  {
    icon: FileText,
    title: "Document Desk",
    description: "A computer desk for processing ID papers, licenses, and government documents",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi Zone",
    description: "High-speed internet access where students and workers can connect for free",
  },
  {
    icon: HelpCircle,
    title: "Business Help Desk",
    description: "Expert guidance and support for starting and growing your small business",
  },
];

const ShiftCenter = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-warm relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
              The Experience
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              The <span className="text-gradient">SHIFT Center</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What does it look like? Imagine a clean, modern building in your town square—maybe an old school 
              or government building that was renovated.
            </p>
          </div>

          {/* Center Visualization */}
          <div className="relative">
            {/* Main Building Card */}
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elevated border border-border/50 overflow-hidden">
              {/* Inner Pattern */}
              <div className="absolute inset-0 geometric-pattern opacity-30" />
              
              <div className="relative z-10">
                {/* Building Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="text-primary font-semibold">Inside a SHIFT Center</span>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {centerFeatures.map((feature, index) => (
                    <div 
                      key={feature.title}
                      className="group bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Connecting Line */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShiftCenter;
