
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import SocialFeed from "@/components/SocialFeed";
import { toast } from "@/hooks/use-toast";
import { Home, Users, MessageSquare, Settings } from "lucide-react";

// This is a mock auth check, in a real app you would use your auth provider
const isAuthenticated = true; // In production, this would come from your auth context

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Welcome toast when dashboard loads
    toast({
      title: "Welcome back!",
      description: "You've successfully logged into your dashboard.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/20 via-background to-background">
        {/* Dashboard Header */}
        <header className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Your Social Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Connect with others, share ideas, and discover opportunities.
            </p>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <div className="space-y-4 py-2">
                    <div className="px-3 py-2">
                      <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
                      <div className="space-y-1">
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md bg-primary/10 text-primary font-medium"
                          onClick={() => navigate('/dashboard')}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          <span>Feed</span>
                        </button>
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => navigate('/network')}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <span>My Network</span>
                        </button>
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => navigate('/opportunities')}
                        >
                          <span>Opportunities</span>
                        </button>
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => navigate('/messages')}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Messages</span>
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-2">
                      <h2 className="mb-2 px-4 text-lg font-semibold">Your Profile</h2>
                      <div className="space-y-1">
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => navigate('/profile')}
                        >
                          <span>View Profile</span>
                        </button>
                        <button 
                          className="w-full flex items-center py-2 px-4 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => navigate('/settings')}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feed */}
            <div className="lg:col-span-9">
              <SocialFeed dashboardMode={true} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
