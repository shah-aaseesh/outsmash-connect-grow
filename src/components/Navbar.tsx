
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b py-3 px-4 transition-all duration-300 ${
        scrolled 
          ? "border-border/80 bg-background/90 shadow-lg" 
          : "border-transparent bg-background/50"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Link 
              to="/" 
              className={`text-primary text-2xl font-bold relative transition-all duration-700 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-background-pan">
                Outsmash
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </div>
        </div>

        <div className={`flex items-center gap-2 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <Button 
            variant="outline" 
            className="hidden md:inline-flex ml-2 transition-all hover:bg-primary/10 hover:border-primary/50"
          >
            Log In
          </Button>
          <Button 
            className="hidden md:inline-flex group relative overflow-hidden"
          >
            <span className="relative z-10">Start Smashing Your Dreams</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
