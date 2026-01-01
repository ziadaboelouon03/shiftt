import { LucideIcon } from "lucide-react";

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  benefit: string;
  accentColor: "primary" | "accent";
  index: number;
}

const PillarCard = ({ icon: Icon, title, problem, solution, benefit, accentColor, index }: PillarCardProps) => {
  const isEven = index % 2 === 0;
  
  return (
    <div 
      className={`group relative bg-gradient-card rounded-2xl p-8 md:p-10 shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-${accentColor}/30 overflow-hidden`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${accentColor}/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Number Badge */}
      <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        accentColor === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
      }`}>
        {index + 1}
      </div>

      <div className="relative z-10 space-y-6">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
          accentColor === "primary" ? "bg-primary/10" : "bg-accent/10"
        } group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${accentColor === "primary" ? "text-primary" : "text-accent"}`} />
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h3>

        {/* Problem */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The Problem</span>
          <p className="text-muted-foreground leading-relaxed">{problem}</p>
        </div>

        {/* Solution */}
        <div className="space-y-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            accentColor === "primary" ? "text-primary" : "text-accent"
          }`}>The SHIFT Solution</span>
          <p className="text-foreground leading-relaxed font-medium">{solution}</p>
        </div>

        {/* Benefit */}
        <div className={`p-4 rounded-xl ${
          accentColor === "primary" ? "bg-primary/5 border-l-4 border-primary" : "bg-accent/5 border-l-4 border-accent"
        }`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The Benefit</span>
          <p className={`mt-1 font-semibold ${accentColor === "primary" ? "text-primary" : "text-accent"}`}>
            {benefit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PillarCard;
