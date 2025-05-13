
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
    
    // Get default bucket name
    const bucketName = 'user-photos';
    
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    // Verify that our expected bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.error(`Bucket '${bucketName}' does not exist`);
      throw new Error(`The 'user-photos' bucket does not exist. Please create it in your Supabase dashboard:
        1. Go to Storage in your Supabase dashboard
        2. Click "New Bucket"
        3. Name it "user-photos"
        4. Enable Row Level Security (RLS)`);
    }
    
    // Upload to Supabase storage with improved error handling
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      
      // Provide more specific RLS-related error messages
      if (uploadError.message.includes("storage quota")) {
        throw new Error("Storage quota exceeded. Please delete some files first.");
      }
      
      if (uploadError.message.includes("permission") || uploadError.message.includes("not authorized")) {
        throw new Error(`Permission denied: RLS policies need to be configured.
        
Please go to your Supabase dashboard and set up these policies:

1. Navigate to Storage → Policies
2. Select the "user-photos" bucket 
3. Click "New Policy" → "Create a policy from scratch"
4. Name: "User photo management"
5. For "Operation", select "Apply this policy to all operations" 
6. For "Policy definition" paste this SQL:
   (storage.foldername)[1]::uuid = auth.uid()
7. Click "Save Policy"

This will allow users to only manage their own photos.`);
      }
      
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
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
    // Use fixed bucket name now that we've verified it exists
    const bucketName = 'user-photos';
    
    // Extract the file path from the URL
    const storageUrl = supabase.storage.from(bucketName).getPublicUrl('').data.publicUrl;
    
    // Handle case where URL doesn't contain the storage URL
    if (!url || (!url.includes(storageUrl) && !url.includes(bucketName))) {
      console.error("Invalid photo URL format:", url);
      throw new Error("Invalid photo URL format");
    }
    
    // Try to extract the file path based on bucket name in URL
    let filePath;
    if (url.includes(storageUrl)) {
      filePath = url.replace(storageUrl, '');
    } else {
      // Try to extract path another way if the URL format is different
      const urlParts = url.split(bucketName);
      if (urlParts.length > 1) {
        filePath = urlParts[1].replace(/^\//, '');
      } else {
        throw new Error("Could not determine file path from URL");
      }
    }
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error("Supabase delete error:", error);
      
      // Provide more specific RLS-related error messages for deletion
      if (error.message.includes("permission") || error.message.includes("not authorized")) {
        throw new Error(`Permission denied: RLS policies need to be configured.
        
Please go to your Supabase dashboard and set up this policy:

1. Navigate to Storage → Policies
2. Select the "user-photos" bucket 
3. Click "New Policy" → "Create a policy from scratch"
4. Name: "User photo management"
5. For "Operation", select "Apply this policy to all operations" 
6. For "Policy definition" paste this SQL:
   (storage.foldername)[1]::uuid = auth.uid()
7. Click "Save Policy"

This will allow users to only manage their own photos.`);
      }
      
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
