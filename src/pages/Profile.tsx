
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SocialFeed from "@/components/SocialFeed";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  useEffect(() => {
    // Success toast when profile loads
    toast({
      title: "Profile loaded",
      description: "Welcome to your profile page.",
    });
  }, []);

  // Mock profile data - in a real app, this would come from your API
  const profile = {
    name: "Alex Johnson",
    username: "alexj",
    bio: "Digital enthusiast, coffee lover, and tech professional. Always looking for new connections and opportunities to collaborate on exciting projects.",
    followers: 245,
    following: 187,
    posts: 42,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-to-b from-primary/20 via-background to-background">
        {/* Profile Header */}
        <header className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your profile information
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Profile Info Card */}
            <div className="lg:col-span-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    
                    <div className="flex justify-center gap-6 my-4">
                      <div className="text-center">
                        <p className="font-bold">{profile.followers}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{profile.following}</p>
                        <p className="text-xs text-muted-foreground">Following</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{profile.posts}</p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm mb-6">{profile.bio}</p>
                    
                    <Button className="w-full">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Additional Profile Sections */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">Web Development</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">UX Design</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">AI</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">Photography</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">Music</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Email: alex.j@example.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: San Francisco, CA
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Profile Feed */}
            <div className="lg:col-span-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <SocialFeed profileMode={true} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
