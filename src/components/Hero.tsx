
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center md:max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in">
            Connect & Grow with <span className="text-gradient">Outsmash</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
            The community platform where high school and gap year students showcase achievements, 
            build meaningful connections, and discover amazing opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Button size="lg" className="text-md px-8">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="text-md gap-2">
              Explore Opportunities <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
      </div>
    </section>
  );
};

export default Hero;
