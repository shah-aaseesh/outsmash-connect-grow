
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ProfileFormValues } from "@/utils/profileSetupUtils";

export const submitProfileData = async (data: ProfileFormValues, userId: string): Promise<void> => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
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
          profile_id: userId,
          url: photoUrl,
          is_primary: index === 0,
        });
    });
    
    await Promise.all(photoPromises);
    
    const { error: prefError } = await supabase
      .from('preferences')
      .upsert({
        profile_id: userId,
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
          profile_id: userId,
          interest_id: interest
        });
    });
    
    await Promise.all(interestPromises);
    
  } catch (error: any) {
    console.error("Error saving profile:", error);
    throw error;
  }
};
