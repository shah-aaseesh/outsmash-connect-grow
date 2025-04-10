
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileSetupPreferences = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Your Preferences</h2>
        <p className="text-muted-foreground text-sm">
          Let us know what you're looking for
        </p>
      </div>
      
      {/* Looking For */}
      <FormField
        control={form.control}
        name="lookingFor"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>I'm interested in</FormLabel>
            <div className="space-y-3">
              {["relationship", "friendship", "casual", "networking"].map((option) => (
                <FormField
                  key={option}
                  control={form.control}
                  name="lookingFor"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              const newValue = checked
                                ? [...currentValues, option]
                                : currentValues.filter((value: string) => value !== option);
                              
                              form.setValue("lookingFor", newValue, { shouldValidate: true });
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer capitalize">
                          {option}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Age Range Preference */}
      <div className="space-y-3">
        <FormLabel>Age Range</FormLabel>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Min: {form.watch("ageRange.min")} years</span>
          <span className="text-sm">Max: {form.watch("ageRange.max")} years</span>
        </div>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="ageRange.min"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Slider
                    min={18}
                    max={80}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                      // Ensure max is at least equal to min
                      if (vals[0] > form.getValues("ageRange.max")) {
                        form.setValue("ageRange.max", vals[0]);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ageRange.max"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Slider
                    min={18}
                    max={80}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                      // Ensure min is at most equal to max
                      if (vals[0] < form.getValues("ageRange.min")) {
                        form.setValue("ageRange.min", vals[0]);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Distance Preference */}
      <FormField
        control={form.control}
        name="distance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Maximum Distance</FormLabel>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{field.value} miles</span>
            </div>
            <FormControl>
              <Slider
                min={1}
                max={100}
                step={1}
                value={[field.value]}
                onValueChange={(vals) => field.onChange(vals[0])}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileSetupPreferences;
