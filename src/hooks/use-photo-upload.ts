
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
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const { user } = useAuth();

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file size
    if (file.size > maxFileSize) {
      return { 
        valid: false, 
        message: `${file.name} is too large. Maximum file size is 5MB.` 
      };
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { 
        valid: false, 
        message: `${file.name} is not an image file.` 
      };
    }
    
    return { valid: true };
  };

  const addFilesToPreview = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const currentPhotos = form.getValues("photos") || [];
    const currentPreviews = [...previewFiles];
    
    // Check if we would exceed the maximum photos
    if (currentPhotos.length + currentPreviews.length + files.length > maxPhotos) {
      setUploadError(`You can only upload a maximum of ${maxPhotos} photos`);
      toast({
        variant: "destructive",
        title: "Too many photos",
        description: `You can only upload a maximum of ${maxPhotos} photos`,
      });
      return;
    }
    
    // Validate files and add valid ones to preview
    const newValidFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      
      if (validation.valid) {
        newValidFiles.push(file);
      } else if (validation.message) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: validation.message,
        });
      }
    }
    
    if (newValidFiles.length > 0) {
      setPreviewFiles([...currentPreviews, ...newValidFiles]);
    }
  };

  const removePreviewFile = (index: number) => {
    const newFiles = [...previewFiles];
    newFiles.splice(index, 1);
    setPreviewFiles(newFiles);
  };
  
  const uploadPreviewFiles = async () => {
    if (previewFiles.length === 0) return;
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload photos",
      });
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      const uploadPromises = previewFiles.map(file => {
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
        const currentPhotos = form.getValues("photos") || [];
        form.setValue("photos", [...currentPhotos, ...successfulUploads], { shouldValidate: true });
        
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} photo${successfulUploads.length > 1 ? 's' : ''} uploaded successfully`,
        });
        
        // Clear preview files that were successfully uploaded
        setPreviewFiles([]);
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
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = event.target.files;
    addFilesToPreview(files);
    // Reset the file input
    event.target.value = '';
  }, []);
  
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
    setUploadError,
    previewFiles,
    removePreviewFile,
    uploadPreviewFiles,
  };
};
