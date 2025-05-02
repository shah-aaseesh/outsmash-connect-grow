
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { uploadPhoto } from "@/services/photoService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProfileSetupPhotos = ({ form }: { form: any }) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (currentPhotos.length + files.length > MAX_PHOTOS) {
      toast({
        variant: "destructive",
        title: "Too many photos",
        description: `You can only upload a maximum of ${MAX_PHOTOS} photos`,
      });
      return;
    }
    
    // Validate files
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
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
      const uploadPromises = validFiles.map(file => uploadPhoto(file, user.id));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads (undefined values)
      const successfulUploads = uploadedUrls.filter(url => url);
      
      if (successfulUploads.length > 0) {
        form.setValue("photos", [...currentPhotos, ...successfulUploads], { shouldValidate: true });
        
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} photo${successfulUploads.length > 1 ? 's' : ''} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your photos",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };
  
  const removePhoto = (index: number) => {
    const photos = form.getValues("photos");
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    form.setValue("photos", newPhotos, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Add Your Photos</h2>
        <p className="text-muted-foreground text-sm">
          Upload photos that show your best self
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="photos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photos (Maximum {MAX_PHOTOS})</FormLabel>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.isArray(field.value) && field.value.map((url: string, index: number) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-md overflow-hidden group border border-border"
                >
                  <img 
                    src={url} 
                    alt={`User photo ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full"
                      onClick={() => removePhoto(index)}
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {(!field.value || field.value.length < MAX_PHOTOS) && (
                <div className="border border-dashed border-border rounded-md aspect-square flex flex-col items-center justify-center p-4 hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                    multiple
                    disabled={uploading}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                        <span className="text-sm text-muted-foreground text-center">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Image className="h-8 w-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground text-center font-medium">
                          Upload photos
                        </span>
                        <span className="text-xs text-muted-foreground/70 text-center mt-1">
                          Click or drag files here
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
            <FormMessage />
            <p className="text-xs text-muted-foreground mt-2">
              Upload clear photos that show your face (max 5MB each). First photo will be your main profile picture.
            </p>
          </FormItem>
        )}
      />
      
      <div className="p-4 bg-primary/5 rounded-md">
        <h3 className="font-medium mb-2">Photo Tips</h3>
        <ul className="text-sm space-y-1">
          <li>• Use high quality, recent photos</li>
          <li>• Include at least one clear photo of your face</li>
          <li>• Add photos showing your interests and lifestyle</li>
          <li>• Avoid group photos for your main image</li>
          <li>• Include full-body photos</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSetupPhotos;
