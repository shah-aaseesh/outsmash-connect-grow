
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, CornerRightDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center md:max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight flex flex-col items-center">
            <span className={`inline-block transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              Connect & Grow with{" "}
            </span>
            <span className="text-gradient inline-block relative bg-[linear-gradient(to_right,#9b87f5,var(--accent),#9b87f5)] bg-[length:200%] animate-background-pan">
              <span className="absolute -top-7 -right-7">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse-slow" />
              </span>
              Outsmash
              <span className="absolute -bottom-6 -left-6">
                <Star className="h-5 w-5 text-primary animate-spin-slow" />
              </span>
            </span>
          </h1>
          
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto mb-8 rounded-full animate-pulse-slow"></div>
          
          <p className={`text-lg md:text-xl text-muted-foreground mb-10 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            The community platform where high school and gap year students showcase achievements, 
            build meaningful connections, and discover amazing opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
            <div className="absolute -top-12 right-1/4 md:right-1/3 transform rotate-12">
              <CornerRightDown className="h-8 w-8 text-accent/80 animate-bounce-slow" />
            </div>
            
            <Button 
              size="lg" 
              className={`text-md px-8 group relative overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <span className="relative z-10">Start Smashing Your Dreams</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-1 rounded-lg opacity-30 group-hover:opacity-100 blur-sm transition-all duration-300"></span>
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i} 
                  className="absolute inset-0 rounded-lg animate-ripple delay-300"
                  style={{ 
                    animationDelay: `${i * 0.5}s`,
                    border: '2px solid var(--primary)',
                    opacity: 0
                  }}
                ></span>
              ))}
            </Button>
            
            <Link to="/opportunities">
              <Button 
                size="lg" 
                variant="outline" 
                className={`text-md gap-2 group transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}
              >
                <span>Explore Opportunities</span> 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* SVG Path Animation */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <svg 
            className="absolute top-1/4 left-0 h-40 w-40 text-primary/30 opacity-70"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10,50 Q20,20 50,50 T90,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="animate-spin-slow"
            />
            <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse-slow" />
          </svg>
          
          <svg 
            className="absolute bottom-1/4 right-0 h-40 w-40 text-accent/30 opacity-70"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20,20 C40,40 60,0 80,20 S100,60 80,80 S40,100 20,80 S0,40 20,20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="animate-spin-slow"
              style={{ animationDuration: '20s' }}
            />
            <circle cx="20" cy="20" r="5" fill="currentColor" className="animate-pulse-slow" />
            <circle cx="80" cy="20" r="5" fill="currentColor" className="animate-pulse-slow" />
            <circle cx="80" cy="80" r="5" fill="currentColor" className="animate-pulse-slow" />
            <circle cx="20" cy="80" r="5" fill="currentColor" className="animate-pulse-slow" />
          </svg>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-float-delayed"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/40 rounded-full animate-ping-slow opacity-70"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/40 rounded-full animate-ping-slow opacity-70 delay-700"></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/80 animate-float"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i + 8}
            className="absolute w-2 h-2 rounded-full bg-accent/80 animate-float-delayed"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
