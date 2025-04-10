
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Mock authentication state - in a real app, this would come from your auth provider
const isAuthenticated = false; // Set to false initially to show login button

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const navigate = useNavigate();

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

  const handleLogin = () => {
    // Mock login process
    setAuthenticated(true);
    
    toast({
      title: "Login Successful",
      description: "Welcome back to Outsmash!",
    });
    
    // Redirect to dashboard after successful login
    navigate("/dashboard");
  };

  const handleLogout = () => {
    // Mock logout process
    setAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    
    // Redirect to home page after logout
    navigate("/");
  };

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
          {authenticated ? (
            <>
              <Button 
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="hidden md:inline-flex ml-2 transition-all hover:bg-primary/10 hover:border-primary/50"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="hidden md:inline-flex ml-2 transition-all hover:bg-primary/10 hover:border-primary/50"
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Button 
                className="hidden md:inline-flex group relative overflow-hidden"
                onClick={handleLogin}
              >
                <span className="relative z-10">Start Smashing Your Dreams</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
