
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Link to="/" className="text-primary text-2xl font-bold">Outsmash</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:inline-flex ml-2">
            Log In
          </Button>
          <Button className="hidden md:inline-flex">
            Start Smashing Your Dreams
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
