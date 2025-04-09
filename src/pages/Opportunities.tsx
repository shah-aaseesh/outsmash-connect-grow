
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Calendar, MapPin, Briefcase, Award, Plus } from "lucide-react";

// Sample data for opportunities
const opportunitiesData = [
  {
    id: 1,
    title: "Tech Innovators Summer Program",
    type: "Summer Program",
    category: "Internship",
    organization: "Future Tech Foundation",
    location: "Virtual & Boston, MA",
    country: "USA",
    date: "June 15 - August 10, 2025",
    description: "A 8-week immersive program for high school students interested in technology, innovation, and entrepreneurship.",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Youth Environmental Leadership Internship",
    type: "Internship",
    category: "Internship",
    organization: "Green Earth Initiative",
    location: "Chicago, IL",
    country: "USA",
    date: "Applications due by May 1, 2025",
    description: "Gain hands-on experience working on environmental conservation projects and developing leadership skills.",
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Global Youth Essay Competition",
    type: "Competition",
    category: "Volunteering",
    organization: "World Education Council",
    location: "Online",
    country: "Global",
    date: "Submissions due by April 30, 2025",
    description: "Write an essay on 'Creating a Sustainable Future' for a chance to win scholarships and international recognition.",
    icon: <Award className="h-5 w-5" />
  },
  {
    id: 4,
    title: "Coding Bootcamp for High School Students",
    type: "Training",
    category: "Job",
    organization: "Code Academy",
    location: "San Francisco, CA",
    country: "USA",
    date: "July 1 - July 30, 2025",
    description: "A month-long intensive coding bootcamp designed specifically for high school students looking to gain industry-level programming skills.",
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: 5,
    title: "Community Service Leadership Program",
    type: "Volunteering",
    category: "Volunteering",
    organization: "Youth Community Network",
    location: "London",
    country: "UK",
    date: "Ongoing, flexible schedule",
    description: "Develop leadership skills while making a difference in your local community through organized service projects and initiatives.",
    icon: <Award className="h-5 w-5" />
  },
  {
    id: 6,
    title: "Junior Financial Analyst Position",
    type: "Job",
    category: "Job",
    organization: "NextGen Finance",
    location: "Toronto",
    country: "Canada",
    date: "Applications due by March 15, 2025",
    description: "Part-time position for high school graduates interested in gaining real-world experience in financial analysis and consulting.",
    icon: <Briefcase className="h-5 w-5" />
  }
];

const Opportunities = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");

  // Get unique categories and countries for filters
  const categories = ["All", ...new Set(opportunitiesData.map(opp => opp.category))];
  const countries = ["All", ...new Set(opportunitiesData.map(opp => opp.country))];

  // Filter opportunities based on selected filters
  const filteredOpportunities = opportunitiesData.filter(opp => 
    (categoryFilter === "All" || opp.category === categoryFilter) &&
    (countryFilter === "All" || opp.country === countryFilter)
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="py-12 md:py-20">
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
              <Button className="mt-4 md:mt-0 gap-2 self-start md:self-auto">
                <Plus className="h-4 w-4" /> Add Opportunity
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="w-full md:w-1/3">
                <Select onValueChange={setCategoryFilter} defaultValue={categoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Select onValueChange={setCountryFilter} defaultValue={countryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <Card key={opp.id} className="glass-card h-full border-muted">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2">
                        {opp.category}
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
      </main>
      <Footer />
    </div>
  );
};

export default Opportunities;
