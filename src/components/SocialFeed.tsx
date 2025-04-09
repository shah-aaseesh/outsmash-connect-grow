import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

// Sample data for posts
const posts = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "High School",
      grade: "Junior"
    },
    content: "Just finished my science fair project on renewable energy! Can't wait to present next week. #ScienceFair #RenewableEnergy",
    likes: 24,
    comments: 5,
    timeAgo: "2h"
  },
  {
    id: 2,
    author: {
      name: "Maya Patel",
      avatar: "https://i.pravatar.cc/150?img=5",
      status: "Gap Year",
      grade: ""
    },
    content: "Started volunteering at the local animal shelter today. Such an amazing experience working with these beautiful creatures! Looking for more volunteer opportunities in environmental conservation. Any suggestions? #Volunteering #AnimalLover",
    likes: 38,
    comments: 12,
    timeAgo: "5h"
  },
  {
    id: 3,
    author: {
      name: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?img=8",
      status: "High School",
      grade: "Senior"
    },
    content: "Just got accepted to the summer coding bootcamp at Tech University! So excited to dive deeper into web development. If anyone else is attending, let's connect! #CodingBootcamp #WebDev #SummerPrograms",
    likes: 45,
    comments: 8,
    timeAgo: "1d"
  }
];

const SocialFeed = () => {
  const feedRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      if (feedRef.current) {
        const rect = feedRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        setIsInView(rect.top < viewportHeight * 0.75);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={feedRef} className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connect With The Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your achievements, ask questions, and engage with peers from around the world.
          </p>
        </div>

        <div className="max-w-2xl mx-auto h-[500px] relative perspective-1000">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              className="glass-card border-muted absolute w-full transition-all duration-700 ease-out backface-hidden"
              style={{ 
                transformStyle: "preserve-3d",
                zIndex: isInView ? posts.length - index : posts.length - index,
                top: isInView ? `${index * 20}px` : "0px",
                transform: isInView 
                  ? `translateY(0) rotate(${index * -2}deg)` 
                  : "translateY(0) rotate(0deg)",
                opacity: isInView ? 1 : index === 0 ? 1 : 0,
                transitionDelay: `${index * 200}ms`,
                boxShadow: isInView ? `0 ${index * 2}px ${index * 3}px rgba(0,0,0,0.1)` : "none"
              }}
            >
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-semibold">{post.author.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {post.author.status}
                    </Badge>
                    {post.author.grade && <span>{post.author.grade}</span>}
                    <span>• {post.timeAgo}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="border-t border-border pt-3 flex justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
