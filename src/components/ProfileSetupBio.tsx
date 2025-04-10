
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ProfileSetupBio = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Tell us about yourself</h2>
        <p className="text-muted-foreground text-sm">
          Share a bit about who you are and what makes you unique
        </p>
      </div>
      
      {/* Bio */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Me</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Share a few things about yourself, your interests, and what you're looking for..."
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                {field.value.length}/500
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Prompts */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="prompt1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I'm happiest when...</FormLabel>
              <FormControl>
                <Input placeholder="Share what brings you joy" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="prompt2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>My ideal first date would be...</FormLabel>
              <FormControl>
                <Input placeholder="Describe your perfect first date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProfileSetupBio;
