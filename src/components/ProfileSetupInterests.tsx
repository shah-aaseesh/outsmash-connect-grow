
import { useFormContext } from "react-hook-form";
import { 
  Plane, 
  Bike, 
  Coffee, 
  Book, 
  Utensils, 
  Palette, 
  Music, 
  Film, 
  DogIcon, 
  Dumbbell, 
  Wine, 
  MountainSnow, 
  Gamepad2, 
  Camera, 
  Shirt 
} from "lucide-react";

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// List of common interests
const interests = [
  { id: "travel", label: "Travel", icon: Plane },
  { id: "cycling", label: "Cycling", icon: Bike },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "reading", label: "Reading", icon: Book },
  { id: "cooking", label: "Cooking", icon: Utensils },
  { id: "art", label: "Art", icon: Palette },
  { id: "music", label: "Music", icon: Music },
  { id: "movies", label: "Movies", icon: Film },
  { id: "dogs", label: "Dogs", icon: DogIcon },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "wine", label: "Wine", icon: Wine },
  { id: "hiking", label: "Hiking", icon: MountainSnow },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "fashion", label: "Fashion", icon: Shirt }
];

const ProfileSetupInterests = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">What are you into?</h2>
        <p className="text-muted-foreground text-sm">
          Select your interests so we can match you with like-minded people
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="interests"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-3 gap-3">
              {interests.map((interest) => (
                <FormField
                  key={interest.id}
                  control={form.control}
                  name="interests"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={interest.id}
                        className={`flex flex-col items-center space-y-2 rounded-md border p-3 cursor-pointer transition-all hover:border-primary
                          ${field.value?.includes(interest.id) 
                            ? "border-primary bg-primary/5" 
                            : "border-muted"}`}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const newValue = currentValues.includes(interest.id)
                            ? currentValues.filter((value: string) => value !== interest.id)
                            : [...currentValues, interest.id];
                          
                          form.setValue("interests", newValue, { shouldValidate: true });
                        }}
                      >
                        <interest.icon className="h-6 w-6" />
                        <FormLabel className="font-normal text-sm cursor-pointer">
                          {interest.label}
                        </FormLabel>
                        <Checkbox
                          checked={field.value?.includes(interest.id)}
                          className="sr-only"
                          onCheckedChange={() => {}}
                        />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage className="mt-3 text-center" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileSetupInterests;
