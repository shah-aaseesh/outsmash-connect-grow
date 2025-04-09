
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Briefcase, Award } from "lucide-react";

// Sample data for opportunities
const opportunities = [
  {
    id: 1,
    title: "Tech Innovators Summer Program",
    type: "Summer Program",
    organization: "Future Tech Foundation",
    location: "Virtual & Boston, MA",
    date: "June 15 - August 10, 2025",
    description: "A 8-week immersive program for high school students interested in technology, innovation, and entrepreneurship.",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Youth Environmental Leadership Internship",
    type: "Internship",
    organization: "Green Earth Initiative",
    location: "Chicago, IL",
    date: "Applications due by May 1, 2025",
    description: "Gain hands-on experience working on environmental conservation projects and developing leadership skills.",
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Global Youth Essay Competition",
    type: "Competition",
    organization: "World Education Council",
    location: "Online",
    date: "Submissions due by April 30, 2025",
    description: "Write an essay on 'Creating a Sustainable Future' for a chance to win scholarships and international recognition.",
    icon: <Award className="h-5 w-5" />
  }
];

const OpportunitiesSection = () => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Opportunities
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Find programs, internships, competitions, and more to help you grow and explore your interests.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 self-start md:self-auto">
            Explore All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="glass-card h-full border-muted">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2">
                    {opp.type}
                  </Badge>
                  <div className="p-2 rounded-full bg-secondary/50">
                    {opp.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{opp.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <span>{opp.organization}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{opp.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {opp.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
