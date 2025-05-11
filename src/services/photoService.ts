
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
    
    // Get default bucket name from environment if available, or use default
    const defaultBucketName = 'user-photos';
    
    // Check if any buckets exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    // If no buckets exist at all, we need to create one or show an error
    if (!buckets || buckets.length === 0) {
      try {
        // Try to create the default bucket
        const { error: createBucketError } = await supabase
          .storage
          .createBucket(defaultBucketName, { 
            public: true,
            fileSizeLimit: 5242880 // 5MB in bytes
          });
          
        if (createBucketError) {
          console.error("Failed to create storage bucket:", createBucketError);
          
          // Special handling for permissions issues
          if (createBucketError.message.includes("permission")) {
            throw new Error("Your account doesn't have permission to create storage buckets. Please set up storage in your Supabase dashboard first.");
          }
          
          throw new Error("Unable to create storage bucket. Please set up storage in your Supabase dashboard first.");
        }
      } catch (err: any) {
        console.error("Error creating bucket:", err);
        throw new Error("No storage buckets available. Please set up storage in your Supabase dashboard first.");
      }
    }
    
    // At this point, either we created a bucket or there are existing buckets
    // Try to find our preferred bucket first
    let bucketName = defaultBucketName;
    const bucketExists = buckets?.some(bucket => bucket.name === defaultBucketName);
    
    if (!bucketExists && buckets && buckets.length > 0) {
      // If our preferred bucket doesn't exist, use the first available one
      bucketName = buckets[0].name;
      console.log(`Using existing bucket: ${bucketName}`);
    }
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      
      if (uploadError.message.includes("The resource was not found")) {
        throw new Error(`Storage bucket '${bucketName}' not found. Please check your Supabase storage configuration.`);
      }
      
      // Check for specific error types and provide better error messages
      if (uploadError.message.includes("storage quota")) {
        throw new Error("Storage quota exceeded. Please delete some files first.");
      }
      
      if (uploadError.message.includes("permission")) {
        throw new Error("You don't have permission to upload files. Please check your Supabase RLS policies.");
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
    // Get default bucket name
    const defaultBucketName = 'user-photos';
    
    // List buckets to find the correct one
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    if (!buckets || buckets.length === 0) {
      throw new Error("No storage buckets available. Please set up storage in your Supabase dashboard first.");
    }
    
    // Check if our expected bucket exists
    let bucketName = defaultBucketName;
    const bucketExists = buckets?.some(bucket => bucket.name === defaultBucketName);
    
    if (!bucketExists && buckets && buckets.length > 0) {
      // If not found, use the first available bucket
      bucketName = buckets[0].name;
      console.log(`Using existing bucket for deletion: ${bucketName}`);
    }
    
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
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
