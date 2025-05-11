
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
    
    // Check if the bucket exists first
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    // Default bucket name - this should match what exists in your Supabase project
    let bucketName = 'user-photos';
    
    // Check if our expected bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // If not found, try to create it (this requires storage.buckets permissions)
      try {
        const { error: createBucketError } = await supabase
          .storage
          .createBucket(bucketName, { public: true });
          
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          
          // If bucket creation fails, try to use an existing bucket instead
          if (buckets && buckets.length > 0) {
            bucketName = buckets[0].name;
            console.log(`Using existing bucket: ${bucketName}`);
          } else {
            throw new Error("No storage buckets available. Please contact support.");
          }
        }
      } catch (err) {
        console.error("Failed to create bucket:", err);
        
        // Try to use an existing bucket
        if (buckets && buckets.length > 0) {
          bucketName = buckets[0].name;
          console.log(`Using existing bucket: ${bucketName}`);
        } else {
          throw new Error("No storage buckets available. Please contact support.");
        }
      }
    }
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      
      if (uploadError.message.includes("The resource was not found")) {
        throw new Error("Storage bucket not found. Please contact support.");
      }
      
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
    // List buckets to find the correct one
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    // Default bucket name
    let bucketName = 'user-photos';
    
    // Check if our expected bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists && buckets && buckets.length > 0) {
      // If not found, use the first available bucket
      bucketName = buckets[0].name;
      console.log(`Using existing bucket: ${bucketName}`);
    }
    
    // Extract the file path from the URL
    const storageUrl = supabase.storage.from(bucketName).getPublicUrl('').data.publicUrl;
    
    // Handle case where URL doesn't contain the storage URL
    if (!url || !url.includes(storageUrl) && !url.includes(bucketName)) {
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
