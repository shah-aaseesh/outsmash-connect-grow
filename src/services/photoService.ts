
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

// Upload a photo to Supabase storage
export const uploadPhoto = async (file: File, userId: string): Promise<string> => {
  try {
    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 5MB)`);
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `photos/${fileName}`;
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      
      // Check for specific error types and provide better error messages
      if (uploadError.message.includes("storage quota")) {
        throw new Error("Storage quota exceeded. Please delete some files first.");
      }
      
      if (uploadError.message.includes("permission")) {
        throw new Error("You don't have permission to upload files. Please login again.");
      }
      
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Delete a photo from Supabase storage
export const deletePhoto = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const storageUrl = supabase.storage.from('user-photos').getPublicUrl('').data.publicUrl;
    
    // Handle case where URL doesn't contain the storage URL
    if (!url.includes(storageUrl)) {
      console.error("Invalid photo URL format:", url);
      throw new Error("Invalid photo URL format");
    }
    
    const filePath = url.replace(storageUrl, '');
    
    const { error } = await supabase.storage
      .from('user-photos')
      .remove([filePath]);
      
    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
