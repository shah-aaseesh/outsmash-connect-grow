
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Camera, ImagePlus, X } from "lucide-react";

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const ProfileSetupPhotos = ({ form }: { form: any }) => {
  const [dragActive, setDragActive] = useState(false);
  
  // Mock photo upload functionality
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload the files to your server/storage
    // Here we'll just create object URLs for preview
    const currentPhotos = form.getValues("photos") || [];
    const newPhotos = [...currentPhotos];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Create a URL for the file (simulating upload)
        const photoUrl = URL.createObjectURL(file);
        newPhotos.push(photoUrl);
      }
    });
    
    form.setValue("photos", newPhotos, { shouldValidate: true });
  };
  
  const removePhoto = (index: number) => {
    const photos = form.getValues("photos");
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    form.setValue("photos", newPhotos, { shouldValidate: true });
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const currentPhotos = form.getValues("photos") || [];
    const newPhotos = [...currentPhotos];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const photoUrl = URL.createObjectURL(file);
        newPhotos.push(photoUrl);
      }
    });
    
    form.setValue("photos", newPhotos, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Add your best photos</h2>
        <p className="text-muted-foreground text-sm">
          Add at least one photo to continue. Your first photo will be your profile picture.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="photos"
        render={({ field }) => (
          <FormItem>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"}
                ${field.value?.length > 0 ? "pb-4" : "pb-8"}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drag and drop your photos here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="relative"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Browse Photos
                  <input 
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </div>
              
              {/* Photo previews */}
              {field.value?.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {field.value.map((photo: string, index: number) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-md overflow-hidden group"
                    >
                      <img 
                        src={photo} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 right-1 text-xs bg-black/60 text-white py-1 px-2 rounded text-center">
                          Main Photo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileSetupPhotos;
