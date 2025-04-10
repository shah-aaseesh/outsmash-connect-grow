
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Network = () => {
  useEffect(() => {
    toast({
      title: "Network Page",
      description: "Manage your connections and discover new people.",
    });
  }, []);

  // Mock connection data
  const connections = [
    { id: 1, name: "Jordan Lee", username: "jordanl", avatar: "Jordan", mutual: 12, connected: true },
    { id: 2, name: "Morgan Taylor", username: "morgant", avatar: "Morgan", mutual: 8, connected: true },
    { id: 3, name: "Casey Williams", username: "caseyw", avatar: "Casey", mutual: 5, connected: true },
    { id: 4, name: "Riley Johnson", username: "rileyj", avatar: "Riley", mutual: 3, connected: true },
  ];

  const suggestions = [
    { id: 5, name: "Taylor Smith", username: "taylors", avatar: "Taylor", mutual: 15, connected: false },
    { id: 6, name: "Alex Rivera", username: "alexr", avatar: "Alex", mutual: 9, connected: false },
    { id: 7, name: "Jamie Chen", username: "jamiec", avatar: "Jamie", mutual: 7, connected: false },
    { id: 8, name: "Quinn Thomas", username: "quinnt", avatar: "Quinn", mutual: 4, connected: false },
  ];

  const handleConnect = (id: number) => {
    toast({
      title: "Connection Request Sent",
      description: "Your request has been sent successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-to-b from-primary/20 via-background to-background">
        {/* Network Header */}
        <header className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Your Network</h1>
            <p className="text-muted-foreground mt-2">
              Manage your connections and discover new people
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 gap-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <Input 
                    type="search" 
                    placeholder="Search for connections..." 
                    className="flex-1"
                  />
                  <Button>Search</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Connections/Suggestions Tabs */}
            <Tabs defaultValue="connections">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="connections">My Connections</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="connections">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connections.map((connection) => (
                        <div key={connection.id} className="flex items-center gap-4 p-4 rounded-lg border">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${connection.avatar}`} />
                            <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{connection.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">@{connection.username}</p>
                            <p className="text-xs text-muted-foreground">{connection.mutual} mutual connections</p>
                          </div>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="suggestions">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center gap-4 p-4 rounded-lg border">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.avatar}`} />
                            <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{suggestion.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">@{suggestion.username}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.mutual} mutual connections</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleConnect(suggestion.id)}
                          >
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Network;
