
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialFeed from "@/components/SocialFeed";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <SocialFeed />
        <OpportunitiesSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
