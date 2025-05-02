import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  CalendarIcon,
  Camera,
  Heart,
  MapPin,
  Mic,
  Music,
  Palette,
  Settings,
  Smile,
  User
} from "lucide-react";
import { format } from "date-fns";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ProfileSetupBasics from "@/components/ProfileSetupBasics";
import ProfileSetupPhotos from "@/components/ProfileSetupPhotos";
import ProfileSetupInterests from "@/components/ProfileSetupInterests";
import ProfileSetupPreferences from "@/components/ProfileSetupPreferences";
import ProfileSetupBio from "@/components/ProfileSetupBio";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  { id: "name", label: "Name", icon: User },
  { id: "birthdate", label: "Birth Date", icon: Calendar },
  { id: "gender", label: "Gender", icon: User },
  { id: "location", label: "Location", icon: MapPin },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "bio", label: "About You", icon: Mic }
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  gender: z.string().min(1, { message: "Please select your gender" }),
  birthdate: z.date({ required_error: "Please select your birth date" }),
  location: z.string().min(1, { message: "Please enter your location" }),
  photos: z.array(z.string()).min(1, { message: "Please upload at least one photo" }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
  lookingFor: z.array(z.string()).min(1, { message: "Please select what you're looking for" }),
  ageRange: z.object({
    min: z.number().min(18),
    max: z.number().min(18)
  }),
  distance: z.number().min(1),
  bio: z.string().min(10, { message: "Please write a bit more about yourself" }).max(500),
  prompt1: z.string().optional(),
  prompt2: z.string().optional()
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileSetup = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, setProfileComplete } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      location: "",
      photos: [],
      interests: [],
      lookingFor: [],
      ageRange: { min: 18, max: 50 },
      distance: 25,
      bio: "",
    },
    mode: "onChange"
  });
  
  const isLastStep = step === steps.length - 1;
  
  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const output = await form.trigger(fields as any);
    
    if (!output) {
      toast({
        variant: "destructive",
        title: "Please fill in all required fields",
        description: "Make sure to complete the current step before continuing"
      });
      return;
    }
    
    if (isLastStep) {
      await onSubmit(form.getValues());
    } else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const getFieldsForStep = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0: return ["name"];
      case 1: return ["birthdate"];
      case 2: return ["gender"];
      case 3: return ["location"];
      case 4: return ["photos"];
      case 5: return ["interests"];
      case 6: return ["lookingFor", "ageRange", "distance"];
      case 7: return ["bio", "prompt1", "prompt2"];
      default: return [];
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to complete your profile",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: data.name,
          gender: data.gender,
          birthdate: data.birthdate.toISOString(),
          location: data.location,
          bio: data.bio,
          prompt1: data.prompt1,
          prompt2: data.prompt2,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      const photoPromises = data.photos.map((photoUrl, index) => {
        return supabase
          .from('photos')
          .upsert({
            profile_id: user.id,
            url: photoUrl,
            is_primary: index === 0,
          });
      });
      
      await Promise.all(photoPromises);
      
      const { error: prefError } = await supabase
        .from('preferences')
        .upsert({
          profile_id: user.id,
          looking_for: data.lookingFor,
          min_age: data.ageRange.min,
          max_age: data.ageRange.max,
          distance: data.distance
        });
      
      if (prefError) throw prefError;
      
      const interestPromises = data.interests.map(interest => {
        return supabase
          .from('profile_interests')
          .upsert({
            profile_id: user.id,
            interest_id: interest
          });
      });
      
      await Promise.all(interestPromises);
      
      setProfileComplete(true);
      
      toast({
        title: "Profile created!",
        description: "Your profile has been successfully set up.",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error.message || "There was an error saving your profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: return <NameStep form={form} />;
      case 1: return <BirthDateStep form={form} />;
      case 2: return <GenderStep form={form} />;
      case 3: return <LocationStep form={form} />;
      case 4: return <ProfileSetupPhotos form={form} />;
      case 5: return <ProfileSetupInterests form={form} />;
      case 6: return <ProfileSetupPreferences form={form} />;
      case 7: return <ProfileSetupBio form={form} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Let's set up your profile so others can get to know you
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6 px-2 relative">
          {steps.map((s, i) => (
            <div 
              key={s.id}
              className="flex flex-col items-center"
            >
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1
                  ${i < step 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : i === step 
                    ? "border-primary text-primary" 
                    : "border-muted-foreground/30 text-muted-foreground/50"
                  }`}
              >
                {i < step ? (
                  <span>✓</span>
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span 
                className={`text-xs font-medium hidden md:block
                  ${i <= step ? "text-primary" : "text-muted-foreground/50"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        
        <Card className="border-primary/20 shadow-lg relative">
          <CardContent className="p-6 space-y-4">
            <Form {...form}>
              <form>
                {renderStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 0 || isSubmitting}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? "Saving..." 
                      : isLastStep 
                        ? "Complete Profile" 
                        : "Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <p>Step {step + 1} of {steps.length}</p>
        </div>
      </div>
    </div>
  );
};

const NameStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">What's your name?</h2>
        <p className="text-muted-foreground text-sm">Let others know what to call you</p>
      </div>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const BirthDateStep = ({ form }: { form: any }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      form.setValue('birthdate', date);
    }
  };
  
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">When were you born?</h2>
        <p className="text-muted-foreground text-sm">Your age helps us match you appropriately</p>
      </div>
      
      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input 
                type="date"
                value={formatDateForInput(field.value)}
                onChange={handleDateChange}
                max={formatDateForInput(new Date())}
                min="1900-01-01"
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const GenderStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">How do you identify?</h2>
        <p className="text-muted-foreground text-sm">Select your gender identity</p>
      </div>
      
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="woman" />
                  </FormControl>
                  <FormLabel className="font-normal">Woman</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="man" />
                  </FormControl>
                  <FormLabel className="font-normal">Man</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non-binary" />
                  </FormControl>
                  <FormLabel className="font-normal">Non-binary</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="other" />
                  </FormControl>
                  <FormLabel className="font-normal">Other</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const LocationStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Where are you located?</h2>
        <p className="text-muted-foreground text-sm">Help us find matches near you</p>
      </div>
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="City, State" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileSetup;
