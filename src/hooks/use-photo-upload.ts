
import { useState, useCallback } from "react";
import { uploadPhoto } from "@/services/photoService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface UsePhotoUploadProps {
  form: any;
  maxPhotos: number;
  maxFileSize: number;
}

export const usePhotoUpload = ({ form, maxPhotos, maxFileSize }: UsePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload photos",
      });
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const currentPhotos = form.getValues("photos") || [];
    
    if (currentPhotos.length + files.length > maxPhotos) {
      setUploadError(`You can only upload a maximum of ${maxPhotos} photos`);
      toast({
        variant: "destructive",
        title: "Too many photos",
        description: `You can only upload a maximum of ${maxPhotos} photos`,
      });
      return;
    }
    
    // Validate files
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} is too large. Maximum file size is 5MB.`,
        });
        continue;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
        });
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = validFiles.map(file => {
        return uploadPhoto(file, user.id)
          .catch(error => {
            console.error(`Error uploading ${file.name}:`, error);
            toast({
              variant: "destructive",
              title: `Error uploading ${file.name}`,
              description: error.message || "Upload failed"
            });
            return null;
          });
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads (null values)
      const successfulUploads = uploadedUrls.filter(url => url) as string[];
      
      if (successfulUploads.length > 0) {
        form.setValue("photos", [...currentPhotos, ...successfulUploads], { shouldValidate: true });
        
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} photo${successfulUploads.length > 1 ? 's' : ''} uploaded successfully`,
        });
      } else {
        setUploadError("All uploads failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Photo upload error:", error);
      setUploadError(error.message || "There was an error uploading your photos");
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your photos",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  }, [user, form, maxPhotos, maxFileSize]);
  
  const removePhoto = useCallback((index: number) => {
    const photos = form.getValues("photos");
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    form.setValue("photos", newPhotos, { shouldValidate: true });
    
    toast({
      title: "Photo removed",
      description: "Photo has been removed from your profile",
    });
  }, [form]);

  return {
    uploading,
    uploadError,
    handleFileUpload,
    removePhoto,
    setUploadError
  };
};
