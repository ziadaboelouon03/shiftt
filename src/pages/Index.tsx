import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIsShift from "@/components/WhatIsShift";
import Pillars from "@/components/Pillars";
import ShiftCenter from "@/components/ShiftCenter";
import Summary from "@/components/Summary";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SHIFT – Bringing the Heart of the City to Your Doorstep</title>
        <meta 
          name="description" 
          content="SHIFT decentralizes essential services across Egypt, bringing healthcare, government services, and economic opportunities to secondary cities and towns." 
        />
        <meta name="keywords" content="SHIFT, Egypt, decentralization, healthcare, government services, secondary cities, economic development" />
        <link rel="canonical" href="https://shift.eg" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Hero />
          <WhatIsShift />
          <Pillars />
          <ShiftCenter />
          <Summary />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
