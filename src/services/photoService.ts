
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Upload a photo to Supabase storage
export const uploadPhoto = async (file: File, userId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `photos/${fileName}`;
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Delete a photo from Supabase storage
export const deletePhoto = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const storageUrl = supabase.storage.from('user-photos').getPublicUrl('').data.publicUrl;
    const filePath = url.replace(storageUrl, '');
    
    const { error } = await supabase.storage
      .from('user-photos')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
