
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to Connect, Share, and Grow?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of high school and gap year students who are building their future, 
            one connection at a time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-md px-8">
              Get Started - It's Free
            </Button>
            <Button size="lg" variant="outline" className="text-md">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background/80 to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
    </section>
  );
};

export default CallToAction;
