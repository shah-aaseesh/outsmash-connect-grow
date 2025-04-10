import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2, Send, Smile, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

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
    comments: [
      {
        id: 101,
        author: {
          name: "Maya Patel",
          avatar: "https://i.pravatar.cc/150?img=5"
        },
        content: "That's amazing! What renewable energy source did you focus on?",
        timeAgo: "1h"
      }
    ],
    timeAgo: "2h",
    color: "primary" // First card color
  }
];

const morePosts = [
  {
    id: 4,
    author: {
      name: "Taylor Reynolds",
      avatar: "https://i.pravatar.cc/150?img=10",
      status: "College",
      grade: "Freshman"
    },
    content: "I'm organizing a weekend hackathon focused on climate tech solutions. We need more participants! DM me if you're interested in joining our team. #ClimateAction #Hackathon",
    likes: 32,
    comments: [
      {
        id: 401,
        author: {
          name: "Jordan Lee",
          avatar: "https://i.pravatar.cc/150?img=8"
        },
        content: "This sounds amazing! I've been working on an app for tracking carbon footprints. Would love to join!",
        timeAgo: "30m"
      }
    ],
    timeAgo: "4h",
    color: "warning"
  },
  {
    id: 5,
    author: {
      name: "Sam Rivera",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "Graduate Student",
      grade: ""
    },
    content: "Just published my research paper on AI applications in educational technology! If any high school students are interested in AI, I'm running a virtual workshop next month. #AI #EdTech #STEM",
    likes: 47,
    comments: [
      {
        id: 501,
        author: {
          name: "Alex Johnson",
          avatar: "https://i.pravatar.cc/150?img=1"
        },
        content: "I'd love to attend your workshop! I've been learning Python and want to get into AI.",
        timeAgo: "1h"
      }
    ],
    timeAgo: "6h",
    color: "info"
  }
];

const SocialFeed = ({ dashboardMode = false }) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [allPosts, setAllPosts] = useState(posts);
  
  useEffect(() => {
    if (dashboardMode) {
      setAllPosts([...posts, ...morePosts]);
      setIsInView(true);
    } else {
      setAllPosts(posts);
      
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
    }
  }, [dashboardMode]);

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleCommentSubmit = (postId: number) => {
    if (commentInputs[postId]?.trim()) {
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully!",
      });
      
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));
    }
  };

  const toggleLike = (postId: number) => {
    setUserLikes(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    toast({
      title: userLikes.includes(postId) ? "Post Unliked" : "Post Liked",
      description: userLikes.includes(postId) 
        ? "You have removed your like from this post." 
        : "You liked a post!",
      variant: "default",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Post",
      description: "Sharing options opened",
    });
  };

  const [newPostContent, setNewPostContent] = useState("");
  const handleNewPost = () => {
    if (newPostContent.trim()) {
      toast({
        title: "Post Created",
        description: "Your post has been published successfully!",
      });
      setNewPostContent("");
    }
  };

  return (
    <section ref={feedRef} className={dashboardMode ? "" : "py-12 md:py-20"}>
      <div className={dashboardMode ? "" : "max-w-7xl mx-auto px-4 sm:px-6"}>
        {!dashboardMode && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connect With The Community
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your achievements, ask questions, and engage with peers from around the world.
            </p>
          </div>
        )}

        <div className={dashboardMode ? "" : "max-w-6xl mx-auto"}>
          {dashboardMode && (
            <Card className="mb-6">
              <CardContent className="p-4 pt-5">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Share what's on your mind..."
                      className="mb-3"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Plus className="h-3 w-3 mr-1" /> Photo
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Plus className="h-3 w-3 mr-1" /> Link
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handleNewPost}
                        disabled={!newPostContent.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className={`grid grid-cols-1 ${dashboardMode ? "" : "md:grid-cols-3"} gap-6`}>
            {allPosts.map((post, index) => {
              const colorClasses = {
                primary: "bg-gradient-to-br from-rose-500/30 to-rose-700/30 border-rose-500/40 hover:bg-gradient-to-br hover:from-rose-500/40 hover:to-rose-700/40",
                accent: "bg-gradient-to-br from-amber-500/30 to-amber-700/30 border-amber-500/40 hover:bg-gradient-to-br hover:from-amber-500/40 hover:to-amber-700/40",
                secondary: "bg-gradient-to-br from-violet-500/30 to-violet-700/30 border-violet-500/40 hover:bg-gradient-to-br hover:from-violet-500/40 hover:to-violet-700/40",
                warning: "bg-gradient-to-br from-orange-500/30 to-orange-700/30 border-orange-500/40 hover:bg-gradient-to-br hover:from-orange-500/40 hover:to-orange-700/40",
                info: "bg-gradient-to-br from-cyan-500/30 to-cyan-700/30 border-cyan-500/40 hover:bg-gradient-to-br hover:from-cyan-500/40 hover:to-cyan-700/40"
              };
              
              const isLiked = userLikes.includes(post.id);
              const showComments = expandedComments.includes(post.id);
              
              return (
                <Card 
                  key={post.id} 
                  className={`glass-card border-2 transition-all duration-700 ease-out ${colorClasses[post.color as keyof typeof colorClasses]}`}
                  style={{ 
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(50px)',
                    transitionDelay: `${index * 200}ms`,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.25)'
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${showComments ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments.length}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-primary"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="grid gap-3">
                          <div className="text-sm font-medium">Share this post</div>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" className="w-full">
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              Email
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              Social
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                  
                  {showComments && (
                    <div className="px-6 pb-4 space-y-3">
                      <div className="text-sm font-medium">Comments</div>
                      
                      <div className="space-y-3">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex items-start gap-2 pt-2 border-t border-border">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{comment.author.name}</span>
                                <span className="text-xs text-muted-foreground">• {comment.timeAgo}</span>
                              </div>
                              <p className="text-sm mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            className="h-8 text-sm"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => handleCommentSubmit(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
