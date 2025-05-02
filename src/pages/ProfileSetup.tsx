
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  CalendarIcon,
  Camera,
  Heart,
  MapPin,
  Mic,
  Settings,
  User
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ProfileSetupProgress from "@/components/ProfileSetupProgress";
import ProfileSetupPhotos from "@/components/ProfileSetupPhotos";
import ProfileSetupInterests from "@/components/ProfileSetupInterests";
import ProfileSetupPreferences from "@/components/ProfileSetupPreferences";
import ProfileSetupBio from "@/components/ProfileSetupBio";
import { useAuth } from "@/contexts/AuthContext";
import { submitProfileData } from "@/services/profileSubmission";
import { formSchema, steps as setupSteps, getFieldsForStep, ProfileFormValues } from "@/utils/profileSetupUtils";

// Import individual step components
import { NameStep, BirthDateStep, GenderStep, LocationStep } from "@/components/ProfileSetupSteps";

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
  
  const isLastStep = step === setupSteps.length - 1;
  
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
      await submitProfileData(data, user.id);
      
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

  // Map the steps with the correct icons for the progress component
  const stepsWithIcons = setupSteps.map(s => ({
    ...s,
    icon: s.icon as string
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Let's set up your profile so others can get to know you
          </p>
        </div>
        
        <ProfileSetupProgress steps={stepsWithIcons} currentStep={step} />
        
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
          <p>Step {step + 1} of {setupSteps.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
