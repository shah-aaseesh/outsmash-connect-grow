
import { Bell, MessageSquare, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-primary text-2xl font-bold">Outsmash</span>
          </div>
        </div>

        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search for people, opportunities, or topics..."
            className="pl-10 py-2 bg-secondary border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden md:inline-flex ml-2">
            Log In
          </Button>
          <Button className="hidden md:inline-flex">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
