
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Calendar,
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

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileSetupBasics from "@/components/ProfileSetupBasics";
import ProfileSetupPhotos from "@/components/ProfileSetupPhotos";
import ProfileSetupInterests from "@/components/ProfileSetupInterests";
import ProfileSetupPreferences from "@/components/ProfileSetupPreferences";
import ProfileSetupBio from "@/components/ProfileSetupBio";

const steps = [
  { id: "basics", label: "Basics", icon: User },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "bio", label: "About You", icon: Mic }
];

// Main form schema - combine all step schemas
const formSchema = z.object({
  // Basic info
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  gender: z.string().min(1, { message: "Please select your gender" }),
  birthdate: z.date({ required_error: "Please select your birth date" }),
  location: z.string().min(1, { message: "Please enter your location" }),
  
  // Photos - array of photo URLs or files
  photos: z.array(z.string()).min(1, { message: "Please upload at least one photo" }),
  
  // Interests
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
  
  // Preferences
  lookingFor: z.array(z.string()).min(1, { message: "Please select what you're looking for" }),
  ageRange: z.object({
    min: z.number().min(18),
    max: z.number().min(18)
  }),
  distance: z.number().min(1),
  
  // Bio
  bio: z.string().min(10, { message: "Please write a bit more about yourself" }).max(500),
  prompt1: z.string().optional(),
  prompt2: z.string().optional()
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileSetup = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  
  // Form
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
    
    if (!output) return;
    
    if (isLastStep) {
      await onSubmit(form.getValues());
    } else {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const getFieldsForStep = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0: return ["name", "gender", "birthdate", "location"];
      case 1: return ["photos"];
      case 2: return ["interests"];
      case 3: return ["lookingFor", "ageRange", "distance"];
      case 4: return ["bio", "prompt1", "prompt2"];
      default: return [];
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Profile data:", data);
    
    // Here you would typically submit to your API
    // For now, we'll just show a success toast and redirect
    
    toast({
      title: "Profile created!",
      description: "Your profile has been successfully set up.",
    });
    
    // In a real app, you would store whether the profile is complete
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 0: return <ProfileSetupBasics form={form} />;
      case 1: return <ProfileSetupPhotos form={form} />;
      case 2: return <ProfileSetupInterests form={form} />;
      case 3: return <ProfileSetupPreferences form={form} />;
      case 4: return <ProfileSetupBio form={form} />;
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
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-2">
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
        
        {/* Form Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <Form {...form}>
              <form>
                {renderStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={nextStep}
                  >
                    {isLastStep ? "Complete Profile" : "Continue"}
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

export default ProfileSetup;
