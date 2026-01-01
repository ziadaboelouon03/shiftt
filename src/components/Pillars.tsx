import { Stethoscope, Building, Radio, Banknote } from "lucide-react";
import PillarCard from "./PillarCard";

const pillarsData = [
  {
    icon: Stethoscope,
    title: "Medical",
    subtitle: "Your Doctor is Just Down the Street",
    problem: "People move to Cairo because they think the \"best\" doctors are only there.",
    solution: "Small clinics in your town with Tele-Health screens. You sit in a private room and talk to the top specialists in Cairo via video.",
    benefit: "You get \"Big City\" healthcare without the \"Big City\" travel costs or traffic.",
    accentColor: "primary" as const,
  },
  {
    icon: Building,
    title: "Government",
    subtitle: "No More Trips to the \"Mugamma\"",
    problem: "To get a passport, a license, or a birth certificate, you often have to travel to a major city office.",
    solution: "Digital kiosks in your local SHIFT center. If you can use an ATM, you can use SHIFT. You scan your papers, and a clerk in Cairo approves them instantly from miles away.",
    benefit: "Save your time and your money. Your local center handles everything.",
    accentColor: "accent" as const,
  },
  {
    icon: Radio,
    title: "Media",
    subtitle: "Telling Your Story",
    problem: "TV shows and news make it look like \"success\" only happens in Cairo.",
    solution: "We use social media and local \"Hub Studios\" to show that you can be a successful business owner or a happy family in a smaller town.",
    benefit: "It changes the way we think. It makes people proud of their hometowns instead of wanting to leave them.",
    accentColor: "primary" as const,
  },
  {
    icon: Banknote,
    title: "Financial",
    subtitle: "Jobs Where You Live",
    problem: "It's hard to start a business in a small town because the banks and the big money are all in the capital.",
    solution: "SHIFT centers offer \"Stay-Local\" grants. If you start a business in a secondary city, you get lower taxes and easier loans.",
    benefit: "Better jobs for youth in their own governorates, so they don't have to leave their families to find work.",
    accentColor: "accent" as const,
  },
];

const Pillars = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest">
            Four Pillars
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            How SHIFT <span className="text-gradient">Transforms</span> Lives
          </h2>
          <p className="text-lg text-muted-foreground">
            Four key areas that bring essential services to your doorstep
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {pillarsData.map((pillar, index) => (
            <PillarCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              problem={pillar.problem}
              solution={pillar.solution}
              benefit={pillar.benefit}
              accentColor={pillar.accentColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
