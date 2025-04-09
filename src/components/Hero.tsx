
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
            <Button size="lg" className="text-md px-8 animate-bounce-slow">
              Start Smashing Your Dreams
            </Button>
            <Link to="/opportunities">
              <Button size="lg" variant="outline" className="text-md gap-2 animate-pulse-slow">
                Explore Opportunities <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements with enhanced animations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-float-delayed"></div>
        
        {/* Additional animated elements */}
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/40 rounded-full animate-ping-slow opacity-70"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/40 rounded-full animate-ping-slow opacity-70 delay-700"></div>
      </div>
    </section>
  );
};

export default Hero;
