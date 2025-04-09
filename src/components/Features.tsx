
import { Award, UserPlus, Briefcase, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <UserPlus className="h-6 w-6 text-primary" />,
    title: "Build Connections",
    description: "Connect with peers who share your interests and goals. Grow your network and find friends who inspire you."
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Showcase Achievements",
    description: "Create a dynamic profile highlighting your accomplishments, skills, and projects to stand out."
  },
  {
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    title: "Discover Opportunities",
    description: "Find internships, competitions, programs, and scholarships perfectly suited to your interests."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Engage in Communities",
    description: "Join topic-based groups, participate in discussions, and learn from like-minded peers."
  }
];

const Features = () => {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Outsmash provides the tools and community you need to explore your interests,
            develop your skills, and prepare for your future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl transition-all duration-300 hover:border-primary/50 hover:translate-y-[-4px]"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
